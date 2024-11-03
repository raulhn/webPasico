export class URL
{
    public static readonly URL_SERVICIO = "https://gestorpasico.com/api";
    public static readonly URL_FRONT_END= "https://gestorpasico.com";
  
    public static readonly URL_WEB = "https://ladelpasico.es:8443"
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