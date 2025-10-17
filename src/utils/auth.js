// Authentication utilities using localStorage

export const AUTH_KEY = 'gcbf_auth_user'
export const USERS_KEY = 'gcbf_users'

// Initialize demo users if not exists
export const initializeDemoUsers = () => {
  const demoUsers = [
    {
      id: '3',
      email: 'pastor@gcbf.org',
      password: 'admin123',
      name: 'Pastor John Louie Berdejo',
      userType: 'pastor',
      joinDate: '2020-06-01'
    },
    {
      id: '4',
      email: 'admin@gcbf.org',
      password: 'admin2024',
      name: 'Church Administrator',
      userType: 'admin',
      joinDate: '2023-01-01'
    }
  ]
  
  const existingUsers = localStorage.getItem(USERS_KEY)
  if (existingUsers) {
    const parsed = JSON.parse(existingUsers)
    // Always ensure demo users exist, update them if they're already there
    demoUsers.forEach(demoUser => {
      const index = parsed.findIndex(u => u.email === demoUser.email)
      if (index >= 0) {
        // Update existing demo user
        parsed[index] = demoUser
      } else {
        // Add new demo user
        parsed.push(demoUser)
      }
    })
    localStorage.setItem(USERS_KEY, JSON.stringify(parsed))
    console.log('Demo users initialized/updated:', parsed)
  } else {
    localStorage.setItem(USERS_KEY, JSON.stringify(demoUsers))
    console.log('Demo users created:', demoUsers)
  }
}

export const login = (email, password) => {
  const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
  console.log('Login attempt for:', email)
  console.log('Available users:', users.map(u => ({ email: u.email, type: u.userType })))
  
  const user = users.find(u => u.email === email && u.password === password)
  
  if (user) {
    const { password, ...userWithoutPassword } = user
    localStorage.setItem(AUTH_KEY, JSON.stringify(userWithoutPassword))
    console.log('Login successful for:', userWithoutPassword.email, 'Type:', userWithoutPassword.userType)
    return { success: true, user: userWithoutPassword }
  }
  
  console.log('Login failed - user not found or password incorrect')
  return { success: false, message: 'Invalid email or password' }
}

export const register = (userData) => {
  const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
  
  // Check if email already exists
  if (users.some(u => u.email === userData.email)) {
    return { success: false, message: 'Email already registered' }
  }
  
  const newUser = {
    id: Date.now().toString(),
    ...userData,
    joinDate: new Date().toISOString().split('T')[0]
  }
  
  users.push(newUser)
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
  
  const { password, ...userWithoutPassword } = newUser
  localStorage.setItem(AUTH_KEY, JSON.stringify(userWithoutPassword))
  
  return { success: true, user: userWithoutPassword }
}

export const logout = () => {
  localStorage.removeItem(AUTH_KEY)
}

export const isAuthenticated = () => {
  return localStorage.getItem(AUTH_KEY) !== null
}

export const getCurrentUser = () => {
  const user = localStorage.getItem(AUTH_KEY)
  return user ? JSON.parse(user) : null
}

// Admin-specific authentication
export const isAdmin = () => {
  const user = getCurrentUser()
  return user && user.userType === 'admin'
}

// Check if user is admin or pastor (for Church Portal access)
export const isAdminOrPastor = () => {
  const user = getCurrentUser()
  return user && (user.userType === 'admin' || user.userType === 'pastor')
}

export const adminLogin = (email, password) => {
  const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
  const user = users.find(u => u.email === email && u.password === password && u.userType === 'admin')
  
  if (user) {
    const { password, ...userWithoutPassword } = user
    localStorage.setItem(AUTH_KEY, JSON.stringify(userWithoutPassword))
    return { success: true, user: userWithoutPassword }
  }
  
  return { success: false, message: 'Invalid admin credentials' }
}

export const requireAdmin = () => {
  if (!isAdmin()) {
    throw new Error('Admin access required')
  }
}

// Utility function to reset localStorage (for debugging)
export const resetAuth = () => {
  localStorage.removeItem(AUTH_KEY)
  localStorage.removeItem(USERS_KEY)
  initializeDemoUsers()
  console.log('Auth reset complete - demo users reinitialized')
}

// Initialize demo users on import
initializeDemoUsers()