create table pasico_movil.validacion_mail(
	nid_validacion integer primary key auto_increment,
	nid_usuario integer,
	token varchar(70),
	fecha date,
	expiracion datetime
);

alter table validacion_mail add constraint fk_validacion_usuario foreign key(nid_usuario) references pasico_movil.usuarios(nid_usuario);