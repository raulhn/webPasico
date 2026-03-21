create table pasico_gestor.interfaz_conflictos_persona (
    nid_conflicto int auto_increment primary key,
    nid_interfaz_persona int,
    nif varchar(20),
    nombre varchar(50),
    primer_apellido varchar(50),
    segundo_apellido varchar(50),
    email varchar(100),
    telefono varchar(20),
    fecha_nacimiento date,
    nid_persona int
);


alter table pasico_gestor.interfaz_conflictos_persona add constraint fk_conflicto_persona_interfaz foreign key (nid_interfaz_persona) references pasico_gestor.interfaz_persona(nid_interfaz_persona);
