create table pasico_movil.persona(
	nid_persona integer primary key,
	nombre varchar(300),
	primer_apellido varchar(300),
	segundo_apellido varchar(300),
	telefono int,
	fecha_nacimiento date,
	correo_electronico varchar(600),
	nif varchar(20),
	nid_madre integer,
    nid_padre integer,
	fecha_actualizacion datetime default current_timestamp,
	sucio varchar(1) default 'N',
);


create table pasico_movil.socios(
	nid_persona integer primary key,
	fecha_alta date,
	fecha_baja date,
	num_socio integer,
	fecha_actualizacion datetime default current_timestamp
);

alter table pasico_movil.socios add constraint fk_socio_persona foreign key(nid_persona) references pasico_movil.persona(nid_persona);

alter table pasico_movil.persona add constraint fk_persona_padre foreign key(nid_padre) references pasico_movil.persona(nid_persona);

alter table pasico_movil.persona add constraint fk_persona_madre foreign key(nid_madre) references pasico_movil.persona(nid_persona);