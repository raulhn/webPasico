create table pasico_movil.evaluacion_matricula(
    nid_evaluacion_matricula integer primary key auto_increment,
    nid_evaluacion integer,
    nota  decimal(4,2),
    nid_tipo_progreso integer,
    nid_matricula_asignatura integer,
    comentario varchar(1000),
    sucio varchar(1) default 'N',
    fecha_actualizacion timestamp default current_timestamp
);

alter table pasico_movil.evaluacion_matricula
    add constraint fk_evaluacion_matricula_evaluacion foreign key (nid_evaluacion) references pasico_movil.evaluacion(nid_evaluacion);

alter table pasico_movil.evaluacion_matricula
    add constraint fk_evaluacion_matricula_tipo_progreso foreign key (nid_tipo_progreso) references pasico_movil.tipo_progreso(nid_tipo_progreso);