import {
  Component,
  OnInit,
  WritableSignal,
  Signal,
  signal,
} from '@angular/core';
import { DataTablesOptions } from 'src/app/logica/constantes';
import { MusicosService } from 'src/app/servicios/musicos.service';

@Component({
  selector: 'app-registrar-asistencia',
  templateUrl: './registrar-asistencia.component.html',
  styleUrls: ['./registrar-asistencia.component.css'],
  standalone: false,
})
export class RegistrarAsistenciaComponent implements OnInit {
  lista_musicos_seleccionados = {};

  $lista_musicos: WritableSignal<any[]> = signal([]);
  $id_tabla_musicos: Signal<string> = signal('tabla_musicos');
  cabecera_tabla_musicos: any[] = [
    { title: 'DNI', data: 'nif' },
    { title: 'Nombre', data: 'nombre' },
    { title: 'Primer apellido', data: 'primer_apellido' },
    { title: 'Segundo apellido', data: 'segundo_apellido' },
  ];

  $lista_musicos_seleccionados: WritableSignal<any[]> = signal([]);
  $id_tabla_musicos_seleccionados: Signal<string> = signal(
    'tabla_musicos_seleccionados',
  );

  bCargadosMusicos: boolean = false;
  musico_seleccionado: string = '';
  musico_seleccionados_seleccionado: string = '';

  bCargadosMusicos_seleccionados: boolean = false;

  constructor(private musicoService: MusicosService) {}

  click_musico(persona_marcada: any) {
    this.musico_seleccionado = persona_marcada;
  }

  obtener_musicos = {
    next: (respuesta: any) => {
      this.$lista_musicos.set(respuesta.personas);
      this.bCargadosMusicos = true;
    },
  };

  ngOnInit(): void {
    this.musicoService.obtener_musicos().subscribe(this.obtener_musicos);
  }

  add_asistente() {}

  delete_asistente() {}
}
