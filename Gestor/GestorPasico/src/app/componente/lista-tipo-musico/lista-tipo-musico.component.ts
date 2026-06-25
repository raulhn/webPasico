import {
  Component,
  ViewChild,
  ElementRef,
  WritableSignal,
  Signal,
  signal,
} from '@angular/core';
import { MusicosService } from 'src/app/servicios/musicos.service';
import { OnInit } from '@angular/core';
import 'datatables.net-plugins/filtering/type-based/accent-neutralise.mjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-lista-tipo-musico',
  templateUrl: './lista-tipo-musico.component.html',
  styleUrl: './lista-tipo-musico.component.css',
  standalone: false,
})
export class ListaTipoMusicoComponent implements OnInit {
  nombreTipoMusico: string = '';
  nombreEditarTipoMusico: string = '';

  constructor(private musicoService: MusicosService) {}

  $lista_tipo_musicos: WritableSignal<any[]> = signal([]);
  $id_tabla_tipos_musicos: Signal<string> = signal('#tabla_tipo_musicos');
  cabecera_tabla_tipos_musicos: any[] = [
    { title: 'Tipo Musico', data: 'descripcion' },
  ];

  tipoMusicoSeleccionado: any = null;

  @ViewChild('instanciaRegistroTipoMusico')
  instancia_registro_tipo_musico!: ElementRef;
  @ViewChild('instanciaEditarTipoMusico')
  instancia_editar_tipo_musico!: ElementRef;

  click_tipo_musico(tipo_musico: any) {
    this.tipoMusicoSeleccionado = tipo_musico;
  }

  refrescar_tipo_musicos = {
    next: (respuesta: any) => {
      this.$lista_tipo_musicos.set(respuesta.tipo_musicos);
    },
    error: (error: any) => {
      console.error('Error fetching tipo musicos:', error);
    },
  };

  ngOnInit(): void {
    this.musicoService
      .obtener_tipo_musicos()
      .subscribe(this.refrescar_tipo_musicos);
  }

  mostrar_registro_tipo_musico() {
    Swal.fire({
      title: 'Registrar Tipo de Músico',
      html: this.instancia_registro_tipo_musico.nativeElement,
      confirmButtonText: 'Registrar',
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.crear_tipo_musico();
      }
    });
  }

  mostrar_editar_tipo_musico() {
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
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.editar_tipo_musico();
      }
    });
  }

  peticion_registrar_tipo_musico = {
    next: (respuesta: any) => {
      Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: 'Tipo de músico registrado correctamente.',
      });
      this.nombreTipoMusico = '';
      this.musicoService
        .obtener_tipo_musicos()
        .subscribe(this.refrescar_tipo_musicos);
    },
    error: (error: any) => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo registrar el tipo de músico. Inténtelo más tarde.',
      });
    },
  };

  crear_tipo_musico() {
    if (this.nombreTipoMusico.trim() === '') {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'El nombre del tipo de músico no puede estar vacío.',
      });
      return;
    }

    this.musicoService
      .registrar_tipo_musico(this.nombreTipoMusico)
      .subscribe(this.peticion_registrar_tipo_musico);
  }

  peticion_actualizar_tipo_musico = {
    next: (respuesta: any) => {
      Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: 'Tipo de músico actualizado correctamente.',
      });
      this.nombreTipoMusico = '';
      this.tipoMusicoSeleccionado = null;
      this.musicoService
        .obtener_tipo_musicos()
        .subscribe(this.refrescar_tipo_musicos);
    },
    error: (error: any) => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo actualizar el tipo de músico. Inténtelo más tarde.',
      });
    },
  };

  editar_tipo_musico() {
    if (this.tipoMusicoSeleccionado === null) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Debe seleccionar un tipo de músico para editar.',
      });
      return;
    }

    if (this.nombreEditarTipoMusico.trim() === '') {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'El nombre del tipo de músico no puede estar vacío.',
      });
      return;
    }

    this.musicoService
      .actualizar_tipo_musico(
        this.tipoMusicoSeleccionado.nid_tipo_musico,
        this.nombreEditarTipoMusico,
      )
      .subscribe(this.peticion_actualizar_tipo_musico);
  }
}
