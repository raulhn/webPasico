create table pasico_gestor.horario(
	nid_horario integer primary key auto_increment,
	dia integer,
	hora_inicio varchar(5),
	hora_fin varchar(5),
	nid_asignatura integer
);


alter table pasico_gestor.horario add constraint fk_horario_asignatura foreign key (nid_asignatura) references pasico_gestor.asignatura(nid);


alter table pasico_gestor.matricula_asignatura add nid_horario integer;

alter table pasico_gestor.matricula_asignatura add constraint fk_horario_matricula foreign key(nid_horario) references pasico_gestor.horario(nid_horario);

create table pasico_gestor.horario_clase(
	nid_horario_clase integer primary key auto_increment,
	nid_horario integer,
	duracion varchar(5)
);

alter table pasico_gestor.horario_clase add constraint fk_horario_clase foreign key(nid_horario) references pasico_gestor.horario(nid_horario);

