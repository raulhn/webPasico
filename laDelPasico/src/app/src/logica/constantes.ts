
export namespace Constantes
{
    // Class for general global variables.
    export class General
    {
        /** Producción **/
      /*
       public static readonly URL_BACKED = 'https://ladelpasico.es:8443';
       public static readonly URL_FRONTED = 'https://ladelpasico.es';
       */

       /** Desarrollo **/
/*
       public static readonly URL_BACKED = 'https://80.240.127.138:8444';
       public static readonly URL_FRONTED = 'https://80.240.127.138:8081';
*/
       /** Pre-Producción */
       public static readonly URL_BACKED = 'https://80.240.127.138:8444';
       public static readonly URL_FRONTED = 'https://ladelpasico:2096';
 
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
}