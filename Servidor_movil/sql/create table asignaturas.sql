create table pasico_movil.asignaturas(
    nid_asignatura integer,
    descripcion varchar(400),
    instrumento_banda integer,
    tipo_asignatura integer,
    fecha_actualizacion datetime default current_timestamp,
    primary key (nid_asignatura)
);

