USE bulkway_db;

DELIMITER $$

-- FUNCION 1: fn_ObtenerTextoEstado
CREATE FUNCTION fn_ObtenerTextoEstado(p_estado VARCHAR(20))
RETURNS VARCHAR(100)
DETERMINISTIC
BEGIN
    DECLARE v_mensaje VARCHAR(100);
    
    CASE p_estado
        WHEN 'Activo' THEN 
            SET v_mensaje = 'Usuario con acceso total autorizado.';
        WHEN 'Inactivo' THEN 
            SET v_mensaje = 'Acceso restringido temporalmente.';
        WHEN 'Suspendido' THEN 
            SET v_mensaje = 'Bloqueado por infracción de políticas de Bulkway.';
        WHEN 'Eliminado' THEN 
            SET v_mensaje = 'Registro archivado históricamente.';
        ELSE 
            SET v_mensaje = 'Estado en proceso de validación inicial.';
    END CASE;
    
    RETURN v_mensaje;
END $$

DELIMITER ;

-- CONSULTA DE PRUEBA: FUNCION 1
SELECT nombre, Correo_Usuario, fn_ObtenerTextoEstado(Estado_Usuario) AS Informacion_Estado FROM Usuarios;


DELIMITER $$

-- FUNCION 2: fn_DiasParaVencerFactura
CREATE FUNCTION fn_DiasParaVencerFactura(p_id_recibo INT)
RETURNS VARCHAR(100)
NOT DETERMINISTIC
READS SQL DATA
BEGIN
    DECLARE v_fecha_vencimiento DATETIME;
    DECLARE v_dias INT;
    DECLARE v_resultado VARCHAR(100);
    
    SELECT fecha_vencimiento INTO v_fecha_vencimiento 
    FROM ReciboCajas 
    WHERE id_Recibo_Caja = p_id_recibo;
    
    SET v_dias = DATEDIFF(v_fecha_vencimiento, NOW());
    
    IF v_dias > 0 THEN
        SET v_resultado = CONCAT('Restan ', v_dias, ' días para el vencimiento.');
    ELSEIF v_dias = 0 THEN
        SET v_resultado = 'La factura vence el día de hoy.';
    ELSE
        SET v_resultado = CONCAT('Alerta: Factura vencida hace ', ABS(v_dias), ' días.');
    END IF;
    
    RETURN v_resultado;
END $$

DELIMITER ;

-- CONSULTA DE PRUEBA: FUNCION 2
SELECT id_Recibo_Caja, total_pagar, fn_DiasParaVencerFactura(id_Recibo_Caja) AS Estado_Vencimiento FROM ReciboCajas;


DELIMITER $$

-- FUNCION 3: fn_CalcularTotalNetoPedido
CREATE FUNCTION fn_CalcularTotalNetoPedido(p_id_pedido INT)
RETURNS DECIMAL(12,2)
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE v_costo DECIMAL(12,2);
    DECLARE v_descuento DECIMAL(12,2);
    DECLARE v_total_neto DECIMAL(12,2);
    
    SELECT costo_productos, descuento INTO v_costo, v_descuento 
    FROM pedidos 
    WHERE id_Pedido = p_id_pedido;
    
    IF v_costo IS NULL THEN
        RETURN 0.00;
    END IF;
    
    SET v_total_neto = (v_costo - v_descuento) * 1.19;
    
    RETURN v_total_neto;
END $$

DELIMITER ;

-- CONSULTA DE PRUEBA: FUNCION 3
SELECT id_Pedido, costo_productos, descuento, fn_CalcularTotalNetoPedido(id_Pedido) AS Total_Con_IVA FROM pedidos;


DELIMITER $$

-- FUNCION 4: fn_VerificarStockCritico
CREATE FUNCTION fn_VerificarStockCritico(p_id_producto INT, p_umbral_minimo INT)
RETURNS VARCHAR(50)
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE v_stock_actual INT;
    DECLARE v_alerta VARCHAR(50);
    
    SELECT Stock_Producto INTO v_stock_actual 
    FROM Productos 
    WHERE id_Producto = p_id_producto;
    
    IF v_stock_actual <= p_umbral_minimo THEN
        SET v_alerta = 'CRÍTICO: Solicitar reabastecimiento';
    ELSE
        SET v_alerta = 'Stock en niveles óptimos';
    END IF;
    
    RETURN v_alerta;
END $$

DELIMITER ;

-- CONSULTA DE PRUEBA: FUNCION 4
SELECT id_Producto, Nombre_Producto, Stock_Producto, fn_VerificarStockCritico(id_Producto, 100) AS Alerta_Inventario FROM Productos;


-- FASE DE SEGURIDAD: CIFRADO CON SALT
ALTER TABLE Usuarios 
    MODIFY COLUMN Contraseña_Usuario VARCHAR(64) NOT NULL,
    ADD COLUMN Salt_Usuario VARCHAR(36) NOT NULL AFTER Contraseña_Usuario;


-- INSERCION DE NUEVO USUARIO CIFRADO
SET @mi_salt = UUID();
SET @password_plana = 'ClaveSegura2026';

INSERT INTO Usuarios (
    id_Rol, 
    id_Tipo_Documento, 
    Correo_Usuario, 
    Contraseña_Usuario, 
    Salt_Usuario, 
    Estado_Usuario, 
    nombre, 
    telefono
) VALUES (
    1, 
    1, 
    'seguridad.bulkway@bulkway.com',
    SHA2(CONCAT(@password_plana, @mi_salt), 256), 
    @mi_salt, 
    'Activo',
    'Diego Cripto Seguridad',
    '3159998877'
);

-- CONSULTA DE PRUEBA: NUEVO USUARIO
SELECT id_Usuario, nombre, Correo_Usuario, Contraseña_Usuario, Salt_Usuario FROM Usuarios WHERE Correo_Usuario = 'seguridad.bulkway@bulkway.com';


-- UPDATE: CIFRAR LOS USUARIOS EXISTENTES (MIGRACION)
SET SQL_SAFE_UPDATES = 0;

UPDATE Usuarios 
SET 
    Salt_Usuario = UUID(), 
    Contraseña_Usuario = SHA2(CONCAT(Contraseña_Usuario, Salt_Usuario), 256) 
WHERE Salt_Usuario IS NULL OR Salt_Usuario = '';

SET SQL_SAFE_UPDATES = 1;

-- CONSULTA DE PRUEBA: ESTADO GENERAL DE CIFRADO
SELECT id_Usuario, nombre, Correo_Usuario, Contraseña_Usuario, Salt_Usuario FROM Usuarios;
