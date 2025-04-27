create table pasico_movil.conexiones(
	nid_conexion integer primary key auto_increment, 
	token varchar(50), 
	fecha date,
	nid_usuario integer);
	
alter table pasico_movil.conexiones add constraint fk_conexion_usuario foreign key(nid_usuario) references pasico_movil.usuarios(nid_usuario);