import Navbar from '../layout/Navbar'
import Hero from './Hero'
import Servicios from './Servicios'
import ProductoCard from './ProductoCard'
import Footer from '../layout/Footer'
import { productosIniciales } from '../../data/productos'
import catalogo from '../../assets/images/catalogo-limpieza.svg'
import logistica from '../../assets/images/logistica-limpieza.svg'

function Inicio() {
  return (
    <>
      <Navbar />
      <Hero />

      <section id="empresa" className="intro-strip">
        <div className="container">
          <div className="intro-grid">
            <div className="intro-number">01</div>
            <div>
              <p className="eyebrow">OPERACIÓN DE ASEO</p>
              <h2>Un sistema pensado para productos que se mueven todos los días.</h2>
            </div>
            <p className="body-copy">BulkWay conecta catálogo, inventario, pedidos y distribución en una experiencia diseñada para una operación comercial de productos de aseo.</p>
          </div>
        </div>
      </section>

      <section className="section-pad company-section modern-company">
        <div className="container">
          <div className="modern-company-grid">
            <div className="image-frame"><img className="section-image" src={catalogo} alt="Catálogo de productos de aseo" /><span className="image-tag">PRODUCTOS · ASEO</span></div>
            <div className="company-copy-block">
              <p className="eyebrow">PORTAFOLIO</p>
              <h2>Del cuidado del hogar al cuidado personal.</h2>
              <p className="body-copy">Una vista central para organizar detergentes, lavaloza, limpiadores, desinfectantes, jabones corporales y demás referencias de aseo.</p>
              <div className="mini-points"><span>✓ Hogar</span><span>✓ Ropa</span><span>✓ Cocina</span><span>✓ Cuidado personal</span></div>
              <a className="text-link" href="#productos">Explorar productos →</a>
            </div>
          </div>
        </div>
      </section>

      <Servicios />

      <section className="section-pad logistics-showcase modern-logistics">
        <div className="container">
          <div className="logistics-grid">
            <div className="logistics-copy">
              <p className="eyebrow">02 · LOGÍSTICA</p>
              <h2>Inventario, despacho y entrega con una misma lógica.</h2>
              <p className="body-copy">Visualiza existencias, prepara pedidos, asigna recorridos y acompaña cada despacho desde que sale del inventario hasta el punto de entrega.</p>
              <div className="process-line"><span>Inventario</span><i>→</i><span>Pedido</span><i>→</i><span>Despacho</span><i>→</i><span>Entrega</span></div>
            </div>
            <div className="logistics-visual"><img className="section-image" src={logistica} alt="Proceso de logística y distribución" /></div>
          </div>
        </div>
      </section>

      <section id="productos" className="section-pad products-section modern-products">
        <div className="container">
          <div className="products-heading"><div><p className="eyebrow">03 · CATÁLOGO</p><h2>Productos para cada rutina de limpieza.</h2></div><p>Consulta referencias disponibles para hogar, ropa, cocina, superficies y cuidado personal.</p></div>
          <div className="row g-4 mt-2">{productosIniciales.map(p => <div className="col-md-6 col-xl-4" key={p.id}><ProductoCard {...p} /></div>)}</div>
        </div>
      </section>

      <section className="bulk-cta modern-cta"><div className="container"><div className="cta-inner"><div><p className="eyebrow-light">04 · PORTAL</p><h2>Una operación más clara desde el primer pedido.</h2><p>Ingresa para consultar catálogo, pedidos, facturación y distribución.</p></div><a className="btn btn-purple" href="/login">Entrar al portal</a></div></div></section>
      <Footer />
    </>
  )
}
export default Inicio
