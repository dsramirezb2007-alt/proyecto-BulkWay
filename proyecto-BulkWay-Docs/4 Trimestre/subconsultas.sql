#subconsultas
#___________________________________________________________
#1. Productos con Precio Superior al Promedio General y su Margen Diferencial
select p.nombre_producto as producto,
p.precio_producto as precio,
p.stock_producto as existencias,
(select round(avg(precio_producto), 2) 
 from productos) as promedio_global,
round(p.precio_producto - (select avg(precio_producto) 
from productos), 2) as diferencia_precio
from productos p
where p.precio_producto > (select avg(precio_producto) from productos) 
order by p.precio_producto desc;

#___________________________________________________________
#2. Clientes que Han Realizado Compras por Encima del Promedio de Facturación
select u.nombre as cliente, 
u.correo_usuario as correo,
rc.id_recibo_caja as num_factura, 
rc.total_pagar as monto_pagado,
rc.fecha_factura as fecha_pago
from usuarios u
inner join pedidos p on u.id_usuario = p.id_cliente
inner join recibocajas rc on p.id_pedido = rc.id_pedido
where rc.total_pagar > (
    select avg(total_pagar)
    from recibocajas
)
order by rc.total_pagar desc;
#___________________________________________________________
#3.Productos Pertenecientes a Categorías con Stock Total Crítico
select p.nombre_producto as producto,
p.stock_producto as existencias,
p.id_categoriaproducto as categoria
from productos p
where p.id_categoriaproducto in (
select id_categoriaproducto
from productos
group by id_categoriaproducto
having sum(stock_producto) < 500)
order by p.stock_producto asc;

#___________________________________________________________
#4
select u.nombre as repartidor,v.modelo as vehiculo, v.placa as placa,
count(e.id_envio) as total_entregas_exitosas
from envios e
inner join usuarios u on e.empleado = u.id_usuario
inner join vehiculos v on e.id_vehiculo = v.id_vehiculo
where e.estado_envio = 'Entregado'
group by u.id_usuario, u.nombre, v.modelo, v.placa
having count(e.id_envio) > (
select count(id_envio) / count(distinct empleado)
from envios
where estado_envio = 'Entregado')
order by total_entregas_exitosas desc;
#___________________________________________________________
#5. Clientes con Recibos de Caja en Estado Pendiente
select u.nombre as cliente,
u.correo_usuario as correo,
u.telefono as contacto
from usuarios u
where u.id_usuario in (
select p.id_cliente
from pedidos p
inner join recibocajas rc on p.id_pedido = rc.id_pedido
where rc.estado = 'Pendiente');
#___________________________________________________________
#6. Productos que Nunca Han Sido Vendidos en Ningún Pedido
select p.id_producto as codigo,
p.nombre_producto as producto_sin_ventas,
p.precio_producto as precio
from productos p
where p.id_producto not in (
select distinct id_producto
from detallepedidos);
#___________________________________________________________
#7. Rutas de Despacho que Tienen Envíos Registrados Actualmente 
select r.idruta as codigo_ruta,
r.nombre_ruta as ruta
from rutas r
where r.idruta in (
select distinct id_ruta
from envios);
#___________________________________________________________
#8. Pedidos Realizados por el Cliente con Mayor Facturación Histórica
select p.id_pedido as num_pedido,
p.fecha_pedido as fecha,
p.estado_pedido as estado
from pedidos p
where p.id_cliente = (
select p2.id_cliente
from pedidos p2
inner join recibocajas rc on p2.id_pedido = rc.id_pedido
group by p2.id_cliente
order by sum(rc.total_pagar) desc limit 1);
#___________________________________________________________
#9. Vehículos Asignados a Envíos con Estado Pendiente
select v.id_vehiculo as codigo_vehiculo,
v.modelo as vehiculo,
v.placa as placa
from vehiculos v
where v.id_vehiculo in (
select distinct id_vehiculo
from envios
where estado_envio = 'Pendiente');

#___________________________________________________________
#10. Usuarios Registrados con el Rol de Mayor Cantidad de Cuentas
select u.nombre as usuario,
u.correo_usuario as correo, u.id_rol as rol
from usuarios u
where u.id_rol = (
select id_rol
from usuarios
group by id_rol
order by count(id_usuario) desc limit 1);
#___________________________________________________________