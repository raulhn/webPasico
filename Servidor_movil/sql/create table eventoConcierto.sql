
create table pasico_movil.evento_concierto(
    nid_evento_concierto integer primary key auto_increment,
    nombre varchar(100) not null,
    fecha_evento date,
    descripcion varchar(255),
    tipo_evento varchar(50),
    publicado varchar(1) default 'N',
);