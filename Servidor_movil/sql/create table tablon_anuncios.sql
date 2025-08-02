create table pasico_movil.tipo_tablon(
    nid_tipo_tablon integer primary key auto_increment,
    descripcion varchar(100)
);

create table pasico_movil.tablon_anuncios(
    nid_tablon_anuncio integer primary key auto_increment,
    titulo varchar(100),
    descripcion varchar(1000),
    nid_tipo_tablon integer,
    fecha_creacion datetime default current_timestamp,
    fecha_modificacion datetime default current_timestamp on update current_timestamp
);

alter table pasico_movil.tablon_anuncios add constraint fk_tablon_anuncios foreign key (nid_tipo_tablon) references pasico_movil.tipo_tablon(nid_tipo_tablon);

