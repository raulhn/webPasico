
create table pasico_movil.tablon_anuncios_asignatura(
    nid_tablon_anuncio_asignatura integer primary key auto_increment,
    nid_tablon_anuncio integer,
    nid_asignatura integer,
    nid_curso integer
);

alter table pasico_movil.tablon_anuncios_asignatura add constraint fk_tablon_anuncios_asignatura foreign key(nid_asignatura) 
references pasico_movil.asignaturas(nid_asignatura);

alter table pasico_movil.tablon_anuncios_asignatura add constraint fk_tablon_anuncios_asignatura_tablon foreign key(nid_tablon_anuncio) 
references pasico_movil.tablon_anuncios(nid_tablon_anuncio);

alter table pasico_movil.tablon_anuncios_asignatura add constraint fk_tablon_anuncios_asignatura_curso foreign key(nid_curso) 
references pasico_movil.curso(nid_curso);