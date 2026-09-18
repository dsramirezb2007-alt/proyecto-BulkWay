import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../../services/supabase'

function Login({ expectedRole, title, description, icon = 'bi-person' }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [cargando, setCargando] = useState(false)
  const navigate = useNavigate()

  const iniciarSesion = async (e) => {

  e.preventDefault(); setMensaje(''); setCargando(true)

  if (!supabase) { setMensaje
    ('Configura las variables de Supabase en el archivo .env.'); setCargando(false); return }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) { setMensaje('Correo o contraseña incorrectos.'); setCargando(false); return }

    const { data: perfil, error: perfilError } = await supabase

      .from('perfiles')
      .select('role')
      .eq('id', data.user.id)
      .single()

    if (perfilError || !perfil) {
      await supabase.auth.signOut()
      setMensaje('No se encontró el perfil de esta cuenta.')
      setCargando(false)
      return
    }

    const rol = perfil.role.toLowerCase()

    console.log('ROL NORMALIZADO:', rol)
    console.log('ROL ESPERADO:', expectedRole)

    console.log('ID DEL USUARIO:', data.user.id)
    console.log('PERFIL ENCONTRADO:', perfil)
    console.log('ERROR DEL PERFIL:', perfilError)
    console.log('ROL ENCONTRADO:', perfil?.role)

    if (expectedRole && rol !== expectedRole) {
      await supabase.auth.signOut()
      setMensaje(`Esta cuenta no tiene el rol de ${expectedRole}.`)
      setCargando(false)
      return
    }

    navigate(
      rol === 'administrador'
        ? '/admin'
        : rol === 'conductor'
          ? '/conductor'
          : '/cliente'
    )
  }

  return (
    <div className="auth-page">
      <div className="auth-layout">
        <aside className="auth-brand-panel">
          <div>
            <div className="brand-orb">BW</div>
            <p className="eyebrow-light" style={{marginTop:28}}>BULKWAY · OPERACIONES</p>
            <h2>Acceso rápido a tu operación.</h2>
            <p>Gestiona productos, pedidos y distribución desde una experiencia clara, moderna y pensada para el día a día.</p>
          </div>
          <div className="auth-features">
            <div className="auth-feature"><i className="bi bi-check2-circle"/> Acceso protegido</div>
            <div className="auth-feature"><i className="bi bi-box-seam"/> Información centralizada</div>
          </div>
        </aside>
        <main className="auth-panel">
          <Link to="/login" className="auth-back">← Cambiar tipo de acceso</Link>
          <div className="login-icon"><i className={`bi ${icon}`} /></div>
          <p className="auth-eyebrow">ACCESO AL SISTEMA</p>
          <h1>{title}</h1>
          <p className="auth-copy">{description}</p>
          <form className="auth-form" onSubmit={iniciarSesion}>
            <label>Correo electrónico</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="correo@ejemplo.com" required />
            <label>Contraseña</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" minLength={6} required />
            <button className="btn btn-purple btn-full" disabled={cargando}>{cargando ? 'Ingresando...' : 'Entrar al portal'}</button>
          </form>
          {mensaje && <div className="auth-message error">{mensaje}</div>}
          {expectedRole === 'cliente' && <><Link className="forgot-link" to="/recuperar">¿Olvidaste tu contraseña?</Link><p className="auth-link">¿No tienes cuenta? <Link to="/registro">Crear cuenta</Link></p></>}
        </main>
      </div>
    </div>
  )
}
export default Login
