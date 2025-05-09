CREATE TABLE `socios` (
  `nid_persona` int(11) NOT NULL,
  `fecha_alta` date DEFAULT NULL,
  `fecha_baja` date DEFAULT NULL,
  `num_socio` int(11) DEFAULT NULL,
  `fecha_actualizacion` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`nid_persona`),
  UNIQUE KEY `num_socio` (`num_socio`),
  CONSTRAINT `socios_ibfk_1` FOREIGN KEY (`nid_persona`) REFERENCES `persona` (`nid`)
);