
create table pasico_movil.profesor(
    nid_persona integer,
    nid_asignatura integer,
    esBaja varchar(1) default 'N',
    primary key (nid_persona, nid_asignatura),
    fecha_actualizacion datetime default current_timestamp
);

alter table pasico_movil.profesor
    add constraint fk_profesor_personas foreign key (nid_persona) 
    references pasico_movil.persona(nid_persona);

alter table pasico_movil.profesor
    add constraint fk_profesor_asignaturas foreign key (nid_asignatura) 
    references pasico_movil.asignaturas(nid_asignatura);