create table pasico_gestor.interfaz_socio(
  nid_interfaz_socio integer auto_increment primary key,
  nid_interfaz_persona integer, 
  fecha_alta date,
  fecha_baja date,
  operacion varchar(50),
  estado varchar(50),
  lote integer,
  fecha_creacion datetime default current_timestamp
);


alter table pasico_gestor.interfaz_socio add constraint fk_interfaz_socio foreign key(nid_interfaz_persona) references pasico_gestor.interfaz_persona(nid_interfaz_persona);


