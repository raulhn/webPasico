create table pasico.familia_instrumentos(
	nid varchar(1) primary key,
	descripcion varchar(50)
);

alter table pasico.preinscripcion add constraint fk_preinscripicion_familia foreign key(familia_instrumento) references pasico.familia_instrumentos(nid);

insert into pasico.familia_instrumentos(nid, descripcion) values (1, 'Viento Metal');
insert into pasico.familia_instrumentos(nid, descripcion) values (2, 'Viento Madera');
insert into pasico.familia_instrumentos(nid, descripcion) values (3, 'Percusión');
insert into pasico.familia_instrumentos(nid, descripcion) values (4, 'Cuerda');