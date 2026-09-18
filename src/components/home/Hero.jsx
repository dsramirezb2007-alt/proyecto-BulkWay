import hero from '../../assets/images/hero-limpieza.svg'

function Hero() {
  return (
    <header id="inicio" className="new-hero">
      <div className="container">
        <div className="hero-grid-new">
          <div className="hero-copy-new">
            <div className="hero-kicker"><span>01</span><span>PRODUCTOS · OPERACIÓN · DISTRIBUCIÓN</span></div>
            <h1>Limpieza que se organiza.<br /><em>Distribución que fluye.</em></h1>
            <p>Una plataforma para administrar productos de aseo, pedidos, inventario, facturación y entregas desde un mismo lugar.</p>
            <div className="hero-actions"><a href="#productos" className="btn btn-purple">Ver catálogo</a><a href="#empresa" className="hero-text-link">Conocer la operación <span>↗</span></a></div>
          </div>
          <div className="hero-art-wrap">
            <div className="hero-art"><img src={hero} alt="Productos de limpieza y distribución" /></div>
            <div className="floating-note note-one"><strong>Catálogo</strong><span>Productos de aseo</span></div>
            <div className="floating-note note-two"><strong>Distribución</strong><span>Pedidos en movimiento</span></div>
          </div>
        </div>
      </div>
      <div className="hero-bottom"><div>ASEO PARA EL HOGAR</div><div>ROPA · COCINA · SUPERFICIES</div><div>CUIDADO PERSONAL</div></div>
    </header>
  )
}
export default Hero
