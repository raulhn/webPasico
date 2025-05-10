create table pasico_movil.curso(
    nid_curso integer primary key,
    descripcion varchar(300) not null,
    ano integer,
    fecha_actualizacion datetime default current_timestamp
);

