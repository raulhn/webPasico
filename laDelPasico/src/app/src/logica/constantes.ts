
export namespace Constantes
{
    // Class for general global variables.
    export class General
    {
        /** Producción **/
      /*
       public static readonly URL_BACKED = 'https://ladelpasico.es/api';
       public static readonly URL_FRONTED = 'https://ladelpasico.es';
*/
        /** Prueba **/

        public static readonly URL_BACKED = 'https://pasicopru.com/api';
        public static readonly URL_FRONTED = 'https://pasicopru.com';
     


       /** Desarrollo **/
/*
       public static readonly URL_BACKED = 'https://80.240.127.138:8444';
       public static readonly URL_FRONTED = 'https://80.240.127.138:8081';
*/
       /** Pre-Producción */
       //public static readonly URL_BACKED = 'https://80.240.127.138:8444';
       //public static readonly URL_FRONTED = 'https://ladelpasico:2096';
 
    };

    export class TipoComponente
    {
        public static readonly TEXTO = "1";
        public static readonly IMAGEN = "2";
        public static readonly COMPONENTES = "3";
        public static readonly VIDEO = "4";
        public static readonly GALERIA = "5";
        public static readonly PAGINAS = "6";
        public static readonly CARUSEL = "7";
        public static readonly BLOG = "8";
    };

    export class TipoAsociacion
    {
        public static readonly pagina = "1";
        public static readonly componente = "2";
    }

    export class DataTablesOptions
    {
    //https://stackoverflow.com/questions/36849610/datatables-change-interface-language
    //ng add angular-datables
    //Eliminar angular-datatables e instalar versión anterior
    //npm install angular-datatables@15.0.0
    public static spanish_datatables = {
        processing: "Procesando...",
        search: "Buscar:",
        lengthMenu: "Mostrar _MENU_ elementos",
        info: "Mostrando desde _START_ al _END_ de _TOTAL_ elementos",
        infoEmpty: "Mostrando ningún elemento.",
        infoFiltered: "(filtrado _MAX_ elementos total)",
        infoPostFix: "",
        loadingRecords: "Cargando registros...",
        zeroRecords: "No se encontraron registros",
        emptyTable: "No hay datos disponibles en la tabla",
        paginate: {
        first: "Primero",
        previous: "Anterior",
        next: "Siguiente",
        last: "Último"
        },
        aria: {
        sortAscending: ": Activar para ordenar la tabla en orden ascendente",
        sortDescending: ": Activar para ordenar la tabla en orden descendente"
        }
    }
    }
}

