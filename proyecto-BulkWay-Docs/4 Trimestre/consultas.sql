#consultas
#___________________________________________________________
#1 análisis de compras y éxito de entregas por cliente y rendimiento 
select u.nombre as cliente, u.correo_usuario as correo,
count(distinct p.id_pedido) as total_pedidos,
sum(rc.total_pagar) as total_facturado,
sum(case 
when e.estado_envio = 'Entregado' 
then 1 else 0 
end) as entregas_exitosas,
round((sum(case when e.estado_envio = 'Entregado' 
then 1 else 0 end) / 
count(distinct p.id_pedido)) * 100, 2) as porcentaje_exito
from usuarios u
inner join pedidos p on u.id_usuario = p.id_cliente
inner join recibocajas rc on p.id_pedido = rc.id_pedido
inner join envios e on p.id_pedido = e.id_pedido
group by u.id_usuario, u.nombre, u.correo_usuario
order by total_facturado desc;

#_______________________________________________________________
#2 análisis operativo de entregas por repartidor, vehículo y ruta
select u.nombre as repartidor, v.modelo as vehiculo, v.placa as placa,
r.nombre_ruta as ruta_asignada,
count(e.id_envio) as total_envíos,
max(e.fecha_entrega) as ultima_entrega,
sum(case
 when e.estado_envio = 'Entregado' 
 then 1 else 0 end) as envios_entregados,
sum(case when e.estado_envio = 'Pendiente' 
then 1 else 0 end) as envios_pendientes,
round((sum(case when e.estado_envio = 'Entregado' 
then 1 else 0 end) / count(e.id_envio)) * 100, 2) as porcentaje_efectividad,
datediff(current_date(),
max(e.fecha_entrega)) as dias_desde_ultima_entrega,
if(count(e.id_envio) >= 
10, 'Alto Rendimiento', 'Rendimiento Normal') as estado_repartidor
from envios e
inner join usuarios u on e.empleado = u.id_usuario
inner join vehiculos v on e.id_vehiculo = v.id_vehiculo
inner join rutas r on e.id_ruta = r.idruta
where u.id_rol = 3
group by u.id_usuario, u.nombre, v.modelo, v.placa, r.nombre_ruta
order by total_envíos desc;

#___________________________________________________________
#3 análisis de stock, precios promedio y valor total por categoría de productos
select c.nombre_categoria as categoria,
count(p.id_producto) as variedad_productos,
sum(p.stock_producto) as unidades_totales,
avg(p.precio_producto) as precio_promedio,
sum(p.precio_producto * p.stock_producto) as valor_total_inventario,
if(sum(p.precio_producto * p.stock_producto) >= 1000000, 'Alto Valor', 
'Bajo Valor') as clasificacion_inventario
from categoriaproductos c
inner join productos p on c.id_categoriaproducto = p.id_categoriaproducto
group by c.id_categoriaproducto, c.nombre_categoria
having sum(p.stock_producto) > 0
order by valor_total_inventario desc;

#___________________________________________________________
#4 trazabilidad de auditoría en movimientos de inventario
select dm.numero_lote as lote, p.nombre_producto as producto,
m.tipo_movimiento as tipo, dm.cantidad as unidades,
date_format(m.fechahora_movimiento, '%Y-%m-%d %H:%i') as fecha_registro,
m.descripcion as observacion_auditoria
from detallemovimientos dm
inner join movimientoinventarios m on dm.id_movimientoinventario = m.id_movimientoinventario
inner join productos p on dm.id_producto = p.id_producto
where dm.estado_producto = 'Disponible'
order by m.fechahora_movimiento desc;

#___________________________________________________________
#5 análisis de unidades vendidas e ingresos por producto 
select p.nombre_producto as producto,
c.nombre_categoria as categoria,
sum(dp.cantidad_pedido) as unidades_vendidas,
p.precio_producto as precio_unitario,
sum(dp.cantidad_pedido * p.precio_producto) as total_generado
from detallepedidos dp
inner join productos p on dp.id_producto = p.id_producto
inner join categoriaproductos c on p.id_categoriaproducto = c.id_categoriaproducto
inner join pedidos ped on dp.id_pedido = ped.id_pedido
where ped.estado_pedido = 'Completado'
group by p.id_producto, p.nombre_producto, c.nombre_categoria, p.precio_producto;

#___________________________________________________________
#6 control de cartera: recibos pendientes y días de vencimiento
select rc.id_recibo_caja as num_factura, u.nombre as cliente_debito,
u.telefono as contacto, rc.total_pagar as monto_pendiente,
rc.fecha_vencimiento as fecha_límite,
datediff(rc.fecha_vencimiento, now()) as dias_restantes
from recibocajas rc
inner join pedidos p on rc.id_pedido = p.id_pedido
inner join usuarios u on p.id_cliente = u.id_usuario
where rc.estado = 'Pendiente'
order by rc.fecha_vencimiento asc;

#___________________________________________________________
#7 consolidado de rutas de despacho y logística de flotas
select r.nombre_ruta as ruta,
count(e.id_envio) as total_despachos,
count(distinct e.empleado) as conductores_asignados,
min(e.fecha_salida) as primer_despacho,
max(e.fecha_salida) as ultimo_despacho
from rutas r
left join envios e on r.idruta = e.id_ruta
group by r.idruta, r.nombre_ruta
order by total_despachos desc;

#___________________________________________________________
#8 usuarios del sistema por rol y tipo de documento
select r.nombre_rol as rol_sistema, td.nombre_documento as tipo_identificacion,
u.nombre as nombre_completo, u.correo_usuario as email_contacto,
u.estado_usuario as estado_cuenta
from usuarios u
inner join roles r on u.id_rol = r.id_rol
inner join tipodocumentos td on u.id_tipo_documento = td.idtipo_documento
where u.estado_usuario in ('Activo', 'Pendiente')
order by r.nombre_rol, u.nombre;

#___________________________________________________________
#9 productos críticos con stock bajo y categoriales
select p.id_producto as codigo, p.nombre_producto as producto,
c.nombre_categoria as categoria, p.stock_producto as existencias_actuales,
p.precio_producto as costo_unitario
from productos p
inner join categoriaproductos c on p.id_categoriaproducto = c.id_categoriaproducto
where p.stock_producto < 100
order by p.stock_producto asc;

#___________________________________________________________
#10 resumen de descuentos aplicados en ventas completadas
select u.nombre as cliente,
count(p.id_pedido) as cantidad_pedidos,
sum(p.descuento) as total_descuentos_otorgados,
avg(p.descuento) as promedio_descuento_por_pedido
from pedidos p
inner join usuarios u on p.id_cliente = u.id_usuario
where p.descuento > 0.00
group by u.id_usuario, u.nombre
order by total_descuentos_otorgados desc;