import { Component } from '@angular/core';
import { Persona } from 'src/app/logica/persona';
import { URL } from 'src/app/logica/constantes';
import { SociosService } from 'src/app/servicios/socios.service';
import { DataTablesOptions } from 'src/app/logica/constantes';

@Component({
  selector: 'app-lista-socios',
  templateUrl: './lista-socios.component.html',
  styleUrls: ['./lista-socios.component.css']
})
export class ListaSociosComponent {
  listaPersonas:Persona[] = [];
  enlaceFicha: string = URL.URL_FRONT_END + "/ficha_persona/";

  dtOptions: any = {}
  dtOpciones_socios: any = {};
 
  bCargado: boolean = false;
  bCargado_socios: boolean = false;

  constructor(private sociosService: SociosService)
  {
    this.dtOptions =
    {
      language: DataTablesOptions.spanish_datatables,
      dom: 'Bfrtip',
      buttons: [{extend: 'excel', text: 'Generar Excel', className: 'btn btn-dark mb-3'}]
    }

    this.dtOpciones_socios
  }


  recuperar_socios =
  {
    next : (respuesta: any) =>
    {
      if (!respuesta.error)
      {
        for (let i:number = 0; i < respuesta.socios.length; i++)
        {
          var p: Persona = new Persona();
          p.setNombre(respuesta.socios[i]['nombre']); 
          p.setPrimerApellido(respuesta.socios[i]['primer_apellido']);
          p.setSegundoApellido(respuesta.socios[i]['segundo_apellido']);
          p.setTelefono(respuesta.socios[i]['telefono']);
          p.setNid(respuesta.socios[i]['nid']);
          this.listaPersonas[i] = p;
        }
        this.bCargado = true;
      }
      console.log(this.listaPersonas)
    }
  }

  refrescar_socios =
  {
    next: (respuesta: any) =>
    {
      var datatable = $('#tabla_socios').DataTable();
      datatable.destroy();
      this.listaPersonas = respuesta.personas;

      this.dtOpciones_socios =
      {
        language: DataTablesOptions.spanish_datatables,
        data: this.listaPersonas,
        dom: 'Bfrtip',
        buttons: [{extend: 'excel', text: 'Generar Excel', className: 'btn btn-dark mb-3'}],
        columns:
        [
          {title: 'Nombre',
            data: 'nombre'
          },
          {title: 'Primer apellido',
            data: 'primer_apellido'
          },
          {title: 'Segundo apellido',
            data: 'segundo_apellido'
          },
          {title: 'Teléfono',
            data: 'telefono'
          }],
          rowCallback: (row: Node, data: any[] | Object, index: number) => {
            $('td', row).off('click');
            $('td', row).on('click', () => {
              $('#tabla_socios tr').removeClass('selected')
              $(row).addClass('selected');
            });
            return row;
            }
        }
        $('#tabla_socios').DataTable(this.dtOpciones_socios);
        this.bCargado_socios = true;
      }
  }

  ngOnInit(): void {
    this.sociosService.obtener_lista_socios().subscribe(
     this.recuperar_socios
    );
  }

  obtenerEnlaceFicha(nid: string)
  {
    return this.enlaceFicha + nid;
  }
}
