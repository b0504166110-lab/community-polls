import { describe, expect, it } from 'vitest'
import { Route, Routes } from 'react-router-dom'
import { screen } from '@testing-library/react'
import ProtectedRoute from './ProtectedRoute'
import type { User } from '../api/authService'
import { adminUser, regularUser, renderWithProviders } from '../test/render'

function setup(user: User | null, adminOnly: boolean) {
  return renderWithProviders(
    <Routes>
      <Route path="/polls" element={<p>רשימת הסקרים</p>} />
      <Route path="/login" element={<p>דף התחברות</p>} />
      <Route
        path="/secret"
        element={
          <ProtectedRoute adminOnly={adminOnly}>
            <p>תוכן מוגן</p>
          </ProtectedRoute>
        }
      />
    </Routes>,
    { user, route: '/secret' },
  )
}

describe('ProtectedRoute', () => {
  it('אורח מופנה להתחברות', () => {
    setup(null, false)
    expect(screen.getByText('דף התחברות')).toBeInTheDocument()
  })

  it('משתמשת מחוברת רואה את התוכן', () => {
    setup(regularUser, false)
    expect(screen.getByText('תוכן מוגן')).toBeInTheDocument()
  })

  it('משתמשת רגילה בנתיב למנהלת מופנית לרשימת הסקרים', () => {
    setup(regularUser, true)
    expect(screen.getByText('רשימת הסקרים')).toBeInTheDocument()
    expect(screen.queryByText('תוכן מוגן')).not.toBeInTheDocument()
  })

  it('אורח בנתיב למנהלת מופנה להתחברות', () => {
    setup(null, true)
    expect(screen.getByText('דף התחברות')).toBeInTheDocument()
  })

  it('מנהלת רואה את התוכן בנתיב למנהלת', () => {
    setup(adminUser, true)
    expect(screen.getByText('תוכן מוגן')).toBeInTheDocument()
  })
})
