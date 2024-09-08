create table pasico_gestor.horario_matricula_asignatura(
	nid_matricula_asignatura integer,
	nid_horario_clase integer,
	primary key(nid_matricula_asignatura, nid_horario_clase)
);

alter table pasico_gestor.horario_matricula_asignatura add constraint fk_horario_matricula_asignatura foreign key(nid_matricula_asignatura) references pasico_gestor.matricula_asignatura(nid);

alter table pasico_gestor.horario_matricula_asignatura add constraint fk_horario_matricula_clase foreign key(nid_horario_clase) references pasico_gestor.horario_clase(nid_horario_clase);