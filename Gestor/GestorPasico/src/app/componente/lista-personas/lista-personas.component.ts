import { Component } from '@angular/core';
import { PersonasService } from 'src/app/servicios/personas.service';
import { Persona } from 'src/app/logica/persona';
import { URL } from 'src/app/logica/constantes';
import { DataTablesOptions } from 'src/app/logica/constantes';
import { faLanguage } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-lista-personas',
  templateUrl: './lista-personas.component.html',
  styleUrls: ['./lista-personas.component.css']
})
export class ListaPersonasComponent {

  listaPersonas:Persona[] = [];
  enlaceFicha: string = URL.URL_FRONT_END + "/ficha_persona/";

  bCargado: boolean = false;
  bCargadoPersonas: boolean = false;

  dtOptions: any = {}
 
  dtOptions_personas: any= {}

  lista_personas: any[] = [];

  tipo: string = "1";

  persona_seleccionada: any;

  constructor(private personasService:PersonasService)
  {
    this.dtOptions =
    {
      language: DataTablesOptions.spanish_datatables,
      dom: 'Bfrtip',
      buttons: [{extend: 'excel', text: 'Generar Excel', className: 'btn btn-dark mb-3'}]
    }
  }

  click_persona(persona_marcada: any)
  {
    this.persona_seleccionada = persona_marcada;
  }

  refrescar_personas = 
  {
    next: (respuesta: any) =>
    {
      var datatable = $('#tabla_personas').DataTable();
      datatable.destroy();
      this.lista_personas = respuesta.personas;

      this.dtOptions_personas =
      {
        language: DataTablesOptions.spanish_datatables,
        data: this.lista_personas,
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
              this.click_persona(data);
              $('#tabla_personas tr').removeClass('selected')
              $(row).addClass('selected');
            });
            return row;
            }
        }
        $('#tabla_personas').DataTable(this.dtOptions_personas);
        this.bCargadoPersonas = true;
      }
      
  }

  ngOnInit(): void {
    this.personasService.obtener_personas(this.tipo).subscribe(this.refrescar_personas);

    this.personasService.obtener_lista_personas().subscribe(
      (resultado:any) =>
      {
        if (!resultado.error)
        {
          for (let i:number = 0; i < resultado.personas.length; i++)
          {
            var p: Persona = new Persona();
            p.setNombre(resultado.personas[i]['nombre']); 
            p.setPrimerApellido(resultado.personas[i]['primer_apellido']);
            p.setSegundoApellido(resultado.personas[i]['segundo_apellido']);
            p.setTelefono(resultado.personas[i]['telefono']);
            p.setNid(resultado.personas[i]['nid']);
            this.listaPersonas[i] = p;
          }

          this.bCargado = true;
        }
        console.log(this.listaPersonas)
      }
    )
  }

  cambia_seleccion()
  {
    this.personasService.obtener_personas(this.tipo).subscribe(this.refrescar_personas);
  }

  obtenerEnlaceFicha(nid: string)
  {
    return this.enlaceFicha + nid;
  }

  obtenerUrlFicha()
  {
    return this.enlaceFicha + this.persona_seleccionada.nid;
  }
}
