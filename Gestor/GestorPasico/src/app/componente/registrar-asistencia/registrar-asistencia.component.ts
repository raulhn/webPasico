import { Component, OnInit } from '@angular/core';
import { DataTablesOptions } from 'src/app/logica/constantes';
import { MusicosService } from 'src/app/servicios/musicos.service';

@Component({
    selector: 'app-registrar-asistencia',
    templateUrl: './registrar-asistencia.component.html',
    styleUrls: ['./registrar-asistencia.component.css'],
    standalone: false
})
export class RegistrarAsistenciaComponent implements OnInit{

  lista_musicos = {};
  lista_musicos_seleccionados = {};
  
  bCargadosMusicos: boolean = false;
  musico_seleccionado: string ="";
  musico_seleccionados_seleccionado: string = "";

  bCargadosMusicos_seleccionados :boolean = false;

  dtOptions_musicos: any= {}
  dtOptions_musicos_seleccionados: any= {}

  constructor(private musicoService: MusicosService)
  {

  }


  click_musico(persona_marcada: any)
  {
    this.musico_seleccionado = persona_marcada;
  }

  obtener_musicos = 
  {
    next: (respuesta: any) =>
    {
      this.lista_musicos = respuesta.personas;

      this.dtOptions_musicos =
      {
        language: DataTablesOptions.spanish_datatables,
        data: this.lista_musicos,
        dom: 'Bfrtip',
        buttons: [{extend: 'excel', text: 'Generar Excel', className: 'btn btn-dark mb-3'}],
        columns:
        [
          {title: 'DNI',
          data: 'nif'
          },
          {title: 'Nombre',
            data: 'nombre'
          },
          {title: 'Primer apellido',
            data: 'primer_apellido'
          },
          {title: 'Segundo apellido',
            data: 'segundo_apellido'
          }],
          rowCallback: (row: Node, data: any[] | Object, index: number) => {
            $('td', row).off('click');
            $('td', row).on('click', () => {
              this.click_musico(data);
              $('#tabla_musicos tr').removeClass('selected')
              $(row).addClass('selected');
            });
            return row;
            }
        }
        $('#tabla_musicos').DataTable(this.dtOptions_musicos);

      this.bCargadosMusicos = true;
    }
  }

  ngOnInit(): void {
    this.musicoService.obtener_musicos().subscribe(this.obtener_musicos);
  }

  add_asistente()
  {
  }

  delete_asistente()
  {

  }
}
