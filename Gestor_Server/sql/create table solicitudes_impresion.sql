create table pasico_gestor.solicitudes_impresion(
  nid_solicitud_impresion integer primary key,
  nid_usuario integer not null,
  estado varchar(30) not null,
  idempotency_key varchar(64) not null,
  opciones json not null,
  trabajo_cups varchar(100),
  intentos integer not null default 0,
  mensaje_error varchar(500),
  fecha_solicitud datetime not null,
  fecha_actualizacion datetime not null default current_timestamp on update current_timestamp,
  unique key uk_solicitud_impresion_idempotency (idempotency_key),
  key idx_solicitud_impresion_estado (estado, fecha_actualizacion)
);

create table pasico_gestor.ejecuciones_impresion(
  nid_ejecucion_impresion integer auto_increment primary key,
  nid_solicitud_impresion integer not null,
  estado varchar(30) not null,
  trabajo_cups varchar(100),
  mensaje_error varchar(500),
  fecha_creacion datetime not null default current_timestamp,
  key idx_ejecucion_impresion_solicitud (nid_solicitud_impresion),
  constraint fk_ejecucion_impresion_solicitud
    foreign key (nid_solicitud_impresion)
    references pasico_gestor.solicitudes_impresion(nid_solicitud_impresion)
);
