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
  @ViewChild('instancia_baja_musico') instancia_baja_musico!: ElementRef;

  enlaceFicha: string = URL.URL_FRONT_END + "/ficha_persona/";

  lista_personas: any;
  lista_instrumentos: any;
  lista_instrumentos_filtro: any;
  lista_tipo_musicos: any;
  lista_tipo_musicos_filtro: any;

  nid_persona_seleccionada: string = "";
  nid_instrumento: string = "0";
  nid_tipo_musico: string = "0";

  nid_instrumento_filtro: string = "0";

  bCargadosMusicos: boolean = false;
  bCargadasPersonas: boolean = false;
  bCargadosTiposMusicos: boolean = false;
  bMostrarBajas: boolean = false;

  tipos_musicos: any = {};
  agrupar_por_tipo_musico: boolean = false;

  dtOptions_musicos: any= {}

  musico_seleccionado: any;

  fecha_baja: string = "";


  click_musico(persona_marcada: any)
  {
    this.musico_seleccionado = persona_marcada;
  }


  refrescar_tabla(lista_musicos: any[])
  {
     var datatable = $('#tabla_musicos').DataTable();
      datatable.destroy();

      lista_musicos = lista_musicos.sort((a: any, b: any) => {
        if(a.nid < b.nid) {
          return -1;
        }
        if(a.nid > b.nid) {
          return 1;
        }
        return 0;
      });

      this.dtOptions_musicos =
      {
        language: DataTablesOptions.spanish_datatables,
        data: lista_musicos,
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
          },
          {title: 'Email',
            data: 'correo_electronico'
          },
          {title: 'Instrumento',
            data: 'instrumento'
          },
          {title: 'Banda',
            data: 'tipo_musico'
          },
          {title: 'Fecha de baja',
            data: 'fecha_baja_local'
          }

        ],
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

  refrescar_personas = 
  {
    next:  (respuesta: any) =>
    {
    
      this.lista_personas =  respuesta.personas.map((persona: any) => {
        const fecha_baja = persona.fecha_baja ? new Date(persona.fecha_baja) : null;
        const fecha_baja_local = fecha_baja ? fecha_baja.toLocaleDateString() : '';
        return {...persona, fecha_baja_local: fecha_baja_local};});

      this.bCargadasPersonas = true;
      if(this.bCargadosTiposMusicos)
      {
       this.cambia_seleccion_musico();
      }

    }
      
  }

  constructor(private personasServices: PersonasService, private musicosService: MusicosService)
  {}



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
      this.lista_tipo_musicos_filtro = [...respuesta.tipo_musicos];
      this.lista_tipo_musicos_filtro.push({descripcion: "Todos", nid_tipo_musico: "0"});

      for  (let tipo_musico of this.lista_tipo_musicos) {
        this.tipos_musicos[tipo_musico.nid_tipo_musico] = true;
      }

      if(this.bCargadasPersonas)
      {
        this.cambia_seleccion_musico();
      }
      this.bCargadosTiposMusicos = true;
    }
  }

  ngOnInit(): void {
    this.musicosService.obtener_musicos().subscribe(this.refrescar_personas);
    this.musicosService.obtener_tipo_musicos().subscribe(this.obtener_tipo_musicos);
    this.musicosService.obtener_instrumentos().subscribe(this.obtener_instrumentos);
    this.musicosService.obtener_instrumentos_filtro().subscribe(this.obtener_instrumentos_filtro);
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
        this.musicosService.obtener_musicos().subscribe(this.refrescar_personas);
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
    this.personasServices.obtener_lista_personas().subscribe(this.refrescar_personas);
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

    let lista_musicos = this.lista_personas.filter((musico: any) => {
      if(this.nid_instrumento_filtro == "0") {return true;}
      else {return musico.nid_instrumento == this.nid_instrumento_filtro;}});


    let lista_musicos_por_tipo = lista_musicos.filter((musico: any) => {
      return this.tipos_musicos[musico.nid_tipo_musico]
     });

       if(!this.bMostrarBajas)
      {
        lista_musicos_por_tipo = lista_musicos_por_tipo.filter((musico: any) => {
          return musico.fecha_baja_local == null || musico.fecha_baja_local == ""  || musico.fecha_baja_local == "0000-00-00";
        });
      }

    if(this.agrupar_por_tipo_musico)
    {
      let conjunto: { [key: string]: any } = {};

      for (let musico_por_tipo of lista_musicos_por_tipo) {
        conjunto[musico_por_tipo.nid] = {"nif": musico_por_tipo.nif, 
          "nombre": musico_por_tipo.nombre, 
          "primer_apellido": musico_por_tipo.primer_apellido, 
          "segundo_apellido": musico_por_tipo.segundo_apellido,
          "telefono": musico_por_tipo.telefono, 
          "correo_electronico": musico_por_tipo.correo_electronico,
          "instrumento": "", "tipo_musico":"", "fecha_baja_local": ""};
      }
     
      let array_conjunto = Object.values(conjunto);


      this.refrescar_tabla(array_conjunto);

    }
    else{
    this.refrescar_tabla(lista_musicos_por_tipo);}
    
  }

  dar_baja_musico()
  {
    Swal.fire({
      title: '¿Está seguro de dar de baja al músico?',
      html: this.instancia_baja_musico.nativeElement,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.musicosService.baja_musico(this.musico_seleccionado.nid, this.musico_seleccionado.nid_instrumento, 
          this.musico_seleccionado.nid_tipo_musico, this.fecha_baja).subscribe(
          {
            next: (respuesta: any) =>
            {
              this.musicosService.obtener_musicos().subscribe(this.refrescar_personas);
              Swal.fire(
                'Baja correcta',
                'El músico ha sido dado de baja correctamente',
                'success'
              )

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
        )
      }
    })
  }

}
