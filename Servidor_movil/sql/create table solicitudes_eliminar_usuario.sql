create table pasico.solicitudes_eliminar_usuario
(
  nid_solicitud_eliminar_usuario integer primary key auto_increment,
  correo_electronico varchar(600),
  fecha_creacion datetime default current_timestamp
);
