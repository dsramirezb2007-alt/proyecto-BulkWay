function Footer() {
  return (
    <footer className="bulk-footer">
      <div className="container py-5">
        <div className="row g-4">
          <div className="col-md-5">
            <div className="bulk-brand footer-brand"><span>BULK</span><b>WAY</b></div>
            <p>Plataforma para gestionar productos de aseo, pedidos, inventario, facturación y distribución.</p>
          </div>
          <div className="col-md-3">
            <h6>CONTACTO</h6>
            <p>contacto@bulkway.com<br />+57 300 000 0000</p>
          </div>
          <div className="col-md-4">
            <h6>OPERACIÓN</h6>
            <p>Colombia · Operación de productos de aseo<br />Logística, despacho y seguimiento de entregas.</p>
          </div>
        </div>
        <hr />
        <small>© 2026 BulkWay · Proyecto React · Gestión de distribución</small>
      </div>
    </footer>
  )
}

export default Footer
