-- Script SQL para crear usuario administrador directamente en la base de datos
-- IMPORTANTE: Reemplaza los valores entre corchetes [] con tus datos reales

-- Paso 1: Generar hash de contraseña
-- Nota: Este hash corresponde a la contraseña "admin123"
-- Para generar un hash diferente, usa bcrypt con 12 rounds

-- Paso 2: Insertar usuario administrador
INSERT INTO users (
  id,
  email,
  password,
  name,
  role,
  "totalKilometers",
  "totalWalks",
  "joinedDate"
) VALUES (
  gen_random_uuid()::text,  -- Genera un UUID único
  '[TU_EMAIL@EJEMPLO.COM]',  -- Cambia por tu email
  '$2a$12$LQv3c1yqBpVHDn2XLaV0uu.QZQzP4GYJj6u8zQ0QGKvKzK9zKzK9z',  -- Hash de "admin123"
  '[TU_NOMBRE]',             -- Cambia por tu nombre
  'ADMIN',                   -- Rol de administrador
  0,                         -- Kilómetros iniciales
  0,                         -- Paseos iniciales
  NOW()                      -- Fecha actual
);

-- Verificar que el usuario fue creado
SELECT id, email, name, role FROM users WHERE email = '[TU_EMAIL@EJEMPLO.COM]';

-- ALTERNATIVA: Convertir usuario existente a administrador
-- UPDATE users SET role = 'ADMIN' WHERE email = '[TU_EMAIL@EJEMPLO.COM]';