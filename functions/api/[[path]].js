// Cloudflare Pages API - Main Router
// This handles all API requests for the GCBF Church Management System

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export async function onRequest(context) {
  const { request, env } = context
  const url = new URL(request.url)
  const path = url.pathname.replace('/api/', '')

  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Route to appropriate handler
    if (path.startsWith('auth/')) {
      return handleAuth(request, env, path)
    }
    if (path.startsWith('prayers')) {
      return handlePrayers(request, env, path)
    }
    if (path.startsWith('newsletters')) {
      return handleNewsletters(request, env, path)
    }
    if (path.startsWith('receipts')) {
      return handleReceipts(request, env, path)
    }
    if (path.startsWith('ministries')) {
      return handleMinistries(request, env, path)
    }
    if (path.startsWith('finances')) {
      return handleFinances(request, env, path)
    }
    if (path.startsWith('pledges')) {
      return handlePledges(request, env, path)
    }
    if (path.startsWith('bible-reading')) {
      return handleBibleReading(request, env, path)
    }

    return jsonResponse({ error: 'Not Found' }, 404)
  } catch (error) {
    console.error('API Error:', error)
    return jsonResponse({ error: error.message }, 500)
  }
}

// Helper function for JSON responses
function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
    },
  })
}

// Authentication handlers
async function handleAuth(request, env, path) {
  const { DB } = env

  if (path === 'auth/login') {
    const { email, password } = await request.json()
    
    const user = await DB.prepare(`
      SELECT id, email, name, userType, joinDate 
      FROM users 
      WHERE email = ? AND password = ?
    `).bind(email, password).first()

    if (user) {
      return jsonResponse({ success: true, user })
    }
    return jsonResponse({ success: false, message: 'Invalid credentials' }, 401)
  }

  if (path === 'auth/register' && request.method === 'POST') {
    const userData = await request.json()
    
    try {
      const result = await DB.prepare(`
        INSERT INTO users (email, password, name, userType, phone, joinDate)
        VALUES (?, ?, ?, ?, ?, ?)
      `).bind(
        userData.email,
        userData.password,
        userData.name,
        userData.userType || 'member',
        userData.phone || null,
        new Date().toISOString().split('T')[0]
      ).run()

      const user = await DB.prepare(`
        SELECT id, email, name, userType, joinDate FROM users WHERE id = ?
      `).bind(result.meta.last_row_id).first()

      return jsonResponse({ success: true, user })
    } catch (error) {
      return jsonResponse({ success: false, message: 'Email already exists' }, 400)
    }
  }

  return jsonResponse({ error: 'Invalid auth endpoint' }, 404)
}

