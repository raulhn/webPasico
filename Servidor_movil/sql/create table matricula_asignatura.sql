create table pasico_movil.matricula_asignatura(
    nid_matricula_asignatura integer primary key,
    nid_persona integer,
    nid_matricula integer,
    nid_asignatura integer,
    fecha_alta date,
    fecha_baja date,
    fecha_actualizacion datetime default current_timestamp
);

alter table pasico_movil.matricula_asignatura
    add constraint fk_matricula_asignatura_personas foreign key (nid_persona) 
    references pasico_movil.persona(nid_persona);

alter table pasico_movil.matricula_asignatura
    add constraint fk_matricula_asignatura_matricula foreign key (nid_matricula) 
    references pasico_movil.matricula(nid_matricula);

alter table pasico_movil.matricula_asignatura
    add constraint fk_matricula_asignatura_asignaturas foreign key (nid_asignatura) 
    references pasico_movil.asignaturas(nid_asignatura);