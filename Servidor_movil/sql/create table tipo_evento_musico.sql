create table pasico_movil.tipo_evento_musico(
    nid_evento_concierto integer,
    nid_tipo_musico integer
);

alter table pasico_movil.tipo_evento_musico add constraint pk_tipo_evento_musico primary key (nid_evento_concierto, nid_tipo_musico);

alter table pasico_movil.tipo_evento_musico add constraint fk_tipo_evento_musico foreign key(nid_tipo_musico) references pasico_movil.tipo_musico(nid_tipo_musico);
alter table pasico_movil.tipo_evento_musico add constraint fk_tipo_evento_concierto foreign key(nid_evento_concierto) references pasico_movil.evento_concierto(nid_evento_concierto);

