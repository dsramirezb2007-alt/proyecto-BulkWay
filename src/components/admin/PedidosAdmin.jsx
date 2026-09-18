import { useEffect, useState } from 'react'
import { apiRequest } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import Modal from '../shared/Modal'

const basePedidos = [
  { id: 'BK-201', fecha: '02/09/2026', cliente: 'Supermercado El Ahorro', direccion: 'Calle 72 #20-15, Bogotá', cantRopa: 80, cantLoza: 40, total: 615500, conductor: 'Carlos Sierra', ruta: 'Chapinero Norte', estado: 'Pendiente' },
  { id: 'BK-202', fecha: '07/10/2026', cliente: 'Distribuciones La Economía', direccion: 'Carrera 24 #68-40, Bogotá', cantRopa: 60, cantLoza: 30, total: 433000, conductor: 'Carlos Sierra', ruta: 'Chapinero Norte', estado: 'Pendiente' },
]

const empty = { cliente: '', direccion: '', fecha: '', cantRopa: 0, cantLoza: 0 }

function PedidosAdmin({ soloNuevo = false }) {
  const { usuario } = useAuth()

  const esAdministradorPrincipal =
    usuario?.email?.toLowerCase() === 'admin@bulkway.com'

  const [pedidos, setPedidos] = useState([])
  const [form, setForm] = useState(empty)
  const [editing, setEditing] = useState(null)
  const [open, setOpen] = useState(soloNuevo)
  const [error, setError] = useState('')

  const cargar = async () => {
    try {
      const data = await apiRequest('/pedidos')
      setPedidos(data)
    } catch {
      const clavePedidos = `bulkwayPedidos_${usuario?.id || 'sin-usuario'}`
      setPedidos(JSON.parse(localStorage.getItem(clavePedidos) || '[]'))
    }
  }

  useEffect(() => { cargar() }, [])

  const todos = [
  ...(esAdministradorPrincipal ? basePedidos : []),
  ...pedidos,
  ]

  const guardar = async (e) => {
    e.preventDefault()
    setError('')
    const pedido = {
      ...form,
      id: editing || `BK-${Date.now()}`,
      cantRopa: Number(form.cantRopa),
      cantLoza: Number(form.cantLoza),
      total: Number(form.cantRopa) * 12900 + Number(form.cantLoza) * 8900,
      estado: 'Borrador',
      conductor: 'Carlos Sierra',
      ruta: 'Bogotá Norte',
    }
    try {
      await apiRequest(editing ? `/pedidos/${editing}` : '/pedidos', {
        method: editing ? 'PATCH' : 'POST',
        body: JSON.stringify(pedido),
      })
    } catch {
      const clavePedidos = `bulkwayPedidos_${usuario?.id || 'sin-usuario'}`
      const local = JSON.parse(localStorage.getItem('bulkwayPedidos') || '[]')
      const next = editing ? local.map(p => p.id === editing ? pedido : p) : [...local, pedido]
      localStorage.setItem(clavePedidos, JSON.stringify(next))
    }
    setForm(empty); setEditing(null); setOpen(false); cargar()
  }

  const eliminar = async (id) => {
    if (id.startsWith('BK-20')) {
      const clavePedidos = `bulkwayPedidos_${usuario?.id || 'sin-usuario'}`
      const local = JSON.parse(localStorage.getItem('bulkwayPedidos') || '[]').filter(p => p.id !== id)
      localStorage.setItem('bulkwayPedidos', JSON.stringify(local))
      cargar()
      return
    }
    try { await apiRequest(`/pedidos/${id}`, { method: 'DELETE' }) } catch {}
    cargar()
  }

  const editar = (p) => {
    setEditing(p.id)
    setForm({ cliente: p.cliente, direccion: p.direccion, fecha: p.fecha || '', cantRopa: p.cantRopa || 0, cantLoza: p.cantLoza || 0 })
    setOpen(true)
  }

  const publicar = async (p) => {
    const updated = { ...p, estado: 'Publicado' }
    try { await apiRequest(`/pedidos/${p.id}`, { method: 'PATCH', body: JSON.stringify({ estado: 'Publicado' }) }) }
    catch {
      const clavePedidos = `bulkwayPedidos_${usuario?.id || 'sin-usuario'}`
      const local = JSON.parse(localStorage.getItem(clavePedidos) || '[]').map(
        x => x.id === p.id ? updated : x
      )
      localStorage.setItem(clavePedidos, JSON.stringify(local))
    }
    cargar()
  }

  return (
    <>
      {!soloNuevo && (
        <section className="dashboard-panel">
          <div className="panel-head">
            <div><p className="eyebrow">GESTIÓN COMERCIAL</p><h2>Pedidos</h2></div>
            <button className="btn btn-purple" onClick={() => { setEditing(null); setForm(empty); setOpen(true) }}><i className="bi bi-plus-lg" /> Nuevo pedido</button>
          </div>
          {error && <div className="auth-message error">{error}</div>}
          <div className="order-list">
            {todos.map((p) => (
              <article className="order-card" key={p.id}>
                <div className="order-title"><div><span className="order-id">#{p.id}</span><h3>{p.cliente}</h3></div><span className={`status ${p.estado === 'Publicado' ? 'success' : ''}`}>{p.estado}</span></div>
                <div className="order-details">
                  <span><i className="bi bi-geo-alt" /> {p.direccion}</span>
                  <span><i className="bi bi-box" /> Jabón para ropa x{p.cantRopa || 0} · Lavaloza x{p.cantLoza || 0}</span>
                  <span><i className="bi bi-person" /> {p.conductor || 'Sin asignar'}</span>
                  <strong>${Number(p.total).toLocaleString('es-CO')}</strong>
                </div>
                <div className="order-actions">
                  <button onClick={() => editar(p)}>Editar</button>
                  <button onClick={() => publicar(p)}>Publicar</button>
                  <button className="danger-link" onClick={() => eliminar(p.id)}>Eliminar</button>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      <Modal open={open} title={editing ? 'Editar pedido' : 'Nuevo pedido'} onClose={() => setOpen(false)}>
        <form className="modal-form" onSubmit={guardar}>
          <input placeholder="Nombre del cliente" value={form.cliente} onChange={e => setForm({...form, cliente: e.target.value})} required />
          <input placeholder="Dirección de entrega" value={form.direccion} onChange={e => setForm({...form, direccion: e.target.value})} required />
          <input type="date" value={form.fecha} onChange={e => setForm({...form, fecha: e.target.value})} />
          <div className="form-two"><input type="number" min="0" placeholder="Cantidad jabón para ropa" value={form.cantRopa} onChange={e => setForm({...form, cantRopa: e.target.value})} /><input type="number" min="0" placeholder="Cantidad lavaloza" value={form.cantLoza} onChange={e => setForm({...form, cantLoza: e.target.value})} /></div>
          <button className="btn btn-purple btn-full">{editing ? 'Guardar cambios' : 'Guardar pedido'}</button>
        </form>
      </Modal>
    </>
  )
}

export default PedidosAdmin
