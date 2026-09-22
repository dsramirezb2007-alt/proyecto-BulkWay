import { useEffect, useMemo, useState } from 'react'
import DashboardShell from '../shared/DashboardShell'
import StatCard from '../shared/StatCard'
import ProductoCard from '../home/ProductoCard'
import { apiRequest } from '../../services/api'
import { useAuth } from '../../context/AuthContext'

const menu = [
  {
    id: 'inicio',
    label: 'Resumen',
    icon: 'bi-grid-1x2',
  },
  {
    id: 'catalogo',
    label: 'Catálogo',
    icon: 'bi-basket3',
  },
  {
    id: 'pedidos',
    label: 'Mis pedidos',
    icon: 'bi-box-seam',
  },
  {
    id: 'facturas',
    label: 'Mis facturas',
    icon: 'bi-receipt',
  },
  {
    id: 'seguimiento',
    label: 'Seguimiento',
    icon: 'bi-truck',
  },
  {
    id: 'perfil',
    label: 'Mi perfil',
    icon: 'bi-person',
  },
]

function ClienteDashboard() {
  const { usuario } = useAuth()

  const [active, setActive] = useState('inicio')
  const [productos, setProductos] = useState([])
  const [pedidos, setPedidos] = useState([])
  const [carrito, setCarrito] = useState([])
  const [cargando, setCargando] = useState(true)
  const [creandoPedido, setCreandoPedido] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [tipoMensaje, setTipoMensaje] = useState('warning')

  const nombreUsuario =
    usuario?.user_metadata?.nombre ||
    usuario?.user_metadata?.nombreCompleto ||
    usuario?.user_metadata?.full_name ||
    usuario?.user_metadata?.name ||
    'Cliente'

  const correoUsuario =
    usuario?.email ||
    usuario?.user_metadata?.email ||
    ''

  const cargarDatos = async () => {
    try {
      setCargando(true)
      setMensaje('')

      const [productosData, pedidosData] =
        await Promise.all([
          apiRequest('/productos'),
          apiRequest('/pedidos'),
        ])

      setProductos(
        Array.isArray(productosData)
          ? productosData
          : []
      )

      setPedidos(
        Array.isArray(pedidosData)
          ? pedidosData
          : []
      )
    } catch (error) {
      console.error(error)

      setTipoMensaje('warning')
      setMensaje(
        'No fue posible cargar la información de la cuenta.'
      )
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    cargarDatos()
  }, [])

  const misPedidos = useMemo(() => {
    if (!correoUsuario) {
      return []
    }

    return pedidos.filter(pedido => {
      const emailPedido = String(
        pedido?.clienteEmail || ''
      )
        .trim()
        .toLowerCase()

      return (
        emailPedido &&
        emailPedido === correoUsuario.trim().toLowerCase()
      )
    })
  }, [pedidos, correoUsuario])

  const pedidosEnRuta = misPedidos.filter(pedido => {
    const estado = String(
      pedido?.estado || ''
    ).toLowerCase()

    return (
      estado === 'en ruta' ||
      estado === 'en camino' ||
      estado === 'despachado'
    )
  }).length

  const pedidosEntregados = misPedidos.filter(pedido => {
    return (
      String(
        pedido?.estado || ''
      ).toLowerCase() === 'entregado'
    )
  }).length

  const totalFacturas = misPedidos.filter(pedido => {
    const estado = String(
      pedido?.estado || ''
    ).toLowerCase()

    return estado === 'entregado'
  }).length

  const totalCarrito = useMemo(() => {
    return carrito.reduce(
      (total, item) =>
        total +
        Number(item.precio || 0) *
          Number(item.cantidad || 0),
      0
    )
  }, [carrito])

  const cantidadCarrito = useMemo(() => {
    return carrito.reduce(
      (total, item) =>
        total + Number(item.cantidad || 0),
      0
    )
  }, [carrito])

  const agregarAlCarrito = producto => {
    setMensaje('')

    setCarrito(prev => {
      const existente = prev.find(
        item => item.id === producto.id
      )

      if (existente) {
        return prev.map(item =>
          item.id === producto.id
            ? {
                ...item,
                cantidad:
                  Number(item.cantidad || 0) + 1,
              }
            : item
        )
      }

      return [
        ...prev,
        {
          ...producto,
          cantidad: 1,
        },
      ]
    })
  }

  const cambiarCantidad = (productoId, cantidad) => {
    const nuevaCantidad = Number(cantidad)

    if (nuevaCantidad <= 0) {
      setCarrito(prev =>
        prev.filter(item => item.id !== productoId)
      )
      return
    }

    setCarrito(prev =>
      prev.map(item =>
        item.id === productoId
          ? {
              ...item,
              cantidad: nuevaCantidad,
            }
          : item
      )
    )
  }

  const eliminarDelCarrito = productoId => {
    setCarrito(prev =>
      prev.filter(item => item.id !== productoId)
    )
  }

  const crearPedido = async () => {
    if (!carrito.length) {
      setTipoMensaje('warning')
      setMensaje(
        'Agrega al menos un producto al pedido.'
      )
      return
    }

    if (!correoUsuario) {
      setTipoMensaje('warning')
      setMensaje(
        'No se pudo identificar el correo de la cuenta.'
      )
      return
    }

    try {
      setCreandoPedido(true)
      setMensaje('')

      const pedidosCreados = []

      for (const item of carrito) {
        const cantidad = Number(item.cantidad || 0)
        const precioUnitario = Number(
          item.precio || 0
        )
        const subtotal =
          cantidad * precioUnitario

        const nuevoPedido = {
          id: `PED-${Date.now()}-${Math.floor(
            Math.random() * 1000
          )}`,
          fecha: new Date()
            .toISOString()
            .slice(0, 10),

          cliente: nombreUsuario,
          clienteEmail: correoUsuario,

          direccion: 'Pendiente por confirmar',

          productoId: item.id,
          producto: item.nombre,

          cantidad,
          precioUnitario,
          subtotal,
          total: subtotal,

          conductor: 'Sin asignar',
          ruta: 'Sin asignar',

          estado: 'Pendiente',
        }

        const pedidoCreado = await apiRequest(
          '/pedidos',
          {
            method: 'POST',
            body: JSON.stringify(
              nuevoPedido
            ),
          }
        )

        pedidosCreados.push(pedidoCreado)
      }

      setCarrito([])

      setTipoMensaje('success')
      setMensaje(
        `Pedido creado correctamente. Se registraron ${pedidosCreados.length} pedido(s).`
      )

      await cargarDatos()
      setActive('pedidos')
    } catch (error) {
      console.error(error)

      setTipoMensaje('warning')
      setMensaje(
        'No fue posible crear el pedido.'
      )
    } finally {
      setCreandoPedido(false)
    }
  }

  const pedidoEnSeguimiento = useMemo(() => {
    return (
      misPedidos.find(pedido => {
        const estado = String(
          pedido?.estado || ''
        ).toLowerCase()

        return (
          estado === 'en ruta' ||
          estado === 'en camino' ||
          estado === 'despachado'
        )
      }) ||
      misPedidos[0] ||
      null
    )
  }, [misPedidos])

  const estadoPedido = pedidoEnSeguimiento
    ? String(
        pedidoEnSeguimiento.estado || ''
      ).toLowerCase()
    : ''

  const preparado =
    estadoPedido === 'en preparación' ||
    estadoPedido === 'en preparacion' ||
    estadoPedido === 'despachado' ||
    estadoPedido === 'en ruta' ||
    estadoPedido === 'en camino' ||
    estadoPedido === 'entregado'

  const despachado =
    estadoPedido === 'despachado' ||
    estadoPedido === 'en ruta' ||
    estadoPedido === 'en camino' ||
    estadoPedido === 'entregado'

  const enRuta =
    estadoPedido === 'en ruta' ||
    estadoPedido === 'en camino'

  const entregado =
    estadoPedido === 'entregado'

  return (
    <DashboardShell
      role="cliente"
      menu={menu}
      active={active}
      setActive={setActive}
      title="Mi cuenta"
    >
      {mensaje && (
        <div
          className={`alert ${
            tipoMensaje === 'success'
              ? 'alert-success'
              : 'alert-warning'
          }`}
          role="alert"
        >
          {mensaje}
        </div>
      )}

      {cargando ? (
        <section className="dashboard-panel">
          <p>
            Cargando información de tu cuenta...
          </p>
        </section>
      ) : (
        <>
          {active === 'inicio' && (
            <>
              <div className="stats-grid">
                <StatCard
                  icon="bi-box-seam"
                  label="Pedidos"
                  value={misPedidos.length}
                />

                <StatCard
                  icon="bi-receipt"
                  label="Entregados"
                  value={pedidosEntregados}
                />

                <StatCard
                  icon="bi-truck"
                  label="En entrega"
                  value={pedidosEnRuta}
                />

                <StatCard
                  icon="bi-cart3"
                  label="Carrito"
                  value={cantidadCarrito}
                />
              </div>

              <section className="dashboard-panel welcome-panel">
                <p className="eyebrow">
                  MI CUENTA
                </p>

                <h2>
                  Bienvenido, {nombreUsuario}.
                </h2>

                <p>
                  Consulta el catálogo, crea pedidos
                  y revisa el estado de tus entregas.
                </p>

                <div className="dashboard-actions">
                  <button
                    className="btn btn-purple"
                    onClick={() =>
                      setActive('catalogo')
                    }
                  >
                    <i className="bi bi-basket3" /> Ver catálogo
                  </button>

                  <button
                    className="btn btn-outline"
                    onClick={() =>
                      setActive('pedidos')
                    }
                  >
                    <i className="bi bi-box-seam" /> Mis pedidos
                  </button>
                </div>
              </section>
            </>
          )}

          {active === 'catalogo' && (
            <section className="dashboard-panel">
              <div className="panel-head">
                <div>
                  <p className="eyebrow">
                    CATÁLOGO
                  </p>

                  <h2>
                    Productos disponibles
                  </h2>
                </div>

                <span className="status">
                  {productos.length} productos
                </span>
              </div>

              {productos.length === 0 ? (
                <div className="empty-state">
                  <i className="bi bi-box-seam" />

                  <h3>
                    No hay productos disponibles
                  </h3>

                  <p>
                    Administración todavía no ha
                    registrado productos.
                  </p>
                </div>
              ) : (
                <>
                  <div className="row g-4">
                    {productos.map(producto => (
                      <div
                        className="col-lg-6"
                        key={producto.id}
                      >
                        <ProductoCard
                          {...producto}
                          icono={
                            producto.icono ||
                            'bi-box-seam'
                          }
                        />

                        <button
                          className="btn btn-purple mt-3"
                          disabled={
                            Number(
                              producto.stock || 0
                            ) <= 0
                          }
                          onClick={() =>
                            agregarAlCarrito(
                              producto
                            )
                          }
                        >
                          <i className="bi bi-cart-plus" />{' '}
                          {Number(
                            producto.stock || 0
                          ) <= 0
                            ? 'Sin stock'
                            : 'Agregar al pedido'}
                        </button>
                      </div>
                    ))}
                  </div>

                  {carrito.length > 0 && (
                    <div
                      className="dashboard-panel"
                      style={{
                        marginTop: '24px',
                      }}
                    >
                      <div className="panel-head">
                        <div>
                          <p className="eyebrow">
                            CARRITO
                          </p>

                          <h2>
                            Tu pedido
                          </h2>
                        </div>

                        <span className="status">
                          {cantidadCarrito} unidades
                        </span>
                      </div>

                      <div className="order-list">
                        {carrito.map(item => (
                          <article
                            className="order-card"
                            key={item.id}
                          >
                            <div className="order-title">
                              <div>
                                <span className="order-id">
                                  {item.id}
                                </span>

                                <h3>
                                  {item.nombre}
                                </h3>
                              </div>

                              <strong>
                                $
                                {(
                                  Number(
                                    item.precio || 0
                                  ) *
                                  Number(
                                    item.cantidad || 0
                                  )
                                ).toLocaleString(
                                  'es-CO'
                                )}
                              </strong>
                            </div>

                            <div className="order-details">
                              <span>
                                Precio unitario: $
                                {Number(
                                  item.precio || 0
                                ).toLocaleString(
                                  'es-CO'
                                )}
                              </span>

                              <label>
                                Cantidad:
                                <input
                                  type="number"
                                  min="1"
                                  max={Number(
                                    item.stock || 1
                                  )}
                                  value={
                                    item.cantidad
                                  }
                                  onChange={e =>
                                    cambiarCantidad(
                                      item.id,
                                      e.target.value
                                    )
                                  }
                                  style={{
                                    width: '80px',
                                    marginLeft:
                                      '8px',
                                  }}
                                />
                              </label>
                            </div>

                            <div className="dashboard-actions">
                              <button
                                className="btn btn-outline"
                                onClick={() =>
                                  eliminarDelCarrito(
                                    item.id
                                  )
                                }
                              >
                                <i className="bi bi-trash" />{' '}
                                Quitar
                              </button>
                            </div>
                          </article>
                        ))}
                      </div>

                      <div
                        className="panel-head"
                        style={{
                          marginTop: '20px',
                        }}
                      >
                        <strong>
                          Total del pedido
                        </strong>

                        <h3>
                          $
                          {totalCarrito.toLocaleString(
                            'es-CO'
                          )}
                        </h3>
                      </div>

                      <button
                        className="btn btn-purple"
                        disabled={creandoPedido}
                        onClick={crearPedido}
                      >
                        <i className="bi bi-check2-circle" />{' '}
                        {creandoPedido
                          ? 'Creando pedido...'
                          : 'Confirmar pedido'}
                      </button>
                    </div>
                  )}
                </>
              )}
            </section>
          )}

          {active === 'pedidos' && (
            <section className="dashboard-panel">
              <div className="panel-head">
                <div>
                  <p className="eyebrow">
                    HISTORIAL
                  </p>

                  <h2>
                    Mis pedidos
                  </h2>
                </div>

                <span className="status">
                  {misPedidos.length} pedidos
                </span>
              </div>

              {misPedidos.length === 0 ? (
                <div className="empty-state">
                  <i className="bi bi-inbox" />

                  <h3>
                    Todavía no tienes pedidos
                  </h3>

                  <p>
                    Cuando realices un pedido,
                    aparecerá aquí.
                  </p>

                  <button
                    className="btn btn-purple"
                    onClick={() =>
                      setActive('catalogo')
                    }
                  >
                    <i className="bi bi-basket3" /> Ir al catálogo
                  </button>
                </div>
              ) : (
                <div className="order-list">
                  {misPedidos.map(pedido => (
                    <article
                      className="order-card"
                      key={pedido.id}
                    >
                      <div className="order-title">
                        <div>
                          <span className="order-id">
                            #{pedido.id}
                          </span>

                          <h3>
                            {pedido.producto ||
                              'Pedido'}
                          </h3>
                        </div>

                        <span className="status">
                          {pedido.estado ||
                            'Pendiente'}
                        </span>
                      </div>

                      <div className="order-details">
                        <span>
                          <i className="bi bi-calendar3" />{' '}
                          {pedido.fecha ||
                            'Fecha no disponible'}
                        </span>

                        <span>
                          <i className="bi bi-box" />{' '}
                          Cantidad:{' '}
                          {pedido.cantidad || 0}
                        </span>

                        <span>
                          <i className="bi bi-geo-alt" />{' '}
                          {pedido.direccion ||
                            'Dirección pendiente'}
                        </span>

                        <span>
                          <i className="bi bi-truck" />{' '}
                          Conductor:{' '}
                          {pedido.conductor ||
                            'Sin asignar'}
                        </span>

                        <span>
                          <i className="bi bi-map" />{' '}
                          Ruta:{' '}
                          {pedido.ruta ||
                            'Sin asignar'}
                        </span>
                      </div>

                      <div className="dashboard-actions">
                        <strong>
                          $
                          {Number(
                            pedido.total || 0
                          ).toLocaleString(
                            'es-CO'
                          )}
                        </strong>

                        <button
                          className="btn btn-outline"
                          onClick={() =>
                            setActive(
                              'seguimiento'
                            )
                          }
                        >
                          <i className="bi bi-truck" />{' '}
                          Ver seguimiento
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          )}

          {active === 'facturas' && (
            <section className="dashboard-panel">
              <p className="eyebrow">
                FACTURACIÓN
              </p>

              <h2>
                Mis facturas
              </h2>

              {misPedidos.length === 0 ? (
                <div className="empty-state">
                  <i className="bi bi-receipt" />

                  <h3>
                    No tienes facturas disponibles
                  </h3>

                  <p>
                    Las facturas asociadas a tus
                    pedidos aparecerán aquí.
                  </p>
                </div>
              ) : (
                <div className="order-list">
                  {misPedidos.map((pedido, index) => (
                    <article
                      className="invoice-card"
                      key={pedido.id}
                    >
                      <div>
                        <span className="order-id">
                          FAC-{String(
                            index + 1
                          ).padStart(3, '0')}
                        </span>

                        <h3>
                          Pedido #{pedido.id}
                        </h3>

                        <p>
                          {pedido.producto ||
                            'Pedido'}{' '}
                          ·{' '}
                          {pedido.fecha ||
                            'Fecha no disponible'}
                        </p>
                      </div>

                      <strong>
                        $
                        {Number(
                          pedido.total || 0
                        ).toLocaleString(
                          'es-CO'
                        )}
                      </strong>

                      <span className="status success">
                        Registrada
                      </span>
                    </article>
                  ))}
                </div>
              )}
            </section>
          )}

          {active === 'seguimiento' && (
            <section className="dashboard-panel">
              <p className="eyebrow">
                SEGUIMIENTO
              </p>

              <h2>
                Seguimiento de entrega
              </h2>

              {!pedidoEnSeguimiento ? (
                <div className="empty-state">
                  <i className="bi bi-truck" />

                  <h3>
                    No hay pedidos para seguir
                  </h3>

                  <p>
                    Cuando tengas un pedido
                    registrado, podrás consultar
                    su estado aquí.
                  </p>
                </div>
              ) : (
                <>
                  <div className="order-card">
                    <div className="order-title">
                      <div>
                        <span className="order-id">
                          #{pedidoEnSeguimiento.id}
                        </span>

                        <h3>
                          {pedidoEnSeguimiento.producto ||
                            'Pedido'}
                        </h3>
                      </div>

                      <span className="status">
                        {pedidoEnSeguimiento.estado ||
                          'Pendiente'}
                      </span>
                    </div>

                    <div className="order-details">
                      <span>
                        <i className="bi bi-geo-alt" />{' '}
                        {pedidoEnSeguimiento.direccion ||
                          'Dirección pendiente'}
                      </span>

                      <span>
                        <i className="bi bi-map" />{' '}
                        Ruta:{' '}
                        {pedidoEnSeguimiento.ruta ||
                          'Sin asignar'}
                      </span>

                      <span>
                        <i className="bi bi-truck" />{' '}
                        Conductor:{' '}
                        {pedidoEnSeguimiento.conductor ||
                          'Sin asignar'}
                      </span>
                    </div>
                  </div>

                  <div className="tracking">
                    <div
                      className={`tracking-step ${
                        preparado
                          ? 'done'
                          : ''
                      }`}
                    >
                      <span>
                        {preparado
                          ? '✓'
                          : '1'}
                      </span>

                      <div>
                        <strong>
                          Pedido preparado
                        </strong>

                        <small>
                          El pedido está siendo
                          gestionado.
                        </small>
                      </div>
                    </div>

                    <div
                      className={`tracking-step ${
                        despachado
                          ? 'done'
                          : ''
                      }`}
                    >
                      <span>
                        {despachado
                          ? '✓'
                          : '2'}
                      </span>

                      <div>
                        <strong>
                          Despachado
                        </strong>

                        <small>
                          El pedido salió para
                          entrega.
                        </small>
                      </div>
                    </div>

                    <div
                      className={`tracking-step ${
                        enRuta
                          ? 'current'
                          : entregado
                            ? 'done'
                            : ''
                      }`}
                    >
                      <span>
                        {entregado
                          ? '✓'
                          : '3'}
                      </span>

                      <div>
                        <strong>
                          En ruta
                        </strong>

                        <small>
                          {enRuta
                            ? 'El conductor está realizando la entrega.'
                            : 'Se activará cuando el pedido salga a ruta.'}
                        </small>
                      </div>
                    </div>

                    <div
                      className={`tracking-step ${
                        entregado
                          ? 'done'
                          : ''
                      }`}
                    >
                      <span>
                        {entregado
                          ? '✓'
                          : '4'}
                      </span>

                      <div>
                        <strong>
                          Entregado
                        </strong>

                        <small>
                          {entregado
                            ? 'Entrega completada correctamente.'
                            : 'Pendiente de entrega.'}
                        </small>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </section>
          )}

          {active === 'perfil' && (
            <section className="dashboard-panel">
              <p className="eyebrow">
                MI CUENTA
              </p>

              <h2>
                Mi perfil
              </h2>

              <div className="profile-card">
                <div className="employee-avatar">
                  <i className="bi bi-person" />
                </div>

                <h3>
                  {nombreUsuario}
                </h3>

                <p>
                  {correoUsuario ||
                    'Correo no disponible'}
                </p>

                <span className="status">
                  Cliente
                </span>
              </div>
            </section>
          )}
        </>
      )}
    </DashboardShell>
  )
}

export default ClienteDashboard