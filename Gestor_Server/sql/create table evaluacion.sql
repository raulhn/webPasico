create table pasico_gestor.trimestre(
	nid_trimestre integer primary key auto_increment,
	descripcion varchar(40)
);

create table pasico_gestor.tipo_progreso(
	nid_tipo_progreso integer primary key auto_increment,
	descripcion varchar(60)
);


create table pasico_gestor.evaluacion(
	nid_evaluacion integer primary key auto_increment,
	nid_trimestre integer,
	nid_asignatura integer,
	nid_profesor integer
);

create table pasico_gestor.evaluacion_matricula(
	nid_evaluacion_matricula integer primary key auto_increment,
	nid_evaluacion integer,
    nid_matricula_asignatura integer,
	nota decimal(4, 2),
	nid_tipo_progreso integer,
	comentario varchar(1000)
);


alter table pasico_gestor.evaluacion add constraint fk_evaluacion_trimestre foreign key(nid_trimestre) references pasico_gestor.trimestre(nid_trimestre);

alter table pasico_gestor.evaluacion add constraint fk_evaluacion_asignatura foreign key(nid_asignatura) references pasico_gestor.asignatura(nid);

alter table pasico_gestor.evaluacion add constraint fk_evaluacion_profesor foreign key(nid_profesor) references pasico_gestor.persona(nid);

alter table pasico_gestor.evaluacion_matricula add constraint fk_evaluacion_progreso foreign key(nid_tipo_progreso) references pasico_gestor.tipo_progreso(nid_tipo_progreso);

alter table pasico_gestor.evaluacion_matricula add constraint fk_evaluacion_matricula_asignatura foreign key(nid_matricula_asignatura) references pasico_gestor.matricula_asignatura(nid);

