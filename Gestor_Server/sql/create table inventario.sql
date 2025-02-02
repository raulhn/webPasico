create table pasico_gestor.inventario(
	nid_inventario integer primary key auto_increment,
	descripcion varchar(400),
	cantidad integer,
	modelo varchar(150),
	num_serie varchar(100),
	comentarios varchar(500)
);

