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
    const allUsers = [...demoUsers]
    parsed.forEach(user => {
      if (!allUsers.some(u => u.email === user.email)) {
        allUsers.push(user)
      }
    })
    localStorage.setItem(USERS_KEY, JSON.stringify(allUsers))
  } else {
    localStorage.setItem(USERS_KEY, JSON.stringify(demoUsers))
  }
}

export const login = (email, password) => {
  const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
  const user = users.find(u => u.email === email && u.password === password)
  
  if (user) {
    const { password, ...userWithoutPassword } = user
    localStorage.setItem(AUTH_KEY, JSON.stringify(userWithoutPassword))
    return { success: true, user: userWithoutPassword }
  }
  
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

// Initialize demo users on import
initializeDemoUsers()