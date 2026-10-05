-- 1. Asignar variables de sesión
SET @mi_salt = UUID();
SET @password_plana = 'ClaveSegura2026';

-- 2. Insertar el usuario con cifrado
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

-- 3. Verificar inmediatamente el resultado guardado
SELECT 
    id_Usuario, 
    nombre, 
    Correo_Usuario, 
    Contraseña_Usuario, 
    Salt_Usuario,
    CHAR_LENGTH(Contraseña_Usuario) AS Largo_Hash
FROM Usuarios 
WHERE Correo_Usuario = 'seguridad.bulkway@bulkway.com';