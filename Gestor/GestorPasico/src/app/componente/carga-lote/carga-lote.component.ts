import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InterfazPersonaService } from 'src/app/servicios/interfaz-persona.service';

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

  operciones_seleccionables: any[] = [
    { valor: 'INSERTAR', etiqueta: 'Insertar' },
    { valor: 'ACTUALIZAR', etiqueta: 'Actualizar' },
    { valor: 'SIN_CAMBIOS', etiqueta: 'Sin Cambios' },
  ];

  interfaz_personas_insertar: any[] = [];
  interfaz_personas_actualizar: any[] = [];
  interfaz_personas_conflicto: any[] = [];
  interfaz_personas_sin_cambios: any[] = [];

  cambios_actualizacion: any[] = [];

  constructor(
    private ruta: ActivatedRoute,
    private interfazPersonaService: InterfazPersonaService,
  ) {
    this.lote = ruta.snapshot.params['lote'];
  }

  existe_conflicto_sin_seleccion = (conflictos: any[]) => {
    return conflictos.some((conflicto) => conflicto.nid_persona !== null);
  };

  peticion_obtener_interfaz_personas = {
    next: (respuesta: any) => {
      this.interfaz_personas = respuesta.interfaz_personas;

      let lista_insertar = this.interfaz_personas.filter(
        (persona) =>
          persona.interfaz_persona.operacion === this.operaciones.INSERTAR,
      );

      this.interfaz_personas_insertar = lista_insertar.map((insertar) => {
        return {
          insertar: insertar,
          accion_seleccionada: '',
          nid_persona: null,
        };
      });

      let lista_actualizar = this.interfaz_personas.filter(
        (persona) =>
          persona.interfaz_persona.operacion === this.operaciones.ACTUALIZAR,
      );

      this.interfaz_personas_actualizar = lista_actualizar.map((actualizar) => {
        return {
          actualizar: actualizar,
          accion_seleccionada: '',
          nid_persona: null,
        };
      });

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

  actualizarSeleccionConflicto(interfaz_persona: any, conflicto: any) {
    let persona = this.interfaz_personas_conflicto.find(
      (p) =>
        p.conflicto.interfaz_persona.nid_interfaz_persona ===
        interfaz_persona.nid_interfaz_persona,
    );
    if (persona) {
      persona.nid_persona =
        persona.accion_seleccionada === 'INSERTAR'
          ? null
          : conflicto.nid_persona;
    }
  }

  lanzar_actualizacion() {
    const cambios_conflictos = this.interfaz_personas_conflicto.map((p) => {
      return {
        nid_interfaz_persona: p.conflicto.interfaz_persona.nid_interfaz_persona,
        accion_seleccionada: p.accion_seleccionada,
        nid_persona: p.nid_persona,
      };
    });

    const cambios_insertar = this.interfaz_personas_insertar.map((p) => {
      return {
        nid_interfaz_persona: p.insertar.interfaz_persona.nid_interfaz_persona,
        accion_seleccionada: p.accion_seleccionada,
        nid_persona: p.nid_persona,
      };
    });

    const cambios_actualizar = this.interfaz_personas_actualizar.map((p) => {
      return {
        nid_interfaz_persona:
          p.actualizar.interfaz_persona.nid_interfaz_persona,
        accion_seleccionada: p.accion_seleccionada,
        nid_persona: p.nid_persona,
      };
    });

    const cambios = [
      ...cambios_conflictos,
      ...cambios_insertar,
      ...cambios_actualizar,
    ];

    const cambios_filtrados = cambios.filter(
      (cambio) => cambio.accion_seleccionada !== '',
    );
    console.log(cambios);
  }
}
