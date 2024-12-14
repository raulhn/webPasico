create table pasico.canciones_eu(
	nid_cancion_eu integer primary key auto_increment,
	titulo varchar(300)
);


create table pasico.votacion_canciones_eu(
	nid_cancion_eu integer primary key,
	votos integer
);

alter table pasico.votacion_canciones_eu add constraint fk_cancion_vontacion foreign key(nid_cancion_eu) references pasico.canciones_eu(nid_cancion_eu);