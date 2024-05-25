create table pasico_gestor.horario(
	nid_horario integer primary key auto_increment,
	nid_asignatura integer,
	nid_profesor integer
);


alter table pasico_gestor.horario add constraint fk_horario_asignatura foreign key (nid_asignatura) references pasico_gestor.asignatura(nid);


alter table pasico_gestor.matricula_asignatura add nid_horario_clase integer;

alter table pasico_gestor.matricula_asignatura add constraint fk_horario_matricula foreign key(nid_horario_clase) references pasico_gestor.horario_clase(nid_horario_clase);

create table pasico_gestor.horario_clase(
	nid_horario_clase integer primary key auto_increment,
	nid_horario integer,
	duracion_clase integer,
	hora_inicio integer,
	minutos_nicio integer,
	dia integer
);

alter table pasico_gestor.horario_clase add constraint fk_horario_clase foreign key(nid_horario) references pasico_gestor.horario(nid_horario);

alter table pasico_gestor.horario add constraint fk_horario_profesor foreign key(nid_profesor, nid_asignatura) references pasico_gestor.profesor(nid_persona, nid_asignatura); 