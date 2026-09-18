import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'

const iniciales = [
  { id: 'FAC-001', pedido: 'BK-201', cliente: 'Supermercado El Ahorro', total: 615500, estado: 'Pagada', metodo: 'Transferencia bancaria' },
  { id: 'FAC-002', pedido: 'BK-202', cliente: 'Distribuciones La Economía', total: 433000, estado: 'Pendiente', metodo: 'Nequi' },
]

function FacturacionAdmin() {
  const { usuario } = useAuth()

  const esAdministradorPrincipal =
    usuario?.email?.toLowerCase() === 'admin@bulkway.com'

  const claveFacturas = `bulkwayFacturas_${usuario?.id || 'sin-usuario'}`

  const [facturas, setFacturas] = useState(() => {
    const guardadas = localStorage.getItem(claveFacturas)

    if (guardadas) {
      return JSON.parse(guardadas)
    }

    return esAdministradorPrincipal ? iniciales : []
  })

  const cambiarEstado = (id, estado) => {
  const nuevasFacturas = facturas.map(
    f => f.id === id ? { ...f, estado } : f
  )

  setFacturas(nuevasFacturas)

  localStorage.setItem(
    claveFacturas,
    JSON.stringify(nuevasFacturas)
  )
  }

  return (
    <section className="dashboard-panel">
      <div className="panel-head"><div><p className="eyebrow">GESTIÓN FINANCIERA</p><h2>Facturación</h2></div></div>
      <div className="invoice-list">
        {facturas.map(f => (
          <article className="invoice-card" key={f.id}>
            <div><span className="order-id">{f.id}</span><h3>{f.cliente}</h3><p>Pedido {f.pedido} · {f.metodo}</p></div>
            <strong>${f.total.toLocaleString('es-CO')}</strong>
            <select value={f.estado} onChange={e => cambiarEstado(f.id, e.target.value)}><option>Pendiente</option><option>Pagada</option><option>En Mora</option></select>
          </article>
        ))}
      </div>
    </section>
  )
}
export default FacturacionAdmin
