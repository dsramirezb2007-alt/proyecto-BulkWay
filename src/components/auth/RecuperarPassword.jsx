import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../services/supabase'

function RecuperarPassword() {
  const [email, setEmail] = useState('')
  const [mensaje, setMensaje] = useState('')

  const enviar = async (e) => {
    e.preventDefault()
    setMensaje('')

    if (!supabase) {
      setMensaje('Configura Supabase en .env.')
      return
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/actualizar-password`,
    })

    setMensaje(error ? error.message : 'Revisa tu correo para continuar con la recuperación.')
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link to="/login/cliente" className="auth-back">← Volver al login</Link>
        <p className="auth-eyebrow">BULKWAY · OPERACIÓN SEGURA</p>
        <h1>Recuperar contraseña</h1>
        <p className="auth-copy">Te enviaremos un enlace de recuperación al correo registrado.</p>

        <form className="auth-form" onSubmit={enviar}>
          <label>Correo electrónico</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <button className="btn btn-purple btn-full">Enviar enlace</button>
        </form>

        {mensaje && <div className="auth-message">{mensaje}</div>}
      </div>
    </div>
  )
}

export default RecuperarPassword
