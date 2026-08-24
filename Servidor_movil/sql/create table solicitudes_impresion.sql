create table pasico_movil.configuracion_cuota_impresion(
  nid_configuracion_cuota_impresion integer primary key auto_increment,
  max_solicitudes_pendientes integer not null default 3,
  max_solicitudes_ventana integer not null default 10,
  ventana_dias integer not null default 30,
  max_archivos_por_solicitud integer not null default 10,
  escala_minima integer not null default 25,
  escala_maxima integer not null default 200,
  creado_por_usuario integer,
  actualizado_por_usuario integer,
  fecha_creacion datetime not null default current_timestamp,
  fecha_actualizacion datetime not null default current_timestamp on update current_timestamp,
  key idx_configuracion_cuota_actualizacion (fecha_actualizacion),
  constraint fk_configuracion_cuota_creador foreign key (creado_por_usuario)
    references pasico_movil.usuarios(nid_usuario),
  constraint fk_configuracion_cuota_actualizador foreign key (actualizado_por_usuario)
    references pasico_movil.usuarios(nid_usuario)
);

create table pasico_movil.solicitudes_impresion(
  nid_solicitud_impresion integer primary key auto_increment,
  nid_usuario integer not null,
  nid_partitura integer not null,
  estado varchar(30) not null,
  idempotency_key varchar(64) not null,
  opciones json not null,
  origen_drive_tipo varchar(20) not null,
  origen_drive_id varchar(100) not null,
  trabajo_cups varchar(100),
  intentos integer not null default 0,
  mensaje_error varchar(500),
  fecha_solicitud datetime not null default current_timestamp,
  fecha_reclamacion datetime,
  fecha_cancelacion datetime,
  fecha_actualizacion datetime not null default current_timestamp on update current_timestamp,
  unique key uk_solicitud_impresion_idempotency_usuario (nid_usuario, idempotency_key),
  key idx_solicitud_impresion_estado (estado, fecha_actualizacion),
  key idx_solicitud_impresion_usuario (nid_usuario, fecha_solicitud),
  key idx_solicitud_impresion_partitura (nid_partitura),
  constraint fk_solicitud_impresion_usuario foreign key (nid_usuario)
    references pasico_movil.usuarios(nid_usuario),
  constraint fk_solicitud_impresion_partitura foreign key (nid_partitura)
    references pasico_movil.partituras(nid_partitura)
);

create table pasico_movil.solicitud_impresion_archivos(
  nid_solicitud_impresion_archivo integer primary key auto_increment,
  nid_solicitud_impresion integer not null,
  nid_partitura integer not null,
  drive_file_id varchar(100) not null,
  drive_parent_id varchar(100),
  nombre_archivo varchar(255) not null,
  mime_type varchar(120),
  size_bytes bigint,
  ruta_local varchar(500),
  orden integer not null default 1,
  fecha_creacion datetime not null default current_timestamp,
  fecha_descarga datetime,
  unique key uk_solicitud_archivo_drive (nid_solicitud_impresion, drive_file_id),
  key idx_solicitud_archivos_solicitud (nid_solicitud_impresion, orden),
  key idx_solicitud_archivos_partitura (nid_partitura),
  constraint fk_solicitud_archivo_solicitud foreign key (nid_solicitud_impresion)
    references pasico_movil.solicitudes_impresion(nid_solicitud_impresion),
  constraint fk_solicitud_archivo_partitura foreign key (nid_partitura)
    references pasico_movil.partituras(nid_partitura)
);

create table pasico_movil.solicitud_impresion_estado_auditoria(
  nid_solicitud_impresion_estado integer primary key auto_increment,
  nid_solicitud_impresion integer not null,
  estado_anterior varchar(30),
  estado_nuevo varchar(30) not null,
  detalle varchar(500),
  trabajo_cups varchar(100),
  tipo_actor varchar(20) not null,
  nid_usuario_actor integer,
  referencia_actor varchar(120),
  fecha_estado datetime not null default current_timestamp,
  key idx_solicitud_auditoria_solicitud (nid_solicitud_impresion, fecha_estado),
  key idx_solicitud_auditoria_actor (nid_usuario_actor),
  constraint fk_solicitud_estado_solicitud foreign key (nid_solicitud_impresion)
    references pasico_movil.solicitudes_impresion(nid_solicitud_impresion),
  constraint fk_solicitud_estado_usuario foreign key (nid_usuario_actor)
    references pasico_movil.usuarios(nid_usuario)
);
