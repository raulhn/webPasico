import { Component, OnInit, Input } from '@angular/core';
import { DireccionService } from 'src/app/servicios/direccion.service';

@Component({
    selector: 'app-direccion',
    templateUrl: './direccion.component.html',
    styleUrls: ['./direccion.component.css'],
    standalone: false
})
export class DireccionComponent implements OnInit{

  datos_direccion: any;
  @Input() nid_persona: string = "";

  provincia: string = "";
  municipio: string = "";
  direccion_postal: string = "";
  codigo_postal: string = "";

  numero: string = "";
  escalera: string = "";
  puerta: string = "";
  planta: string = "";

  bCargado: boolean = false;

  constructor(private direccionService: DireccionService)
  {

  }

  obtener_direccion =
  {
    next: (respuesta: any) =>
    {
      this.datos_direccion = respuesta.direccion;
      this.direccion_postal = this.datos_direccion['direccion'];
      this.provincia = this.datos_direccion.provincia;
      this.municipio = this.datos_direccion.municipio;
      this.codigo_postal = this.datos_direccion.codigo_postal;
      this.planta = this.datos_direccion.planta;

      this.numero = this.datos_direccion.numero;
      this.escalera = this.datos_direccion.escalera;
      this.puerta = this.datos_direccion.puerta;

      this.bCargado = true;
    },
    error: (respuesta: any) =>
    {
      // Se considera que aún no se ha registado una dirección //
      this.bCargado = true;
    }
  }

  ngOnInit(): void {
    this.direccionService.obtener_direccion(this.nid_persona).subscribe(this.obtener_direccion)
  }

  construye_direccion()
  {
    console.log('Direccion ' + this.direccion_postal)
    return {nid_persona: this.nid_persona, direccion: this.direccion_postal, provincia: this.provincia, municipio: this.municipio,
        codigo_postal: this.codigo_postal, numero: this.numero, escalera: this.escalera, puerta: this.puerta, planta: this.planta};
  }
}
