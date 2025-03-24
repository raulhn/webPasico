import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DataTablesOptions, URL } from 'src/app/logica/constantes';
import { MusicosService } from 'src/app/servicios/musicos.service';
import { PersonasService } from 'src/app/servicios/personas.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-registro-musico',
    templateUrl: './registro-musico.component.html',
    styleUrls: ['./registro-musico.component.css'],
    standalone: false
})
export class RegistroMusicoComponent implements OnInit{

  @ViewChild('instancia_registrar_musico') instancia_registrar_musico!: ElementRef;

  enlaceFicha: string = URL.URL_FRONT_END + "/ficha_persona/";

  lista_personas: any;
  lista_instrumentos: any;
  lista_instrumentos_filtro: any;
  lista_tipo_musicos: any;

  nid_persona_seleccionada: string = "";
  nid_instrumento: string = "";
  nid_tipo_musico: string = "";

  nid_instrumento_filtro: string = "0";

  bCargadosMusicos: boolean = false;
  bCargadasPersonas: boolean = false;

  dtOptions_musicos: any= {}

  musico_seleccionado: any;


  click_musico(persona_marcada: any)
  {
    this.musico_seleccionado = persona_marcada;
  }


  refrescar_personas = 
  {
    next: (respuesta: any) =>
    {
      
      var datatable = $('#tabla_musicos').DataTable();
      datatable.destroy();
      this.lista_personas = respuesta.personas;

      this.dtOptions_musicos =
      {
        language: DataTablesOptions.spanish_datatables,
        data: this.lista_personas,
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
          },
          {title: 'Teléfono',
            data: 'telefono'
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

  constructor(private personasServices: PersonasService, private musicosService: MusicosService)
  {}

  obtener_personas =
  {
    next: (respuesta: any) =>
    {
      this.lista_personas = respuesta.personas;
      this.bCargadasPersonas = true;
    }
  }

  obtener_instrumentos =
  {
    next: (respuesta: any) =>
    {
      this.lista_instrumentos = respuesta.instrumentos;
    }
  }

  obtener_instrumentos_filtro=
  {
    next: (respuesta: any) =>
    {
      this.lista_instrumentos_filtro = respuesta.instrumentos;
    }
  }

  obtener_tipo_musicos = 
  {
    next: (respuesta: any) =>
    {
      this.lista_tipo_musicos = respuesta.tipo_musicos;
    }
  }

  ngOnInit(): void {
    this.cambia_seleccion_musico();
    this.musicosService.obtener_instrumentos().subscribe(this.obtener_instrumentos);
    this.musicosService.obtener_instrumentos_filtro().subscribe(this.obtener_instrumentos_filtro);
    this.musicosService.obtener_tipo_musicos().subscribe(this.obtener_tipo_musicos);
  }

  comparePersona(item: any, selected: any) {
    return item['nid'] == selected;
  }

  compareInstrumento(item: any, selected: any) {
    return item['nid'] == selected;
  }

  compareTipoInstrumento(item: any, selected: any) {
    return item['nid'] == selected;
  }

  peticion_registrar_musico = 
  {
    next: (respuesta: any) =>
      {
        Swal.fire({
          icon: 'success',
          title: 'Registro correcto',
          text: 'Se ha registrado correctamente'
        });
        this.cambia_seleccion_musico();
      },
      error: (respuesta: any) =>
      {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Se ha producido un error',
        })
      }
  }

  add_musico()
  {
    this.personasServices.obtener_lista_personas().subscribe(this.obtener_personas);
    Swal.fire({
      title: 'Registrar Músico',
      html: this.instancia_registrar_musico.nativeElement,
      confirmButtonText: 'Registrar',
      showCancelButton: true
    }).then(
      (results: any) =>
        {
        if(results.isConfirmed)
        {
          this.musicosService.registrar_musico(this.nid_instrumento, this.nid_persona_seleccionada, this.nid_tipo_musico).subscribe(this.peticion_registrar_musico);
        }
        this.bCargadasPersonas = false;
      }
    )
  }

  obtenerUrlFicha()
  {
    return this.enlaceFicha + this.musico_seleccionado.nid;
  }

  cambia_seleccion_musico()
  {
    if(this.nid_instrumento_filtro == "0")
    {
      this.musicosService.obtener_musicos().subscribe(this.refrescar_personas);
    }
    else
    {
      this.musicosService.obtener_personas_instrumento(this.nid_instrumento_filtro).subscribe(this.refrescar_personas);
    }
  }
}
