create table pasico_movil.notificaciones(
    nid_notificacion integer primary key auto_increment,
    push_token varchar(50) not null,
    fecha_creacion timestamp not null default current_timestamp,
    body varchar(255) ,
    data json,
    titulo varchar(50) not null,
    estado varchar(30) not null default 'PENDIENTE',
    id_envio_notificacion integer
);