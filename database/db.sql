-- Data Base: facebook_db
-- tabla: usuarios
--   pk id_usuario
--      username
--      password
-- tabla: cuentas_facebook
--   pk id_cuenta
--   fk id_usuario
--      email
--      password  
-- tabla: publicaciones
--   pk id_publicaciones
--   fk id_cuenta
--      url
--      mensaje
--      numero_de_posts
--      intervalo_tiempo
--      estado_publicacion
-- tabla: publicaciones_grupos
--   pk id_publicacion_grupo
--   fk id_publicacion
--   fk id_grupo 
--      fecha
-- tabla: grupos_facebook
--   pk id_grupo
--      nombre_grupo
--;
--;
--;
--;
--;
--;
--Version 2;
--Crear la base de datos
-- CREATE DATABASE facebook_db;
-- --;
-- --Conectarse a la base de datos
-- \ c facebook_db;
-- --Tabla usuarios;
-- CREATE TABLE usuarios(
--   id_usuario SERIAL PRIMARY KEY,
--   username VARCHAR(50) NOT NULL UNIQUE,
--   password TEXT NOT NULL
-- );
-- --;
-- --Tabla cuentas_facebook;
-- CREATE TABLE cuentas_facebook (
--   id_cuenta SERIAL PRIMARY KEY,
--   id_usuario INT REFERENCES usuarios(id_usuario),
--   email VARCHAR(255) NOT NULL,
--   password TEXT NOT NULL
-- );
-- --;
-- --Tabla publicaciones;
-- CREATE TABLE publicaciones (
--   id_publicacion SERIAL PRIMARY KEY,
--   id_cuenta INT REFERENCES cuentas_facebook(id_cuenta),
--   url VARCHAR(255),
--   mensaje TEXT NOT NULL,
--   numero_de_posts INT DEFAULT 1,
--   intervalo_tiempo INT NOT NULL,
--   estado_publicacion VARCHAR(50) DEFAULT 'pendiente'
-- );
-- --;
-- --Tabla grupos_facebook
-- CREATE TABLE grupos_facebook(
--   id_grupo SERIAL PRIMARY KEY,
--   nombre_grupo VARCHAR(255) NOT NULL
-- );
-- --;
-- --Tabla publicaciones_grupos
-- CREATE TABLE publicaciones_grupos (
--   id_publicacion_grupo SERIAL PRIMARY KEY,
--   id_publicacion INT REFERENCES publicaciones(id_publicacion),
--   id_grupo INT REFERENCES grupos_facebook(id_grupo),
--   fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );
--;
--;
--;
--;
--;
--version3
--Crear la base de datos
CREATE DATABASE facebook_db;
--;
--Conectarse a la base de datos
\ c facebook_db;
--Tabla usuarios;
CREATE TABLE usuarios(
  id_usuario SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL
);
--;
--Tabla publicaciones;
CREATE TABLE publicaciones (
  id_publicacion SERIAL PRIMARY KEY,
  id_usuario INT REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  url VARCHAR(255),
  mensaje TEXT NOT NULL,
  numero_de_posts INT DEFAULT 1,
  intervalo_tiempo INT NOT NULL,
  estado_publicacion VARCHAR(50) DEFAULT 'pendiente'
);
--;
--Tabla grupos_facebook
CREATE TABLE grupos_facebook(
  id_grupo SERIAL PRIMARY KEY,
  nombre_grupo VARCHAR(255) NOT NULL
);
--;
--Tabla publicaciones_grupos
CREATE TABLE publicaciones_grupos (
  id_publicacion_grupo SERIAL PRIMARY KEY,
  id_publicacion INT REFERENCES publicaciones(id_publicacion) ON DELETE CASCADE,
  id_grupo INT REFERENCES grupos_facebook(id_grupo) ON DELETE CASCADE,
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
--;
INSERT INTO usuarios(email, password)
VALUES ('john@gmail.com', 123),
  ('jane@gmail.com', 456);