create table pasico_gestor.ficha_asistencia(
	nid_ficha_asistencia integer primary key auto_increment,
	nid_profesor integer,
	nid_asignatura integer,
	nombre varchar(400),
	fecha date
);

alter table pasico_gestor.ficha_asistencia add constraint fk_ficha_asistencia_profesor foreign key(nid_profesor) references pasico_gestor.persona(nid);
alter table pasico_gestor.ficha_asistencia add constraint fk_ficha_asistencia_asignatura foreign key(nid_asignatura) references pasico_gestor.asignatura(nid);

create table pasico_gestor.ficha_asistencia_alumno(
	nid_ficha_asistencia_alumno integer primary key auto_increment,
	nid_ficha_asistencia integer,
	nid_alumno integer,
	asistencia varchar(1) default 'S',
	comentario varchar(1000)
);


alter table pasico_gestor.ficha_asistencia_alumno add constraint fk_ficha_asistencia_alumno foreign key (nid_alumno) references pasico_gestor.persona(nid);
alter table pasico_gestor.ficha_asistencia_alumno add constraint fk_ficha_asistencia foreign key(nid_ficha_asistencia) references pasico_gestor.ficha_asistencia(nid_ficha_asistencia);

alter table pasico_gestor.ficha_asistencia_alumno add constraint uk_ficha_asistencia_alumno unique(nid_alumno, nid_ficha_asistencia);


create table pasico_gestor.persona_usuario(
  usuario varchar(50), 
  nid_persona integer,
  primary key(usuario, nid_persona));

alter table pasico_gestor.persona_usuario add constraint fk_persona_usuario foreign key(usuario) references pasico_gestor.usuario(usuario);
alter table pasico_gestor.persona_usuario add constraint fk_usuario_nid_persona foreign key(nid_persona) references pasico_gestor.persona(nid);
