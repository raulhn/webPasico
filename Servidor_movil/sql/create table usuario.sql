create table pasico_movil.usuarios(
	nid_usuario integer primary key auto_increment,
	nombre varchar(200),
	primer_apellido varchar(200),
	segundo_apellido varchar(200),
	correo_electronico varchar(200),
	password varchar(200),
	nid_persona integer,
	verificado varchar(1) default 'N',
	nid_rol integer
);

alter table pasico_movil.usuarios
	add constraint fk_usuarios_personas foreign key (nid_persona) references pasico_movil.persona(nid_persona);

alter table pasico_movil.usuarios
	add constraint fk_usuarios_roles foreign key (nid_rol) references pasico_movil.roles(nid_rol); 