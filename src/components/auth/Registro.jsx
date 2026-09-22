import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'

import { supabase } from '../../services/supabase'

function Registro() {
  const [searchParams] = useSearchParams()

  const rolUrl = searchParams.get('rol')
  const rolesValidos = ['cliente', 'conductor']

  const rolInicial = rolesValidos.includes(rolUrl)
    ? rolUrl
    : 'cliente'

  const [rol, setRol] = useState(rolInicial)
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [cargando, setCargando] = useState(false)

  const nombresRol = {
    cliente: 'cliente',
    conductor: 'conductor',
  }

  const cambiarRol = (nuevoRol) => {
    setRol(nuevoRol)
    setMensaje('')

    const params = new URLSearchParams()
    params.set('rol', nuevoRol)

    window.history.replaceState(
      {},
      '',
      `/registro?${params.toString()}`
    )
  }

  const registrarUsuario = async (e) => {
    e.preventDefault()

    setMensaje('')

    if (!supabase) {
      setMensaje(
        'Configura Supabase en .env antes de registrar usuarios.'
      )
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
    <div className="auth-page register-page">
      <div className="auth-background-glow auth-glow-one"></div>
      <div className="auth-background-glow auth-glow-two"></div>

      <div className="auth-shell register-shell">

        {/* PANEL VISUAL */}
        <section className="auth-visual register-visual">

          <Link
            to="/"
            className="auth-brand"
          >
            <span className="auth-brand-main">
              BULK<b>WAY</b>
            </span>

            <span className="auth-brand-sub">
              GESTIÓN EMPRESARIAL
            </span>
          </Link>

          <div className="auth-visual-content">

            <p className="auth-eyebrow">
              INCORPORACIÓN AL SISTEMA
            </p>

            <h1>
              Forma parte de una
              <br />
              operación <em>conectada.</em>
            </h1>

            <p className="auth-visual-copy">
              Crea tu acceso a BulkWay y trabaja con la información
              que necesitas según el papel que desempeñas dentro
              de la operación empresarial.
            </p>

            <div className="register-role-preview">

              <div className="register-preview-icon">
                <i
                  className={
                    rol === 'cliente'
                      ? 'bi bi-person-badge'
                      : 'bi bi-truck'
                  }
                ></i>
              </div>

              <div>
                <span>ACCESO SELECCIONADO</span>

                <strong>
                  {rol === 'cliente'
                    ? 'Cliente'
                    : 'Conductor'}
                </strong>

                <p>
                  {rol === 'cliente'
                    ? 'Consulta tus pedidos y productos disponibles.'
                    : 'Gestiona rutas y entregas asignadas.'}
                </p>
              </div>

            </div>

            <div className="register-feature-list">

              <div>
                <i className="bi bi-shield-check"></i>
                <span>Acceso protegido</span>
              </div>

              <div>
                <i className="bi bi-diagram-3"></i>
                <span>Información conectada</span>
              </div>

              <div>
                <i className="bi bi-lightning-charge"></i>
                <span>Operación centralizada</span>
              </div>

            </div>

          </div>

          <div className="auth-visual-footer">

            <span>
              <i className="bi bi-lock"></i>
              Registro seguro
            </span>

            <span>
              <i className="bi bi-check2-circle"></i>
              Configuración empresarial
            </span>

          </div>

        </section>

        {/* PANEL DE REGISTRO */}
        <main className="auth-login-panel register-panel">

          <div className="auth-login-inner">

            <Link
              to="/login"
              className="auth-back"
            >
              <i className="bi bi-arrow-left"></i>
              Volver al acceso
            </Link>

            <div className="login-heading">

              <div className="login-icon">
                <i className="bi bi-person-plus"></i>
              </div>

              <p className="auth-eyebrow">
                CREAR CUENTA
              </p>

              <h2>
                Comienza en BulkWay.
              </h2>

              <p className="auth-copy">
                Selecciona el tipo de acceso que corresponde a tu
                función y completa tus datos para crear la cuenta.
              </p>

            </div>

            {/* SELECTOR DE ROL */}
            <div className="register-role-section">

              <label className="register-section-label">
                Tipo de cuenta
              </label>

              <div className="register-role-grid">

                <button
                  type="button"
                  className={`register-role-card ${
                    rol === 'cliente'
                      ? 'active'
                      : ''
                  }`}
                  onClick={() => cambiarRol('cliente')}
                >
                  <span className="register-role-icon">
                    <i className="bi bi-person-badge"></i>
                  </span>

                  <span className="register-role-content">
                    <strong>Cliente</strong>

                    <small>
                      Consulta pedidos y productos.
                    </small>
                  </span>

                  <span className="register-role-check">
                    <i className="bi bi-check2"></i>
                  </span>
                </button>

                <button
                  type="button"
                  className={`register-role-card ${
                    rol === 'conductor'
                      ? 'active'
                      : ''
                  }`}
                  onClick={() => cambiarRol('conductor')}
                >
                  <span className="register-role-icon">
                    <i className="bi bi-truck"></i>
                  </span>

                  <span className="register-role-content">
                    <strong>Conductor</strong>

                    <small>
                      Gestiona rutas y entregas.
                    </small>
                  </span>

                  <span className="register-role-check">
                    <i className="bi bi-check2"></i>
                  </span>
                </button>

              </div>

            </div>

            {/* FORMULARIO */}
            <form
              className="auth-form register-form"
              onSubmit={registrarUsuario}
            >

              <div className="auth-field">

                <label htmlFor="nombre">
                  Nombre completo
                </label>

                <div className="auth-input-wrap">

                  <i className="bi bi-person"></i>

                  <input
                    id="nombre"
                    type="text"
                    value={nombre}
                    onChange={(e) =>
                      setNombre(e.target.value)
                    }
                    placeholder="Tu nombre completo"
                    autoComplete="name"
                    required
                  />

                </div>

              </div>

              <div className="auth-field">

                <label htmlFor="registro-email">
                  Correo electrónico
                </label>

                <div className="auth-input-wrap">

                  <i className="bi bi-envelope"></i>

                  <input
                    id="registro-email"
                    type="email"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    placeholder="correo@ejemplo.com"
                    autoComplete="email"
                    required
                  />

                </div>

              </div>

              <div className="auth-field">

                <label htmlFor="registro-password">
                  Contraseña
                </label>

                <div className="auth-input-wrap">

                  <i className="bi bi-lock"></i>

                  <input
                    id="registro-password"
                    type="password"
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    placeholder="Mínimo 6 caracteres"
                    autoComplete="new-password"
                    minLength={6}
                    required
                  />

                </div>

              </div>

              <div className="register-selected-role">

                <i className="bi bi-info-circle"></i>

                <span>
                  Crearás una cuenta como{' '}
                  <strong>
                    {nombresRol[rol]}
                  </strong>.
                </span>

              </div>

              <button
                className="btn btn-purple btn-full auth-submit"
                disabled={cargando}
                type="submit"
              >
                {cargando ? (
                  <>
                    <span className="auth-spinner"></span>
                    Creando cuenta...
                  </>
                ) : (
                  <>
                    Crear cuenta
                    <i className="bi bi-arrow-right"></i>
                  </>
                )}
              </button>

            </form>

            {mensaje && (
              <div className="auth-message register-message">
                <i className="bi bi-info-circle"></i>
                <span>{mensaje}</span>
              </div>
            )}

            <div className="auth-divider">
              <span>ACCESO EMPRESARIAL</span>
            </div>

            <div className="auth-info-card">

              <div className="auth-info-icon">
                <i className="bi bi-shield-lock"></i>
              </div>

              <div>
                <strong>
                  Registro protegido
                </strong>

                <p>
                  Tu cuenta se registra mediante Supabase y
                  queda asociada al tipo de acceso seleccionado.
                </p>
              </div>

            </div>

            <p className="auth-link">
              ¿Ya tienes una cuenta?
              {' '}
              <Link to="/login">
                Iniciar sesión
              </Link>
            </p>

            <p className="auth-copyright">
              © 2026 BulkWay · Gestión empresarial
            </p>

          </div>

        </main>

      </div>
    </div>
  )
}

export default Registro