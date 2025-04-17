create table pasico_movil.usuarios(
	nid_usuario integer primary key auto_increment,
	nombre varchar(200),
	primer_apellido varchar(200),
	segundo_apellido varchar(200),
	correo_electronico varchar(200),
	password varchar(200),
	nid_persona integer,
	verificado varchar(1) default 'N'
);

