import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import Modal from '../shared/Modal'

function EmpleadosAdmin() {
  const { usuario } = useAuth()

  const esAdministradorPrincipal =
    usuario?.email?.toLowerCase() === 'admin@bulkway.com'

  const claveConductores =
    `bulkwayConductores_${usuario?.id || 'sin-usuario'}`

  const [empleados, setEmpleados] = useState(() => {
    const guardados = localStorage.getItem(claveConductores)

    if (guardados) {
      return JSON.parse(guardados)
    }

    return esAdministradorPrincipal
      ? [
          {
            id: 'COND-1',
            nombre: 'Carlos Sierra',
            cedula: '1029384756',
            telefono: '3204567890',
            correo: 'carlos.sierra@distribucion.com',
            zona: 'Bogotá Norte',
          },
        ]
      : []
  })

  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ nombre: '', cedula: '', telefono: '', correo: '', zona: '' })

  const guardar = (e) => {
    e.preventDefault()
    const next = [...empleados, {...form, id: `COND-${Date.now()}`}]
    setEmpleados(next)
    localStorage.setItem(claveConductores, JSON.stringify(next))
    setForm({ nombre: '', cedula: '', telefono: '', correo: '', zona: '' })
    setOpen(false)
  }

  return (
    <>
      <section className="dashboard-panel">
        <div className="panel-head"><div><p className="eyebrow">RECURSOS HUMANOS</p><h2>Empleados y conductores</h2></div><button className="btn btn-purple" onClick={() => setOpen(true)}><i className="bi bi-person-plus" /> Agregar conductor</button></div>
        <div className="employee-grid">
          {empleados.map(c => <article className="employee-card" key={c.id}><div className="employee-avatar"><i className="bi bi-person" /></div><h3>{c.nombre}</h3><p>Conductor principal · {c.zona}</p><p>{c.telefono}</p><p>{c.correo}</p><span className="status success">Activo</span></article>)}
        </div>
      </section>

      <Modal open={open} title="Nuevo conductor" onClose={() => setOpen(false)}>
        <form className="modal-form" onSubmit={guardar}>
          {['nombre','cedula','telefono','correo','zona'].map(field => <input key={field} type={field === 'correo' ? 'email' : 'text'} placeholder={field[0].toUpperCase()+field.slice(1)} value={form[field]} onChange={e => setForm({...form, [field]: e.target.value})} required />)}
          <button className="btn btn-purple btn-full">Guardar conductor</button>
        </form>
      </Modal>
    </>
  )
}
export default EmpleadosAdmin
