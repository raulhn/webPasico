create table pasico_gestor.interfaz_persona (
    nid_interfaz_persona int auto_increment primary key,
    dni varchar(9),
    nombre varchar(50),
    primer_apellido varchar(50),
    segundo_apellido varchar(50),
    email varchar(100),
    telefono varchar(20),
    fecha_nacimiento date,
    operacion varchar(20),
    nid_persona int,
    estado varchar(20),
    lote int
);


alter table pasico_gestor.interfaz_persona add constraint fk_interfaz_persona foreign key (nid_persona) references pasico_gestor.persona(nid);
