create table pasico_movil.grupos (
  nid_grupo int not null auto_increment,
  nombre varchar(255) not null,
  fecha_creacion datetime default current_timestamp,
  fecha_actualizacion datetime default current_timestamp on update current_timestamp,
  nid_profesor integer not null,
  nid_asignatura integer not null,
  borrado varchar(1) default 'N',
  primary key (nid_grupo)
);


alter table pasico_movil.grupos add constraint fk_grupos_porfesor foreign key(nid_profesor) references pasico_movil.persona(nid_persona);
alter table pasico_movil.grupos add constraint fk_grupos_asignatura foreign key(nid_asignatura) references pasico_movil.asignatura(nid_asignatura);

create table pasico_movil.grupos_matricula_asignatura(
  nid_grupo int  not null,
  nid_matricula_asignatura int not null,
  fecha_creacion datetime default current_timestamp,
  fecha_actualizacion datetime default current_timestamp on update current_timestamp,
  primary key (nid_grupo, nid_matricula_asignatura)
);

alter table pasico_movil.grupos_matricula_asignatura add constraint fk_grupos_matricula_asignatura_grupos foreign key (nid_grupo) references pasico_movil.grupos(nid_grupo);
alter table pasico_movil.grupos_matricula_asignatura add constraint fk_grupos_matricula_asignatura_matricula_asignatura foreign key (nid_matricula_asignatura) references pasico_movil.matricula_asignatura(nid_matricula_asignatura);

