import { describe, expect, it } from 'vitest'
import reducer, { logout, setUser } from './authSlice'
import type { User } from '../api/authService'

const user: User = {
  id: 1,
  name: 'משתמשת',
  email: 'user@example.com',
  role: 'USER',
  createdAt: '2026-01-01T00:00:00.000Z',
}

describe('authSlice', () => {
  it('setUser שומר את המשתמשת ומסיים את מצב הבדיקה', () => {
    const state = reducer({ user: null, isChecking: true }, setUser(user))
    expect(state).toEqual({ user, isChecking: false })
  })

  it('logout מנקה את המשתמשת', () => {
    const state = reducer({ user, isChecking: false }, logout())
    expect(state).toEqual({ user: null, isChecking: false })
  })
})
