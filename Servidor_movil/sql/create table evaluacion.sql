create table pasico_movil.evaluacion(
    nid_evaluacion integer primary key auto_increment,
    nid_trimestre integer,
    nid_asignatura integer,
    nid_profesor integer,
    sucio varchar(1) default 'N',
    fecha_actualizacion timestamp default current_timestamp
);


alter table pasico_movil.evaluacion
    add constraint fk_evaluacion_trimestre foreign key (nid_trimestre) references pasico_movil.trimestre(nid_trimestre);

alter table pasico_movil.evaluacion
    add constraint fk_evaluacion_asignatura foreign key (nid_asignatura) references pasico_movil.asignaturas(nid_asignatura);

alter table pasico_movil.evaluacion
    add constraint fk_evaluacion_profesor foreign key (nid_profesor) references pasico_movil.persona(nid_persona);