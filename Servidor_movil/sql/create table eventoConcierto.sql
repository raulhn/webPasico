
create table pasico_movil.evento_concierto(
    nid_evento_concierto integer primary key auto_increment,
    nombre varchar(100) not null,
    fecha_evento date,
    descripcion varchar(255),
    publicado varchar(1) default 'N',
    vestimenta varchar(100),
    lugar varchar(100),
    borrado varchar(1) default 'N'
);