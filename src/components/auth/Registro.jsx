import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { supabase } from '../../services/supabase'

function Registro() {
  const [searchParams] = useSearchParams()

  const rolUrl = searchParams.get('rol')

  const rolesValidos = ['cliente', 'conductor', 'administrador']

  const rol = rolesValidos.includes(rolUrl) ? rolUrl : 'cliente'

  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [cargando, setCargando] = useState(false)

  const nombresRol = {
    cliente: 'cliente',
    conductor: 'conductor',
    administrador: 'administrador',
  }

  const registrarUsuario = async (e) => {
    e.preventDefault()

    setMensaje('')

    if (!supabase) {
      setMensaje('Configura Supabase en .env antes de registrar usuarios.')
      return
    }

    setCargando(true)

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nombre,
          rol,
        },
      },
    })

    setCargando(false)

    if (error) {
      setMensaje(error.message)
      return
    }

    setMensaje(
      `Cuenta de ${nombresRol[rol]} creada. Revisa tu correo si la confirmación de email está activada.`
    )
  }

  return (
    <div className="auth-page">
      <div className="auth-card">

        <Link
          to="/login"
          className="auth-back"
        >
          ← Volver al acceso
        </Link>

        <p className="auth-eyebrow">
          BULKWAY · CUENTA DE {rol.toUpperCase()}
        </p>

        <h1>
          Crear cuenta como {nombresRol[rol]}
        </h1>

        <p className="auth-copy">
          Completa tus datos para crear tu cuenta de {nombresRol[rol]}.
        </p>

        <form
          className="auth-form"
          onSubmit={registrarUsuario}
        >
          <label>Nombre completo</label>

          <input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />

          <label>Correo electrónico</label>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Contraseña</label>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            required
          />

          <button
            className="btn btn-purple btn-full"
            disabled={cargando}
          >
            {cargando ? 'Creando...' : 'Crear cuenta'}
          </button>
        </form>

        {mensaje && (
          <div className="auth-message">
            {mensaje}
          </div>
        )}

      </div>
    </div>
  )
}

export default Registro