DELIMITER $$
CREATE OR REPLACE FUNCTION pasico_gestor.comprueba_iban(input VARCHAR(255)) RETURNS VARCHAR(255) 
BEGIN
DECLARE digito_control varchar(3);
declare digito_control_input varchar(2);
declare numero_iban float;
declare resto_iban integer;
declare multiple_iban integer;
set digito_control_input = substr(input, 3, 2);
set numero_iban = convert(concat(substr(input, 5), '142800'), FLOAT);
set resto_iban = numero_iban MOD 97;
return resto_iban;
set multiple_iban = round((resto_iban/100) * 97);
return multiple_iban;
set digito_control = 98 - multiple_iban;
return digito_control;
if digito_control = digito_control_input THEN
return 'S';
ELSE
return 'N';
end if;
END$$
DELIMITER ;


