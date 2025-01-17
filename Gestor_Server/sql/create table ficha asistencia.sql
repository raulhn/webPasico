create table pasico_gestor.ficha_asistencia(
	nid_ficha_asistencia integer primary key auto_increment,
	nombre varchar(400),
	fecha date
);

create table pasico_gestor.ficha_asistencia_alumno(
	nid_ficha_asistencia_alumno integer primary auto_increment,
	nid_ficha_asistencia integer,
	nid_alumno integer,
	asistencia varchar(1),
	comentario varchar(1000)
);


alter table pasico_gestor.ficha_asistencia_alumno add constraint fk_ficha_asistencia_alumno foreign key (nid_alumno) references pasico_gestor.persona(nid);
alter table pasico_gestor.ficha_asistencia_alumno add constraint fk_ficha_asistencia foreign key(nid_ficha_asistencia) references pasico_gestor.ficha_asistencia(nid_ficha_asistencia);


create table pasico_gestor.persona_usuario(
  usuario varchar(50), 
  nid_persona integer,
  primary key(usuario, nid_persona));

alter table pasico_gestor.persona_usuario add constraint fk_persona_usuario foreign key(usuario) references pasico_gestor.usuario(usuario);
alter table pasico_gestor.persona_usuario add constraint fk_usuario_nid_persona foreign key(nid_persona) references pasico_gestor.persona(nid);
