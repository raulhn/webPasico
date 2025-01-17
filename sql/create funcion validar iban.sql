DELIMITER $$
CREATE OR REPLACE FUNCTION pasico_gestor.comprueba_iban(input VARCHAR(255)) RETURNS VARCHAR(255) 
BEGIN
DECLARE digito_control varchar(3);
declare digito_control_input varchar(2);
declare numero_iban decimal(30);
declare resto_iban integer;
declare multiple_iban integer;
set digito_control_input = substr(replace(input, ' ', ''), 3, 2);
set numero_iban = convert(concat(substr(replace(input, ' ', ''), 5), '142800'), decimal(30));
set resto_iban = numero_iban mod 97;
set digito_control = 98 - resto_iban;
if digito_control < 10 then
	set digito_control = concat('0', digito_control);
end if;
if digito_control = digito_control_input THEN
return 'S';
ELSE
return 'N';
end if;
END$$
DELIMITER ;



ES04 2084 3249 3511 7360 9791