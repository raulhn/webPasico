create table pasico_movil.envio_correo(
	nid_envio_correo integer primary key auto_increment,
	correo_electronico varchar(300),
	asunto varchar(200),
	cuerpo varchar(2000)
);

