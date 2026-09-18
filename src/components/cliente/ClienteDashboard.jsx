import { useState } from 'react'
import DashboardShell from '../shared/DashboardShell'
import StatCard from '../shared/StatCard'
import ProductoCard from '../home/ProductoCard'
import { productosIniciales } from '../../data/productos'

const menu = [
  { id: 'inicio', label: 'Resumen', icon: 'bi-grid-1x2' },
  { id: 'catalogo', label: 'Catálogo', icon: 'bi-basket3' },
  { id: 'pedidos', label: 'Mis pedidos', icon: 'bi-box-seam' },
  { id: 'facturas', label: 'Mis facturas', icon: 'bi-receipt' },
  { id: 'seguimiento', label: 'Seguimiento', icon: 'bi-truck' },
  { id: 'perfil', label: 'Mi perfil', icon: 'bi-person' },
]

function ClienteDashboard() {
  const [active, setActive] = useState('inicio')
  return (
    <DashboardShell role="cliente" menu={menu} active={active} setActive={setActive} title="Mi cuenta">
      {active === 'inicio' && <>
        <div className="stats-grid">
          <StatCard icon="bi-box-seam" label="Pedidos" value="1" />
          <StatCard icon="bi-receipt" label="Facturas" value="1" />
          <StatCard icon="bi-truck" label="En entrega" value="1" />
        </div>
        <section className="dashboard-panel welcome-panel"><p className="eyebrow">MI CUENTA</p><h2>Tus productos y pedidos, en un solo lugar.</h2><p>Consulta el catálogo, revisa tus pedidos y sigue el estado de tus entregas.</p></section>
      </>}

      {active === 'catalogo' && <section className="dashboard-panel"><div className="panel-head"><div><p className="eyebrow">CATÁLOGO</p><h2>Productos disponibles</h2></div></div><div className="row g-4">{productosIniciales.map(p => <div className="col-lg-6" key={p.id}><ProductoCard {...p} /><button className="btn btn-purple mt-3">Agregar al pedido</button></div>)}</div></section>}

      {active === 'pedidos' && <section className="dashboard-panel"><p className="eyebrow">HISTORIAL</p><h2>Mis pedidos</h2><article className="order-card"><div className="order-title"><div><span className="order-id">#BK-201</span><h3>Supermercado El Ahorro</h3></div><span className="status">En camino</span></div><div className="order-details"><span><i className="bi bi-box" /> Jabón para ropa x80 · Lavaloza x40</span><strong>$615.500</strong></div></article></section>}

      {active === 'facturas' && <section className="dashboard-panel"><p className="eyebrow">FACTURACIÓN</p><h2>Mis facturas</h2><article className="invoice-card"><div><span className="order-id">FAC-001</span><h3>Pedido BK-201</h3><p>Supermercado El Ahorro · Transferencia</p></div><strong>$615.500</strong><span className="status success">Pagada</span></article></section>}

      {active === 'seguimiento' && <section className="dashboard-panel"><p className="eyebrow">SEGUIMIENTO</p><h2>Pedido BK-201</h2><div className="tracking"><div className="tracking-step done"><span>✓</span><div><strong>Preparado</strong><small>Pedido listo para despacho</small></div></div><div className="tracking-step done"><span>✓</span><div><strong>Despachado</strong><small>Salida del centro de distribución</small></div></div><div className="tracking-step current"><span>🚚</span><div><strong>En ruta</strong><small>Carlos Sierra · Bogotá Norte</small></div></div><div className="tracking-step"><span>4</span><div><strong>Pendiente de entrega</strong><small>Se actualizará al completar la entrega</small></div></div></div></section>}

      {active === 'perfil' && <section className="dashboard-panel"><p className="eyebrow">MI CUENTA</p><h2>Mi perfil</h2><div className="profile-card"><div className="employee-avatar"><i className="bi bi-person" /></div><h3>Cliente</h3><p>Nombre y correo se toman de tu cuenta de Supabase.</p><button className="btn btn-purple">Editar perfil</button></div></section>}
    </DashboardShell>
  )
}
export default ClienteDashboard
