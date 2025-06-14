import { Component } from '@angular/core';
import { ElementRef, ViewChild } from '@angular/core';
import { MusicosService } from 'src/app/servicios/musicos.service';
import { DataTablesOptions } from 'src/app/logica/constantes';
import Swal from 'sweetalert2';
import { OnInit } from '@angular/core';


@Component({
  selector: 'app-lista-instrumentos',
  templateUrl: './lista-instrumentos.component.html',
  styleUrl: './lista-instrumentos.component.css',
  standalone: false,
})
export class ListaInstrumentosComponent implements OnInit {

  nombreInstrumento: string = "";
  nombreEditarInstrumento: string = "";

  lista_instrumentos: any[] = [];
  instrumentoSeleccionado: any = null;
  bCargadosInstrumentos: boolean = false;
  dtOptions_Instrumentos: any = {};


  @ViewChild('instanciaRegistroInstrumento') instancia_registro_instrumento!: ElementRef;
  @ViewChild('instanciaEditarInstrumento') instancia_editar_instrumento!: ElementRef;

  constructor(private musicoService: MusicosService) { }

  click_instrumento(instrumento: any) {
  this.instrumentoSeleccionado = instrumento;
}

  refrescar_instrumentos = {
    next: (respuesta: any) => {
      const id_tabla_musicos = '#tabla_musicos';
      this.lista_instrumentos = respuesta.instrumentos;

      var datatable = $(id_tabla_musicos).DataTable();
      datatable.destroy();
      this.dtOptions_Instrumentos =
      {
       language: DataTablesOptions.spanish_datatables,
       data: this.lista_instrumentos,
       dom: 'Bfrtip',
       buttons: [{extend: 'excel', text: 'Generar Excel', className: 'btn btn-dark mb-3'}],
       columns:
       [
         {title: 'Instrumento',
          data: 'descripcion'},
        ],
          rowCallback: (row: Node, data: any[] | Object, index: number) => {
            $('td', row).off('click');
            $('td', row).on('click', () => {
              $(id_tabla_musicos + ' tr').removeClass('selected')
              $(row).addClass('selected');
              this.click_instrumento(data);
            });
            return row;
          }
      }

      $(id_tabla_musicos).DataTable(this.dtOptions_Instrumentos);

      this.bCargadosInstrumentos = true;
    },
    error: (error: any) => {
      console.error('Error al consultar los instrumentos:', error);
    }
  };

  ngOnInit(): void {
    this.musicoService.obtener_instrumentos().subscribe(this.refrescar_instrumentos);
  }


  mostrar_registro_instrumento()
  {
    Swal.fire({
      title: 'Registrar Instrumento',
      html: this.instancia_registro_instrumento.nativeElement,
      confirmButtonText: 'Registrar',
      showCancelButton: true})
      .then((result) => {
        if (result.isConfirmed) {
          this.crear_instrumento();
        }
      })
  }

  mostrar_editar_instrumento()
  {
    if (this.instrumentoSeleccionado === null) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Debe seleccionar un instrumento para editar.',
      });
      return;
    }

    this.nombreEditarInstrumento = this.instrumentoSeleccionado.descripcion;

    Swal.fire({
      title: 'Editar Instrumento',
      html: this.instancia_editar_instrumento.nativeElement,
      confirmButtonText: 'Actualizar',
      showCancelButton: true})
      .then((result) => {
        if (result.isConfirmed) {
          this.editar_instrumento();
        }
      })
  }

  peticion_registrar_instrumento =
  {
      next: (respuesta: any) => {
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'Instrumento registrado correctamente.',
        });
        this.nombreInstrumento = "";
        this.musicoService.obtener_instrumentos().subscribe(this.refrescar_instrumentos);
      },
      error: (error: any) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo registrar el instrumento. Inténtelo más tarde.',
        });
      }
  }

  crear_instrumento() {
    if (this.nombreInstrumento.trim() === "") {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'El nombre del instrumnento no puede estar vacío.',
      });
      return;
    }

    this.musicoService.registrar_instrumento(this.nombreInstrumento).subscribe(this.peticion_registrar_instrumento);
  }

  peticion_actualizar_instrumento = {
    next: (respuesta: any) => {
      Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: 'Instrumento actualizado correctamente.',
      });
      this.nombreInstrumento = "";
      this.instrumentoSeleccionado = null;
      this.musicoService.obtener_instrumentos().subscribe(this.refrescar_instrumentos);
    },
    error: (error: any) => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo actualizar el instrumento. Inténtelo más tarde.',
      });
    }
  }

  editar_instrumento() {
    if (this.instrumentoSeleccionado === null) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Debe seleccionar un instrumento para editar.',
      });
      return;
    }
    
    if (this.nombreEditarInstrumento.trim() === "") {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'El nombre del instrumento no puede estar vacío.',
      });
      return;
    }

    this.musicoService.actualizar_instrumento(this.instrumentoSeleccionado.nid, this.nombreEditarInstrumento)
      .subscribe(this.peticion_actualizar_instrumento);
  }
}


