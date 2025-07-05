create table pasico_movil.tipo_progreso(
    nid_tipo_progreso integer primary key auto_increment,
    descripcion varchar(60),
    sucio varchar(1) default 'N',
    fecha_actualizacion timestamp default current_timestamp
);