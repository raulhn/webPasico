create table pasico_movil.musicos(
    nid_persona integer,
    nid_tipo_musico integer,
    nid_instrumento integer,
    fecha_alta date,
    fecha_baja date,
    fecha_actualizacion datetime default current_timestamp
);

alter table pasico_movil.musicos
    add constraint pk_musicos primary key (nid_persona, nid_tipo_musico, nid_instrumento);

alter table pasico_movil.musicos add constraint fk_musicos_personas foreign key (nid_persona) references pasico_movil.persona(nid_persona);
