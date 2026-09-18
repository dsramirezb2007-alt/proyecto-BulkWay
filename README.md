# BulkWay — Gestión de productos y distribución

Proyecto React/Vite orientado a la administración de un catálogo de productos de aseo, pedidos, inventario, facturación, rutas y entregas.

## Estructura

- `components/auth`: acceso, registro, recuperación y protección de rutas.
- `components/admin`: panel administrativo: pedidos, productos, facturación, empleados y rutas.
- `components/conductor`: panel independiente para despachos y rutas.
- `components/cliente`: catálogo, pedidos, facturas y seguimiento.
- `components/home`: portada pública y catálogo de aseo.
- `components/layout`: navegación y pie de página.
- `context`: sesión global.
- `services`: Supabase y API.
- `data`: productos y pedidos iniciales.
- `assets/images`: ilustraciones originales de productos y logística.
- `db.json`: datos locales para JSON Server.

## Inicio

```bash
npm install
npm run dev
```

En otra terminal, para usar el CRUD local:

```bash
npm run server
```

## Supabase

Crea `.env` a partir de `.env.example`.

Los roles esperados en `user_metadata.rol` son:

- `cliente`
- `administrador`
- `conductor`

Por seguridad, el formulario público de registro crea únicamente cuentas de cliente. Las cuentas administrativas y de conductor deben existir previamente y tener el rol correspondiente en Supabase.
