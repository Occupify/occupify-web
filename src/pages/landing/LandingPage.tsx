import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { BrandPanel, AuthPanel } from './components'

export interface LandingPageProps {
  onLogin?: () => void
  onSignUp?: () => void
  onGoogle?: () => void
  onAdmin?: () => void
}

/**
 * LandingPage
 *
 * Exact match of Occupify-website-design Landing Page.
 * Orchestrates the Left Brand Panel and the Right Auth Panel.
 */
export function LandingPage({ onLogin, onSignUp, onGoogle, onAdmin }: LandingPageProps) {
  const navigate = useNavigate()

  const handleLogin = React.useCallback(() => {
    if (onLogin) {
      onLogin()
    } else {
      navigate('/login')
    }
  }, [onLogin, navigate])

  const handleSignUp = React.useCallback(() => {
    if (onSignUp) {
      onSignUp()
    } else {
      navigate('/signup')
    }
  }, [onSignUp, navigate])

  const handleGoogle = React.useCallback(() => {
    if (onGoogle) {
      onGoogle()
    } else {
      navigate('/home')
    }
  }, [onGoogle, navigate])

  const handleAdmin = React.useCallback(() => {
    if (onAdmin) {
      onAdmin()
    } else {
      navigate('/admin')
    }
  }, [onAdmin, navigate])

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#F8FAFC',
        display: 'flex',
        alignItems: 'stretch',
        fontFamily:
          "'Plus Jakarta Sans', 'Inter', 'Source Sans 3', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      {/* Left — brand panel */}
      <BrandPanel />

      {/* Right — auth panel */}
      <AuthPanel
        onLogin={handleLogin}
        onSignUp={handleSignUp}
        onGoogle={handleGoogle}
        onAdmin={handleAdmin}
      />
    </div>
  )
}

export default LandingPage
