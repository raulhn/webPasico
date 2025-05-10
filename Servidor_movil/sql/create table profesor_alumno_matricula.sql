create table pasico_movil.profesor_alumno_matricula(
    nid_profesor_alumno_matricula integer primary key,
    nid_profesor integer,
    nid_matricula_asignatura integer,
    fecha_alta date,
    fecha_baja date,
    fecha_actualizacion datetime default current_timestamp
);

alter table pasico_movil.profesor_alumno_matricula
    add constraint fk_profesor_alumno_matricula_profesor foreign key (nid_profesor) 
    references pasico_movil.persona(nid_persona);

alter table pasico_movil.profesor_alumno_matricula
    add constraint fk_profesor_alumno_matricula_matricula foreign key (nid_matricula_asignatura) 
    references pasico_movil.matricula_asignatura(nid_matricula_asignatura);