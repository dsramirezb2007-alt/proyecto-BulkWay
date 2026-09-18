import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import DashboardShell from '../shared/DashboardShell'
import StatCard from '../shared/StatCard'
import PedidosAdmin from './PedidosAdmin'
import ProductosAdmin from './ProductosAdmin'
import FacturacionAdmin from './FacturacionAdmin'
import EmpleadosAdmin from './EmpleadosAdmin'
import RutasAdmin from './RutasAdmin'

const menu = [
  { id: 'inicio', label: 'Resumen', icon: 'bi-grid-1x2' },
  { id: 'pedidos', label: 'Pedidos', icon: 'bi-box-seam' },
  { id: 'productos', label: 'Productos', icon: 'bi-basket3' },
  { id: 'nuevo-pedido', label: 'Nuevo pedido', icon: 'bi-plus-square' },
  { id: 'rutas', label: 'Rutas', icon: 'bi-map' },
  { id: 'empleados', label: 'Empleados', icon: 'bi-people' },
  { id: 'facturacion', label: 'Facturación', icon: 'bi-receipt' },
]

function AdminDashboard() {
  const [active, setActive] = useState('inicio')
  const { usuario } = useAuth()

  const esAdministradorPrincipal =
    usuario?.email?.toLowerCase() === 'admin@bulkway.com'

  const content = {
   inicio: esAdministradorPrincipal ? (
      <>
        <div className="stats-grid">
          <StatCard icon="bi-box-seam" label="Pedidos" value="2" hint="Pedidos en operación" />
          <StatCard icon="bi-basket3" label="Productos" value="2" hint="Referencias activas" />
          <StatCard icon="bi-truck" label="Conductores" value="1" hint="Ruta de distribución" />
          <StatCard icon="bi-receipt" label="Facturas" value="2" hint="Registros operativos" />
        </div>

        <section className="dashboard-panel welcome-panel">
          <p className="eyebrow">CENTRO DE OPERACIONES</p>
          <h2>Bienvenido al centro de operaciones de BulkWay.</h2>
          <p>
            Desde este espacio puedes gestionar la operación comercial y logística.
            Cada módulo está separado en su propio componente para que el proyecto
            sea fácil de mantener y ampliar.
          </p>

          <div className="quick-grid">
            <button onClick={() => setActive('pedidos')}>
              <i className="bi bi-box-seam" /> Gestionar pedidos
            </button>

            <button onClick={() => setActive('productos')}>
              <i className="bi bi-basket3" /> Gestionar catálogo
            </button>

            <button onClick={() => setActive('rutas')}>
              <i className="bi bi-map" /> Ver rutas
            </button>

            <button onClick={() => setActive('facturacion')}>
              <i className="bi bi-receipt" /> Revisar facturación
            </button>
          </div>
        </section>
      </>
    ) : (
      <>
        <div className="stats-grid">
          <StatCard icon="bi-box-seam" label="Pedidos" value="0" hint="Sin pedidos asignados" />
          <StatCard icon="bi-basket3" label="Productos" value="0" hint="Sin productos registrados" />
          <StatCard icon="bi-truck" label="Conductores" value="0" hint="Sin conductores registrados" />
          <StatCard icon="bi-receipt" label="Facturas" value="0" hint="Sin facturas registradas" />
        </div>

        <section className="dashboard-panel welcome-panel">
          <p className="eyebrow">CENTRO DE OPERACIONES</p>
          <h2>Tu centro de operaciones está listo.</h2>
          <p>
            Esta cuenta todavía no tiene información registrada.
            Puedes comenzar creando pedidos, productos, rutas y empleados.
          </p>
        </section>
      </>
    ),

    pedidos: <PedidosAdmin />,
    productos: <ProductosAdmin />,
    'nuevo-pedido': <PedidosAdmin soloNuevo />,
    rutas: <RutasAdmin />,
    empleados: <EmpleadosAdmin />,
    facturacion: <FacturacionAdmin />,
  }

  return (
    <DashboardShell role="administrador" menu={menu} active={active} setActive={setActive} title="Centro de operaciones">
      {content[active]}
    </DashboardShell>
  )
}

export default AdminDashboard
