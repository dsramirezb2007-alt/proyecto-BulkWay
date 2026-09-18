import { Routes, Route } from 'react-router-dom'
import Inicio from './components/home/Inicio'
import RoleLogin from './components/auth/RoleLogin'
import Login from './components/auth/Login'
import Registro from './components/auth/Registro'
import RecuperarPassword from './components/auth/RecuperarPassword'
import ProtectedRoute from './components/auth/ProtectedRoute'
import AdminDashboard from './components/admin/AdminDashboard'
import ConductorDashboard from './components/conductor/ConductorDashboard'
import ClienteDashboard from './components/cliente/ClienteDashboard'

function Denied() {
  return (
    <div className="auth-page">
      <div className="auth-card text-center">
        <div className="login-icon"><i className="bi bi-shield-x" /></div>
        <p className="auth-eyebrow">BULKWAY · OPERACIÓN SEGURA</p>
        <h1>Acceso no permitido</h1>
        <p className="auth-copy">Tu cuenta no tiene permisos para entrar a este panel.</p>
        <a className="btn btn-purple btn-full" href="/login">Volver al acceso</a>
      </div>
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Inicio />} />
      <Route path="/login" element={<RoleLogin />} />
      <Route path="/login/cliente" element={<Login expectedRole="cliente" title="Acceso cliente" description="Consulta tus pedidos, facturas y seguimiento." icon="bi-person" />} />
      <Route path="/login/admin" element={<Login expectedRole="administrador" title="Acceso administrador" description="Administra catálogo, pedidos, inventario, rutas y facturación." icon="bi-shield-check" />} />
      <Route path="/login/conductor" element={<Login expectedRole="conductor" title="Acceso conductor" description="Consulta pedidos, despachos y rutas asignadas." icon="bi-truck" />} />
      <Route path="/registro" element={<Registro />} />
      <Route path="/recuperar" element={<RecuperarPassword />} />
      <Route path="/acceso-denegado" element={<Denied />} />

      <Route path="/admin" element={<ProtectedRoute roles={['administrador']}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/conductor" element={<ProtectedRoute roles={['conductor']}><ConductorDashboard /></ProtectedRoute>} />
      <Route path="/cliente" element={<ProtectedRoute roles={['cliente']}><ClienteDashboard /></ProtectedRoute>} />
    </Routes>
  )
}

export default App
