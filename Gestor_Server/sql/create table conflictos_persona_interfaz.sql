create table pasico_gestor.conflictos_persona_interfaz (
    nid_conflicto int auto_increment primary key,
    nid_persona_interfaz int,
    nombre varchar(50),
    primer_apellido varchar(50),
    segundo_apellido varchar(50),
    email varchar(100),
    telefono varchar(20),
    fecha_nacimiento date
);


alter table pasico_gestor.conflictos_persona_interfaz add constraint fk_conflicto_persona_interfaz foreign key (nid_persona_interfaz) references pasico_gestor.interfaz_persona(nid_interfaz_persona);
