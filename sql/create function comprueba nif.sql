

DELIMITER $$
CREATE OR REPLACE FUNCTION pasico_gestor.obtener_caracter_nif(input VARCHAR(255)) RETURNS VARCHAR(255) 
BEGIN
DECLARE subcadena varchar(8);
DECLARE parte_numero INT;
DECLARE digito_control INT;
set subcadena = upper(substr(input, 1, 8));
-- Tratamiento NIE X -> 0; Y -> 1; Z -> 2 --
set subcadena = replace(subcadena, 'X', '0');
set subcadena = replace(subcadena, 'Y', '1');
set subcadena = replace(subcadena, 'Z', '2');
set parte_numero = convert(subcadena, INTEGER);
set digito_control = mod(parte_numero, 23);
if digito_control = 0 then
return 'T';
elseif digito_control = 1  then return 'R';
elseif digito_control = 2  then return 'W';
elseif digito_control = 3  then return 'A';
elseif digito_control = 4  then return 'G';
elseif digito_control = 5  then return 'M';
elseif digito_control = 6  then return 'Y';
elseif digito_control = 7  then return 'F';
elseif digito_control = 8  then return 'P';
elseif digito_control = 9  then return 'D';
elseif digito_control = 10 then return 'X';
elseif digito_control = 11 then return 'B';
elseif digito_control = 12 then return 'N';
elseif digito_control = 13 then return 'J';
elseif digito_control = 14 then return 'Z';
elseif digito_control = 15 then return 'S';
elseif digito_control = 16 then return 'Q';
elseif digito_control = 17 then return 'V';
elseif digito_control = 18 then return 'H';
elseif digito_control = 19 then return 'L';
elseif digito_control = 20 then return 'C';
elseif digito_control = 21 then return 'K';
elseif digito_control = 22 then return 'E';
end if;
RETURN '';
END$$
DELIMITER ;



DELIMITER $$
CREATE FUNCTION pasico_gestor.comprueba_nif(input VARCHAR(255)) RETURNS VARCHAR(255) 
BEGIN
DECLARE caracter_control varchar(8);
declare caracter_control_input varchar(1);
set caracter_control = pasico_gestor.obtener_caracter_nif(input);
set caracter_control_input = substr(input, 9);
if caracter_control = caracter_control_input THEN
return 'S';
ELSE
return 'N';
end if;
END$$
DELIMITER ;

