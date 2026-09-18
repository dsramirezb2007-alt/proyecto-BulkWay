import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav className="new-nav">
      <div className="container new-nav-inner">
        <Link className="new-brand" to="/"><span>BULK</span><b>WAY</b><small>OPERACIÓN DE ASEO</small></Link>
        <div className="new-nav-links">
          <a href="#empresa">Operación</a><a href="#servicios">Servicios</a><a href="#productos">Catálogo</a>
          <Link className="new-login" to="/login"><span>Portal</span><i>↗</i></Link>
        </div>
      </div>
    </nav>
  )
}
export default Navbar
