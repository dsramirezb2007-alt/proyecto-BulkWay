import { useState } from 'react'
import DashboardShell from '../shared/DashboardShell'
import StatCard from '../shared/StatCard'

const pedidos = [
  { id: 'BK-201', cliente: 'Supermercado El Ahorro', direccion: 'Calle 72 #20-15, Bogotá', estado: 'Pendiente', productos: 'Jabón para ropa x80 · Lavaloza x40' },
  { id: 'BK-202', cliente: 'Distribuciones La Economía', direccion: 'Carrera 24 #68-40, Bogotá', estado: 'Pendiente', productos: 'Jabón para ropa x60 · Lavaloza x30' },
]

const menu = [
  { id: 'inicio', label: 'Resumen', icon: 'bi-grid-1x2' },
  { id: 'pedidos', label: 'Mis pedidos', icon: 'bi-box-seam' },
  { id: 'rutas', label: 'Mis rutas', icon: 'bi-map' },
  { id: 'ayudante', label: 'Ayudante', icon: 'bi-person-plus' },
]

function ConductorDashboard() {
  const [active, setActive] = useState('inicio')
  return (
    <DashboardShell role="conductor" menu={menu} active={active} setActive={setActive} title="Panel del conductor">
      {active === 'inicio' && <>
        <div className="stats-grid">
          <StatCard icon="bi-box-seam" label="Pedidos asignados" value="2" />
          <StatCard icon="bi-geo-alt" label="Zona" value="Norte" />
          <StatCard icon="bi-check2-circle" label="Estado" value="Activo" />
        </div>
        <section className="dashboard-panel welcome-panel"><p className="eyebrow">RUTA DEL DÍA</p><h2>Tu operación está lista.</h2><p>Consulta tus pedidos, abre la ruta y revisa la información del ayudante desde el menú lateral.</p></section>
      </>}

      {active === 'pedidos' && <section className="dashboard-panel"><div className="panel-head"><div><p className="eyebrow">ENTREGAS</p><h2>Mis pedidos asignados</h2></div></div><div className="order-list">{pedidos.map(p => <article className="order-card" key={p.id}><div className="order-title"><div><span className="order-id">#{p.id}</span><h3>{p.cliente}</h3></div><span className="status">{p.estado}</span></div><div className="order-details"><span><i className="bi bi-geo-alt" /> {p.direccion}</span><span><i className="bi bi-box" /> {p.productos}</span></div></article>)}</div></section>}

      {active === 'rutas' && <section className="dashboard-panel"><p className="eyebrow">LOGÍSTICA</p><h2>Ruta optimizada del día</h2><div className="route-card"><div className="route-map-icon"><i className="bi bi-truck" /></div><div><h3>Bogotá Norte</h3><p>Origen: centro de distribución</p><p>2 paradas · BK-201 · BK-202</p></div><button className="btn btn-purple" onClick={() => window.open('https://www.google.com/maps/dir/?api=1&origin=Bogota&destination=Chapinero+Bogota','_blank')}>Abrir ruta</button></div></section>}

      {active === 'ayudante' && <section className="dashboard-panel"><p className="eyebrow">EQUIPO</p><h2>Ayudante de entrega</h2><article className="employee-card single"><div className="employee-avatar"><i className="bi bi-person" /></div><h3>Andrés Gómez</h3><p>Ayudante de entregas</p><p>Teléfono: 3104567890</p><p>Correo: andres@bulkway.com</p><p>Conductor asignado: Carlos Sierra</p></article></section>}
    </DashboardShell>
  )
}
export default ConductorDashboard
