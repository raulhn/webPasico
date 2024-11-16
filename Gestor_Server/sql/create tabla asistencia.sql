create table pasico_gestor.evento_asistencia(
	nid_evento_asistencia integer primary key auto_increment,
	descripcion varchar(300),
	fecha date
);


create table pasico_gestor.asistentes(
	nid_evento_asistencia integer,
	nid_persona integer
);

alter table pasico_gestor.asistentes add constraint fk_asistente foreign key(nid_evento_asistencia) references pasico_gestor.evento_asistencia(nid_evento_asistencia);

alter table pasico_gestor.asistentes add constraint fk_persona_asistente foreign key(nid_persona) references pasico_gestor.persona(nid);

alter table pasico_gestor.asistentes add constraint pk_asistentes primary key(nid_evento_asistencia, nid_persona);