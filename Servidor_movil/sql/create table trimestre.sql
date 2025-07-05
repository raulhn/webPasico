create table pasico_movil.trimestre(
    nid_trimestre integer primary key auto_increment,
    descripcion varchar(40) not null,
    sucio varchar(1) default 'N',
    fecha_actualizacion timestamp default current_timestamp
);