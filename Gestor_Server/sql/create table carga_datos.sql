create table pasico_gestor.carga_datos (
    nid_carga_datos int not null auto_increment,
    dni varchar(20),
    nombre varchar(50),
    primer_apellido varchar(50),
    segundo_apellido varchar(50),
    email varchar(100),
    telefono varchar(20),
    fecha_nacimiento varchar(30),
    nid_interfaz_persona int,
    dni_padre_madre varchar(20),
    nombre_padre_madre varchar(100),
    primer_apellido_padre_madre varchar(50),
    segundo_apellido_padre_madre varchar(50),
    fecha_nacimiento_padre_madre varchar(30),
    nid_interfaz_persona_padre_madre int,
    dni_socio varchar(20),
    nombre_socio varchar(100),
    primer_apellido_socio varchar(50),
    segundo_apellido_socio varchar(50),
    email_socio varchar(300),
    telefono_socio varchar(30),
    fecha_nacimiento_socio varchar(30),
    nid_interfaz_persona_socio int,
    fecha_alta_socio varchar(30),
    fecha_baja_socio varchar(30),
    iban varchar(34),
    lenguaje_musical varchar(50),
    instrumento1 varchar(50),
    instrumento2 varchar(50),
    instrumento3 varchar(50),
    instrumento4 varchar(50),
    instrumento5 varchar(50),
    lote int,
    fecha_creacion datetime default current_timestamp,
    primary key (nid_carga_datos)
);


alter table pasico_gestor.carga_datos add constraint fk_carga_datos_interfaz_persona foreign key (nid_interfaz_persona) references pasico_gestor.interfaz_persona(nid_interfaz_persona);
alter table pasico_gestor.carga_datos add constraint fk_carga_datos_interfaz_persona_padre_madre foreign key (nid_interfaz_persona_padre_madre) references pasico_gestor.interfaz_persona(nid_interfaz_persona);
alter table pasico_gestor.carga_datos add constraint fk_carga_datos_interfaz_persona_socio foreign key (nid_interfaz_persona_socio) references pasico_gestor.interfaz_persona(nid_interfaz_persona);