// Prayer handlers
async function handlePrayers(request, env, path) {
  const { DB } = env

  if (request.method === 'GET') {
    const url = new URL(request.url)
    const userId = url.searchParams.get('userId')
    const visibility = url.searchParams.get('visibility')

    let query = `
      SELECT p.*, u.name as requestedBy
      FROM prayers p
      JOIN users u ON p.userId = u.id
      WHERE 1=1
    `
    const bindings = []

    if (userId) {
      query += ` AND p.userId = ?`
      bindings.push(userId)
    }

    if (visibility) {
      query += ` AND p.visibility = ?`
      bindings.push(visibility)
    } else {
      query += ` AND p.visibility IN ('public', 'pastor')`
    }

    query += ` ORDER BY p.createdAt DESC`

    const { results } = await DB.prepare(query).bind(...bindings).all()
    return jsonResponse(results)
  }

  if (request.method === 'POST') {
    const data = await request.json()
    
    const result = await DB.prepare(`
      INSERT INTO prayers (userId, category, title, request, visibility, dateRequested, approved, approvedBy, approvedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      data.userId,
      data.category,
      data.title,
      data.request,
      data.visibility,
      data.dateRequested,
      data.approved ? 1 : 0,
      data.approvedBy || null,
      data.approvedAt || null
    ).run()

    return jsonResponse({ id: result.meta.last_row_id, success: true })
  }

  if (request.method === 'PUT') {
    const data = await request.json()
    const prayerId = path.split('/')[1]

    await DB.prepare(`
      UPDATE prayers 
      SET status = ?, dateAnswered = ?, prayerCount = ?, approved = ?, approvedBy = ?, approvedAt = ?
      WHERE id = ?
    `).bind(
      data.status,
      data.dateAnswered || null,
      data.prayerCount || 0,
      data.approved ? 1 : 0,
      data.approvedBy || null,
      data.approvedAt || null,
      prayerId
    ).run()

    return jsonResponse({ success: true })
  }

  if (request.method === 'DELETE') {
    const prayerId = path.split('/')[1]
    await DB.prepare(`DELETE FROM prayers WHERE id = ?`).bind(prayerId).run()
    return jsonResponse({ success: true })
  }

  return jsonResponse({ error: 'Method not allowed' }, 405)
}

// Newsletter handlers
async function handleNewsletters(request, env, path) {
  const { DB, STORAGE } = env

  // Handle file upload to R2
  if (path === 'newsletters/upload' && request.method === 'POST') {
    try {
      const formData = await request.formData()
      const pdfFile = formData.get('pdf')
      const coverFile = formData.get('cover')
      const pdfFileName = formData.get('pdfFileName')
      const coverFileName = formData.get('coverFileName')

      if (!pdfFile || !pdfFileName) {
        return jsonResponse({ error: 'PDF file and filename required' }, 400)
      }

      // Upload PDF to R2
      const pdfBuffer = await pdfFile.arrayBuffer()
      await STORAGE.put(`newsletters/${pdfFileName}`, pdfBuffer, {
        httpMetadata: {
          contentType: 'application/pdf'
        }
      })

      let coverUrl = null
      // Upload cover if provided
      if (coverFile && coverFileName) {
        const coverBuffer = await coverFile.arrayBuffer()
        await STORAGE.put(`newsletters/${coverFileName}`, coverBuffer, {
          httpMetadata: {
            contentType: 'image/jpeg'
          }
        })
        coverUrl = `/r2/newsletters/${coverFileName}`
      }

      return jsonResponse({
        success: true,
        pdfUrl: `/r2/newsletters/${pdfFileName}`,
        coverUrl
      })
    } catch (error) {
      console.error('Upload error:', error)
      return jsonResponse({ error: 'Upload failed: ' + error.message }, 500)
    }
  }

  if (request.method === 'GET') {
    const { results } = await DB.prepare(`
      SELECT * FROM newsletters ORDER BY date DESC LIMIT 10
    `).all()

    // Parse highlights JSON
    const newsletters = results.map(n => ({
      ...n,
      highlights: n.highlights ? JSON.parse(n.highlights) : []
    }))

    return jsonResponse(newsletters)
  }

  if (request.method === 'POST') {
    const data = await request.json()
    
    const result = await DB.prepare(`
      INSERT INTO newsletters (title, date, excerpt, issueNumber, volume, publishedBy, coverImage, downloadUrl, highlights)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      data.title,
      data.date,
      data.excerpt,
      data.issueNumber,
      data.volume || 1,
      data.publishedBy,
      data.coverImage || null,
      data.downloadUrl,
      JSON.stringify(data.highlights || [])
    ).run()

    return jsonResponse({ id: result.meta.last_row_id, success: true })
  }

  if (request.method === 'DELETE') {
    const newsletterId = path.split('/')[1]
    
    // Get newsletter info to delete files from R2
    const newsletter = await DB.prepare(`
      SELECT downloadUrl, coverImage FROM newsletters WHERE id = ?
    `).bind(newsletterId).first()
    
    if (newsletter && STORAGE) {
      // Delete files from R2
      if (newsletter.downloadUrl && newsletter.downloadUrl.startsWith('/r2/')) {
        const pdfKey = newsletter.downloadUrl.replace('/r2/', '')
        try {
          await STORAGE.delete(pdfKey)
        } catch (error) {
          console.error('Error deleting PDF from R2:', error)
        }
      }
      
      if (newsletter.coverImage && newsletter.coverImage.startsWith('/r2/')) {
        const coverKey = newsletter.coverImage.replace('/r2/', '')
        try {
          await STORAGE.delete(coverKey)
        } catch (error) {
          console.error('Error deleting cover from R2:', error)
        }
      }
    }
    
    await DB.prepare(`DELETE FROM newsletters WHERE id = ?`).bind(newsletterId).run()
    return jsonResponse({ success: true })
  }

  return jsonResponse({ error: 'Method not allowed' }, 405)
}

