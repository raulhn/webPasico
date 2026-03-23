import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InterfazPersonaService } from 'src/app/servicios/interfaz-persona.service';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../menu/menu.component';

@Component({
  selector: 'app-carga-lote',
  templateUrl: './carga-lote.component.html',
  styleUrl: './carga-lote.component.css',
  standalone: false,
})
export class CargaLoteComponent implements OnInit {
  lote: string = '';
  interfaz_personas: any[] = [];

  operaciones: any = {
    INSERTAR: 'INSERTAR',
    ACTUALIZAR: 'ACTUALIZAR',
    CONFLICTO: 'CONFLICTO',
    SIN_CAMBIOS: 'SIN_CAMBIOS',
  };

  interfaz_personas_insertar: any[] = [];
  interfaz_personas_actualizar: any[] = [];
  interfaz_personas_conflicto: any[] = [];
  interfaz_personas_sin_cambios: any[] = [];

  constructor(
    private ruta: ActivatedRoute,
    private interfazPersonaService: InterfazPersonaService,
  ) {
    this.lote = ruta.snapshot.params['lote'];
  }

  peticion_obtener_interfaz_personas = {
    next: (respuesta: any) => {
      this.interfaz_personas = respuesta.interfaz_personas;

      this.interfaz_personas_insertar = this.interfaz_personas.filter(
        (persona) =>
          persona.interfaz_persona.operacion === this.operaciones.INSERTAR,
      );

      this.interfaz_personas_actualizar = this.interfaz_personas.filter(
        (persona) =>
          persona.interfaz_persona.operacion === this.operaciones.ACTUALIZAR,
      );

      let lista_conflictos = this.interfaz_personas.filter(
        (persona) =>
          persona.interfaz_persona.operacion === this.operaciones.CONFLICTO,
      );

      this.interfaz_personas_conflicto = lista_conflictos.map((conflicto) => {
        return {
          conflicto: conflicto,
          accion_seleccionada: '',
          nid_persona: null,
        };
      });

      this.interfaz_personas_sin_cambios = this.interfaz_personas.filter(
        (persona) =>
          persona.interfaz_persona.operacion === this.operaciones.SIN_CAMBIOS,
      );
    },
  };

  ngOnInit(): void {
    this.interfazPersonaService
      .obtener_interfaz_personas(this.lote)
      .subscribe(this.peticion_obtener_interfaz_personas);
  }

  actualizarSeleccion(nid_interfaz_persona: string, conflicto: any) {
    let persona = this.interfaz_personas.find(
      (p) => p.nid_interfaz_persona === nid_interfaz_persona,
    );
    if (persona) {
      persona.nid_persona = conflicto.nid_persona;
    }
  }
}
