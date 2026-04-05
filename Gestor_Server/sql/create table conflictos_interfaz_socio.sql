create table pasico_gestor.conflictos_interfaz_socio(
  nid_conflicto_interfaz_socio integer auto_increment primary key,
  nid_interfaz_socio integer,
  nid_persona integer,
  fecha_alta date,
  fecha_baja date
);


alter table pasico_gestor.conflictos_interfaz_socio add constraint fk_interfaz_socio_conflicto foreign key(nid_interfaz_socio) references pasico_gestor.interfaz_socio(nid_interfaz_socio);
alter table pasico_gestor.conflictos_interfaz_socio add constraint fk_conflicto_socio_persona foreign key(nid_persona) references pasico_gestor.persona(nid);
