create table pasico_gestor.interfaz_usuario (
    nid_interfaz_usuario int auto_increment primary key,
    dni varchar(9),
    nombre varchar(50),
    primer_apellido varchar(50),
    segundo_apellido varchar(50),
    email varchar(100),
    telefono varchar(20),
    fecha_nacimiento date,
    operacion varchar2(20),
    nid_persona int,
    estado varchar(20)
);


alter table pasico_gestor.interfaz_usuario add constraint fk_interfaz_usuario_persona foreign key (nid_persona) references pasico_gestor.persona(nid);
