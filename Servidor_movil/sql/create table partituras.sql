create table pasico_movil.partituras(
    nid_partitura integer primary key auto_increment,
    titulo varchar(150) not null,
    autor varchar(150),
    categoria varchar(50) ,
    nid_categoria integer,
    fecha_creacion datetime not null default current_timestamp,
    url_partitura varchar(255) 
);

create table partituras_evento(
    nid_evento_concierto integer,
    nid_partitura integer,
    primary key(nid_evento_concierto, nid_partitura)
);

alter table pasico_movil.partituras_evento add constraint fk_evento_concierto 
foreign key (nid_evento_concierto) references pasico_movil.evento_concierto(nid_evento_concierto) ;

alter table pasico_movil.partituras_evento add constraint fk_partitura
foreign key (nid_partitura) references pasico_movil.partituras(nid_partitura) ;

alter table pasico_movil.partituras add constraint fk_categoria_partitura foreign key (nid_categoria) 
references pasico_movil.categoria_partitura(nid_categoria) ;