import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InterfazPersonaService } from 'src/app/servicios/interfaz-persona.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-carga-lote',
  imports: [CommonModule],
  templateUrl: './carga-lote.component.html',
  styleUrl: './carga-lote.component.css',
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

      this.interfaz_personas_conflicto = this.interfaz_personas.filter(
        (persona) =>
          persona.interfaz_persona.operacion === this.operaciones.CONFLICTO,
      );
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
}
