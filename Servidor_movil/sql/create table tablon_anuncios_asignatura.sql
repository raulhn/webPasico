
create table pasico_movil.tablon_anuncios_asignatura(
    nid_tablon_anuncio_asignatura integer primary key auto_increment,
    nid_tablon_anuncio integer,
    nid_asignatura integer
);

alter table pasico_movil.tablon_anuncios_asignatura add constraint fk_tablon_anuncios_asignatura foreign key(nid_asignatura) 
references pasico_movil.asignatura(nid_asignatura);

alter table pasico_movil.tablon_anuncios_asignatura add constraint fk_tablon_anuncios_asignatura_tablon foreign key(nid_tablon_anucion) 
references pasico_movil.tablon_anucios(nid_tablon_anuncio);