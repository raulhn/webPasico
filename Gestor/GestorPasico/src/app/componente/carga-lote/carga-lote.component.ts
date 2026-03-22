import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InterfazPersonaService } from 'src/app/servicios/interfaz-persona.service';

@Component({
  selector: 'app-carga-lote',
  imports: [],
  templateUrl: './carga-lote.component.html',
  styleUrl: './carga-lote.component.css',
})
export class CargaLoteComponent implements OnInit {
  lote: string = '';
  interfaz_personas = [];

  constructor(
    private ruta: ActivatedRoute,
    private interfazPersonaService: InterfazPersonaService,
  ) {
    this.lote = ruta.snapshot.params['lote'];
  }

  peticion_obtener_interfaz_personas = {
    next: (respuesta: any) => {
      this.interfaz_personas = respuesta.interfaz_personas;
    },
  };

  ngOnInit(): void {
    this.interfazPersonaService
      .obtener_interfaz_personas(this.lote)
      .subscribe(this.peticion_obtener_interfaz_personas);
  }
}
