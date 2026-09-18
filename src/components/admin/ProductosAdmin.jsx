import { useEffect, useState } from 'react'
import { productosIniciales } from '../../data/productos'
import { useAuth } from '../../context/AuthContext'
import Modal from '../shared/Modal'

function ProductosAdmin() {
  const { usuario } = useAuth()

  const esAdministradorPrincipal =
    usuario?.email?.toLowerCase() === 'admin@bulkway.com'

  const claveProductos = `bulkwayProductos_${usuario?.id || 'sin-usuario'}`

  const [productos, setProductos] = useState(() => {
    const guardados = localStorage.getItem(claveProductos)

    if (guardados) {
      return JSON.parse(guardados)
    }

    return esAdministradorPrincipal ? productosIniciales : []
  })

  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ nombre: '', stock: '', precio: '' })

  useEffect(() => {
  localStorage.setItem(claveProductos, JSON.stringify(productos))
  }, [productos, claveProductos])

  const abrir = (producto = null) => {
    setEditing(producto?.id ?? null)
    setForm(producto ? { nombre: producto.nombre, stock: producto.stock, precio: producto.precio } : { nombre: '', stock: '', precio: '' })
    setOpen(true)
  }

  const guardar = (e) => {
    e.preventDefault()
    const item = { id: editing || `PROD-${Date.now()}`, nombre: form.nombre, stock: Number(form.stock), precio: Number(form.precio), icono: 'bi-droplet' }
    setProductos(editing ? productos.map(p => p.id === editing ? item : p) : [...productos, item])
    setOpen(false)
  }

  return (
    <>
      <section className="dashboard-panel">
        <div className="panel-head">
          <div><p className="eyebrow">GESTIÓN COMERCIAL</p><h2>Productos</h2></div>
          <button className="btn btn-purple" onClick={() => abrir()}><i className="bi bi-plus-lg" /> Agregar producto</button>
        </div>
        <div className="product-admin-grid">
          {productos.map(p => (
            <article className="admin-product-card" key={p.id}>
              <div className="product-icon"><i className={`bi ${p.icono}`} /></div>
              <h3>{p.nombre}</h3>
              <p>Stock: <strong>{p.stock}</strong></p>
              <p>Precio: <strong>${p.precio.toLocaleString('es-CO')}</strong></p>
              <div><button onClick={() => abrir(p)}>✏️ Modificar</button><button className="danger-link" onClick={() => setProductos(productos.filter(x => x.id !== p.id))}>🗑️ Eliminar</button></div>
            </article>
          ))}
        </div>
      </section>

      <Modal open={open} title={editing ? 'Modificar producto' : 'Nuevo producto'} onClose={() => setOpen(false)}>
        <form className="modal-form" onSubmit={guardar}>
          <input placeholder="Nombre" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} required />
          <input type="number" min="0" placeholder="Stock" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} required />
          <input type="number" min="0" placeholder="Precio" value={form.precio} onChange={e => setForm({...form, precio: e.target.value})} required />
          <button className="btn btn-purple btn-full">Guardar cambios</button>
        </form>
      </Modal>
    </>
  )
}
export default ProductosAdmin
