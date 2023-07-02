create table pasico.menu (
	nid integer primary key auto_increment,
	vTitulo varchar(50),
	vEnlace varchar(150),
	padre integer
);

alter table pasico.menu add nTipo_pagina integer;


create table pasico.tipo_pagina(
	nid integer primary key auto_increment,
	vDescripcion varchar(100),
	vEnlace varchar(50)
);

alter table pasico.menu add constraint fk_tipo_pagina foreign key(nTipo_pagina) references pasicopru.tipo_pagina(nid);

alter table pasico.menu add nOrden integer;
alter table pasico.menu add bExterna integer default 0;