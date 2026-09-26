import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import defaultLogo from '../assets/logo.webp'
import { supabase } from '../lib/supabase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) { setError('Completa todos los campos'); return }
    setLoading(true)
    setError('')
    const { error: err } = await supabase.auth.signInWithPassword({ email, password })
    if (err) {
      setError('Correo o contraseña incorrectos')
      setLoading(false)
    }
    // On success, AuthContext onAuthStateChange updates session → App redirects automatically
  }

  return (
    <div className="login-page">
      <div className="login-wrap">
        <img src={defaultLogo} alt="Sistema de Cotizaciones" className="login-logo" />
        <h1 className="login-title">Bienvenido</h1>
        <p className="login-sub">Sistema de Cotizaciones</p>

        <div className="login-card">
          <form onSubmit={handleSubmit} className="space-y-[18px]">
            <div>
              <label className="login-label" htmlFor="login-email">Correo electrónico</label>
              <input
                id="login-email"
                className="login-input"
                type="email"
                placeholder="correo@empresa.com"
                value={email}
                onChange={e => { setEmail(e.target.value); setError('') }}
                autoFocus
                autoComplete="email"
              />
            </div>

            <div>
              <label className="login-label" htmlFor="login-password">Contraseña</label>
              <div className="relative">
                <input
                  id="login-password"
                  className="login-input pr-11"
                  type={showPass ? 'text' : 'password'}
                  placeholder="Tu contraseña"
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError('') }}
                  autoComplete="current-password"
                />
                <button type="button" onClick={() => setShowPass(v => !v)}
                  className="login-eye" aria-label={showPass ? 'Ocultar contraseña' : 'Mostrar contraseña'}>
                  {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {error && <p className="text-[13px] text-red-500 mt-2">{error}</p>}
            </div>

            <button type="submit" disabled={loading} className="login-btn">
              {loading ? 'Ingresando...' : 'Ingresar'}
            </button>

            <div className="text-center pt-1">
              <Link to="/forgot-password" className="login-link">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