// Receipt upload handler
async function handleReceipts(request, env, path) {
  const { STORAGE } = env

  // Handle receipt upload to R2
  if (path === 'receipts/upload' && request.method === 'POST') {
    try {
      const formData = await request.formData()
      const receiptFile = formData.get('receipt')
      const fileName = formData.get('fileName')
      const userId = formData.get('userId')
      const giftId = formData.get('giftId')
      const paymentId = formData.get('paymentId')

      if (!receiptFile || !fileName) {
        return jsonResponse({ error: 'Receipt file and filename required' }, 400)
      }

      // Upload receipt to R2
      const receiptBuffer = await receiptFile.arrayBuffer()
      const receiptKey = `receipts/${fileName}`
      
      await STORAGE.put(receiptKey, receiptBuffer, {
        httpMetadata: {
          contentType: receiptFile.type || 'application/octet-stream'
        },
        customMetadata: {
          userId: userId || 'unknown',
          giftId: giftId || '',
          paymentId: paymentId || '',
          uploadDate: new Date().toISOString()
        }
      })

      return jsonResponse({
        success: true,
        receiptUrl: `/r2/${receiptKey}`,
        fileName: fileName
      })
    } catch (error) {
      console.error('Receipt upload error:', error)
      return jsonResponse({ error: 'Upload failed: ' + error.message }, 500)
    }
  }

  // Get receipt (redirect to R2 URL)
  if (request.method === 'GET' && path.startsWith('receipts/')) {
    const fileName = path.replace('receipts/', '')
    return jsonResponse({ receiptUrl: `/r2/receipts/${fileName}` })
  }

  return jsonResponse({ error: 'Method not allowed' }, 405)
}

