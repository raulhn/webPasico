create table pasico_gestor.inventario(
	nid_inventario integer primary key auto_increment,
	descripcion varchar(400),
	cantidad integer,
	modelo varchar(150),
	num_serie varchar(100),
	comentarios varchar(500)
);


create table pasico_gestor.prestamos(
	nid_prestamo integer primary key auto_increment,
	nid_persona integer,
	nid_inventario integer,
	fecha_inicio date,
	fecha_fin date,
	cantidad integer
);

alter table pasico_gestor.prestamos add constraint fk_prestamo_persona foreign key(nid_persona) references pasico_gestor.persona(nid);
alter table pasico_gestor.prestamos add constraint fk_prestamo_inventario foreign key(nid_inventario) references pasico_gestor.inventario(nid_inventario);