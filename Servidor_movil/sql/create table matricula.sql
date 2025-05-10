create table pasico_movil.matricula(
    nid_persona integer,
    nid_matricula integer,
    nid_curso integer,
    primary key (nid_matricula),
    fecha_actualizacion datetime default current_timestamp
);

alter table pasico_movil.matricula
    add constraint fk_matricula_personas foreign key (nid_persona) 
    references pasico_movil.persona(nid_persona);

alter table pasico_movil.matricula
    add constraint fk_matricula_cursos foreign key (nid_curso) 
    references pasico_movil.curso(nid_curso);