// Ministry handlers
async function handleMinistries(request, env, path) {
  const { DB } = env

  if (request.method === 'GET') {
    const { results } = await DB.prepare(`
      SELECT m.*, 
        (SELECT COUNT(*) FROM attendance a WHERE a.ministryId = m.id) as attendanceCount
      FROM ministry_reports m
      WHERE m.active = 1
      ORDER BY m.name
    `).all()

    return jsonResponse(results)
  }

  if (request.method === 'POST' && path === 'ministries') {
    const data = await request.json()
    
    const result = await DB.prepare(`
      INSERT INTO ministry_reports (name, leader, budget, spent, participants, description, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(
      data.name,
      data.leader || null,
      data.budget || 0,
      data.spent || 0,
      data.participants || 0,
      data.description || null,
      data.notes || null
    ).run()

    return jsonResponse({ id: result.meta.last_row_id, success: true })
  }

  if (path.startsWith('ministries/') && path.includes('/attendance')) {
    if (request.method === 'POST') {
      const data = await request.json()
      const ministryId = path.split('/')[1]
      
      const result = await DB.prepare(`
        INSERT INTO attendance (ministryId, date, count, notes, recordedBy)
        VALUES (?, ?, ?, ?, ?)
      `).bind(
        ministryId,
        data.date,
        data.count,
        data.notes || null,
        data.recordedBy
      ).run()

      return jsonResponse({ id: result.meta.last_row_id, success: true })
    }

    if (request.method === 'GET') {
      const ministryId = path.split('/')[1]
      const { results } = await DB.prepare(`
        SELECT * FROM attendance WHERE ministryId = ? ORDER BY date DESC
      `).bind(ministryId).all()

      return jsonResponse(results)
    }
  }

  return jsonResponse({ error: 'Method not allowed' }, 405)
}

// Finance handlers
async function handleFinances(request, env, path) {
  const { DB } = env

  if (path === 'finances/income') {
    if (request.method === 'GET') {
      const { results } = await DB.prepare(`
        SELECT * FROM income ORDER BY date DESC
      `).all()
      return jsonResponse(results)
    }

    if (request.method === 'POST') {
      const data = await request.json()
      const result = await DB.prepare(`
        INSERT INTO income (date, category, amount, source, description, notes, recordedBy)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).bind(
        data.date,
        data.category,
        data.amount,
        data.source || null,
        data.description || null,
        data.notes || null,
        data.recordedBy
      ).run()

      return jsonResponse({ id: result.meta.last_row_id, success: true })
    }
  }

  if (path === 'finances/expenses') {
    if (request.method === 'GET') {
      const { results } = await DB.prepare(`
        SELECT * FROM expenses ORDER BY date DESC
      `).all()
      return jsonResponse(results)
    }

    if (request.method === 'POST') {
      const data = await request.json()
      const result = await DB.prepare(`
        INSERT INTO expenses (date, category, amount, description, notes, recordedBy, approved, approvedBy)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        data.date,
        data.category,
        data.amount,
        data.description || null,
        data.notes || null,
        data.recordedBy,
        data.approved ? 1 : 0,
        data.approvedBy || null
      ).run()

      return jsonResponse({ id: result.meta.last_row_id, success: true })
    }
  }

  return jsonResponse({ error: 'Invalid finance endpoint' }, 404)
}

// Pledge handlers
async function handlePledges(request, env, path) {
  const { DB } = env

  if (request.method === 'GET') {
    const url = new URL(request.url)
    const userId = url.searchParams.get('userId')

    const { results } = await DB.prepare(`
      SELECT p.*, u.name as userName
      FROM pledges p
      JOIN users u ON p.userId = u.id
      ${userId ? 'WHERE p.userId = ?' : ''}
      ORDER BY p.createdAt DESC
    `).bind(userId ? userId : undefined).all()

    return jsonResponse(results)
  }

  if (request.method === 'POST') {
    const data = await request.json()
    
    const result = await DB.prepare(`
      INSERT INTO pledges (userId, amount, frequency, startDate, endDate, status, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(
      data.userId,
      data.amount,
      data.frequency,
      data.startDate,
      data.endDate || null,
      data.status || 'active',
      data.notes || null
    ).run()

    return jsonResponse({ id: result.meta.last_row_id, success: true })
  }

  return jsonResponse({ error: 'Method not allowed' }, 405)
}

// Bible Reading handlers
async function handleBibleReading(request, env, path) {
  const { DB } = env

  if (request.method === 'GET') {
    const url = new URL(request.url)
    const userId = url.searchParams.get('userId')

    const { results } = await DB.prepare(`
      SELECT * FROM bible_reading 
      WHERE userId = ? 
      ORDER BY date DESC
    `).bind(userId).all()

    return jsonResponse(results)
  }

  if (request.method === 'POST') {
    const data = await request.json()
    
    const result = await DB.prepare(`
      INSERT INTO bible_reading (userId, date, book, chapter, notes, completed)
      VALUES (?, ?, ?, ?, ?, ?)
    `).bind(
      data.userId,
      data.date,
      data.book,
      data.chapter,
      data.notes || null,
      data.completed ? 1 : 0
    ).run()

    return jsonResponse({ id: result.meta.last_row_id, success: true })
  }

  return jsonResponse({ error: 'Method not allowed' }, 405)
}
