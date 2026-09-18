import { useAuth } from '../../context/AuthContext'

function RutasAdmin() {
  const { usuario } = useAuth()

  const esAdministradorPrincipal =
    usuario?.email?.toLowerCase() === 'admin@bulkway.com'

  const abrirRuta = () =>
    window.open(
      'https://www.google.com/maps/dir/?api=1&origin=Bogota&destination=Chapinero+Bogota',
      '_blank',
      'noopener,noreferrer'
    )

  return (
    <section className="dashboard-panel">
      <div className="panel-head">
        <div>
          <p className="eyebrow">GESTIÓN LOGÍSTICA</p>
          <h2>Rutas de entrega</h2>
        </div>
      </div>

      {esAdministradorPrincipal ? (
        <article className="route-card">
          <div className="route-map-icon">
            <i className="bi bi-map" />
          </div>

          <div>
            <span className="status success">Ruta generada</span>
            <h3>Carlos Sierra · Bogotá Norte</h3>
            <p>BK-201 → Calle 72 #20-15</p>
            <p>BK-202 → Carrera 24 #68-40</p>
            <p>2 pedidos asignados · Ruta optimizada</p>
          </div>

          <button
            className="btn btn-purple"
            onClick={abrirRuta}
          >
            Abrir en Google Maps
          </button>
        </article>
      ) : (
        <article className="route-card">
          <div className="route-map-icon">
            <i className="bi bi-map" />
          </div>

          <div>
            <span className="status">Sin rutas</span>
            <h3>No hay rutas asignadas</h3>
            <p>
              Esta cuenta todavía no tiene rutas de entrega registradas.
            </p>
          </div>
        </article>
      )}
    </section>
  )
}

export default RutasAdmin