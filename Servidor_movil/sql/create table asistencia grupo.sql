create table pasico_movil.asistencia_grupo (
  nid_asistencia_grupo int not null auto_increment,
  nid_grupo int not null,
  nid_matricula_asignatura int not null,
  fecha date not null,
  falta varchar(1) not null default 'N',
  justificada varchar(1) not null default 'N',
  causa varchar(500) not null default '',
  fecha_creacion datetime default current_timestamp,
  fecha_actualizacion datetime default current_timestamp on update current_timestamp,
  primary key (nid_asistencia_grupo),
  unique key uq_asistencia_grupo_alumno_fecha (
    nid_grupo,
    nid_matricula_asignatura,
    fecha
  ),
  constraint fk_asistencia_grupo
    foreign key (nid_grupo) references pasico_movil.grupos(nid_grupo),
  constraint fk_asistencia_grupo_matricula_asignatura
    foreign key (nid_matricula_asignatura)
    references pasico_movil.matricula_asignatura(nid_matricula_asignatura)
);
