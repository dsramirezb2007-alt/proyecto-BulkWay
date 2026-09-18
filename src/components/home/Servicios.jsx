const servicios = [
  ['bi-basket3', 'Catálogo de productos', 'Organiza referencias de limpieza, ropa, cocina, desinfección y cuidado personal.'],
  ['bi-box-seam', 'Gestión de pedidos', 'Crea, consulta y administra pedidos de productos de aseo desde un mismo panel.'],
  ['bi-truck', 'Logística y distribución', 'Coordina despachos, rutas y entregas para llevar la mercancía a cada cliente.'],
  ['bi-bar-chart-line', 'Inventario y control', 'Consulta existencias, facturación y movimientos para mantener la operación organizada.'],
]
function Servicios() {
  return <section id="servicios" className="section-pad service-section"><div className="container"><div className="section-heading text-center"><p className="eyebrow">OPERACIÓN DE ASEO</p><h2>Todo el flujo comercial y logístico, en un solo lugar.</h2></div><div className="row g-4 mt-3">{servicios.map(([icon,title,text]) => <div className="col-md-6 col-lg-3" key={title}><article className="service-card"><i className={`bi ${icon}`} /><h3>{title}</h3><p>{text}</p></article></div>)}</div></div></section>
}
export default Servicios
