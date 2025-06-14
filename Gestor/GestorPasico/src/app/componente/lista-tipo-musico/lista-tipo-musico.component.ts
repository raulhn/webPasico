import { Component, ViewChild, ElementRef } from '@angular/core';
import { MusicosService } from 'src/app/servicios/musicos.service';
import { OnInit } from '@angular/core';
import { DataTablesOptions } from 'src/app/logica/constantes';
import 'datatables.net-plugins/filtering/type-based/accent-neutralise.mjs';
import Swal from 'sweetalert2';
import { DataTablesModule } from 'angular-datatables';
import { MenuComponent } from '../menu/menu.component';


@Component({
  selector: 'app-lista-tipo-musico',
  templateUrl: './lista-tipo-musico.component.html',
  styleUrl: './lista-tipo-musico.component.css',
  standalone: false,
})




export class ListaTipoMusicoComponent implements OnInit {

  bCargadosTipoMusicos: boolean = false;
  dtOptions_Musicos: any= {};

  nombreTipoMusico: string = "";
  nombreEditarTipoMusico: string = "";

  constructor(private musicoService: MusicosService) { }

  lista_tipo_musicos: any[] = [];

  tipoMusicoSeleccionado: any = null;



  @ViewChild('instanciaRegistroTipoMusico') instancia_registro_tipo_musico!: ElementRef;
  @ViewChild('instanciaEditarTipoMusico') instancia_editar_tipo_musico!: ElementRef;


  click_tipo_musico(tipo_musico: any) {
  this.tipoMusicoSeleccionado = tipo_musico;
}

  refrescar_tipo_musicos = {
    next: (respuesta: any) => {
      const id_tabla_musicos = '#tabla_musicos';
      this.lista_tipo_musicos = respuesta.tipo_musicos;

      var datatable = $(id_tabla_musicos).DataTable();
      datatable.destroy();
      this.dtOptions_Musicos =
      {
       language: DataTablesOptions.spanish_datatables,
       data: this.lista_tipo_musicos,
       dom: 'Bfrtip',
       buttons: [{extend: 'excel', text: 'Generar Excel', className: 'btn btn-dark mb-3'}],
       columns:
       [
         {title: 'Tipo Musico',
          data: 'descripcion'},
        ],
          rowCallback: (row: Node, data: any[] | Object, index: number) => {
            $('td', row).off('click');
            $('td', row).on('click', () => {
              $(id_tabla_musicos + ' tr').removeClass('selected')
              $(row).addClass('selected');
              this.click_tipo_musico(data);
            });
            return row;
          }
      }

      $(id_tabla_musicos).DataTable(this.dtOptions_Musicos);

      this.bCargadosTipoMusicos = true;
    },
    error: (error: any) => {
      console.error('Error fetching tipo musicos:', error);
    }
  };

  ngOnInit(): void {
    this.musicoService.obtener_tipo_musicos().subscribe(this.refrescar_tipo_musicos);
  }


  mostrar_registro_tipo_musico()
  {
    Swal.fire({
      title: 'Registrar Tipo de Músico',
      html: this.instancia_registro_tipo_musico.nativeElement,
      confirmButtonText: 'Registrar',
      showCancelButton: true})
      .then((result) => {
        if (result.isConfirmed) {
          this.crear_tipo_musico();
        }
      })
  }

  mostrar_editar_tipo_musico()
  {
    if (this.tipoMusicoSeleccionado === null) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Debe seleccionar un tipo de músico para editar.',
      });
      return;
    }

    this.nombreEditarTipoMusico = this.tipoMusicoSeleccionado.descripcion;

    Swal.fire({
      title: 'Editar Tipo de Músico',
      html: this.instancia_editar_tipo_musico.nativeElement,
      confirmButtonText: 'Actualizar',
      showCancelButton: true})
      .then((result) => {
        if (result.isConfirmed) {
          this.editar_tipo_musico();
        }
      })
  }

  peticion_registrar_tipo_musico =
  {
      next: (respuesta: any) => {
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'Tipo de músico registrado correctamente.',
        });
        this.nombreTipoMusico = "";
        this.musicoService.obtener_tipo_musicos().subscribe(this.refrescar_tipo_musicos);
      },
      error: (error: any) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo registrar el tipo de músico. Inténtelo más tarde.',
        });
      }
  }

  crear_tipo_musico() {
    if (this.nombreTipoMusico.trim() === "") {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'El nombre del tipo de músico no puede estar vacío.',
      });
      return;
    }

    this.musicoService.registrar_tipo_musico(this.nombreTipoMusico).subscribe(this.peticion_registrar_tipo_musico);
  }

  peticion_actualizar_tipo_musico = {
    next: (respuesta: any) => {
      Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: 'Tipo de músico actualizado correctamente.',
      });
      this.nombreTipoMusico = "";
      this.tipoMusicoSeleccionado = null;
      this.musicoService.obtener_tipo_musicos().subscribe(this.refrescar_tipo_musicos);
    },
    error: (error: any) => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo actualizar el tipo de músico. Inténtelo más tarde.',
      });
    }
  }

  editar_tipo_musico() {
    if (this.tipoMusicoSeleccionado === null) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Debe seleccionar un tipo de músico para editar.',
      });
      return;
    }
    
    if (this.nombreEditarTipoMusico.trim() === "") {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'El nombre del tipo de músico no puede estar vacío.',
      });
      return;
    }

    this.musicoService.actualizar_tipo_musico(this.tipoMusicoSeleccionado.nid_tipo_musico, this.nombreEditarTipoMusico)
      .subscribe(this.peticion_actualizar_tipo_musico);
  }
}
