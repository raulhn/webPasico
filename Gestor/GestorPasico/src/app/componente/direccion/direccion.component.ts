import { Component, OnInit, Input } from '@angular/core';
import { DireccionService } from 'src/app/servicios/direccion.service';

@Component({
  selector: 'app-direccion',
  templateUrl: './direccion.component.html',
  styleUrls: ['./direccion.component.css']
})
export class DireccionComponent implements OnInit{

  direccion: any;
  @Input() nid_persona: string = "";

  provincia: string = "";
  municipio: string = "";
  direccion_postal: string = "";
  codigo_postal: string = "";

  numero: string = "";
  escalera: string = "";
  puerta: string = "";

  bCargado: boolean = false;

  constructor(private direccionService: DireccionService)
  {

  }

  obtener_direccion =
  {
    next: (respuesta: any) =>
    {
      this.direccion = respuesta.direccion;
      console.log(respuesta.direccion)
      this.direccion_postal = this.direccion['direccion'];
      console.log(this.direccion_postal)
      this.provincia = this.direccion.provincia;
      this.municipio = this.direccion.municipio;
      this.codigo_postal = this.direccion.codigo_postal;

      this.numero = this.direccion.numero;
      this.escalera = this.direccion.escalera;
      this.puerta = this.direccion.puerta;

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
        codigo_postal: this.codigo_postal, numero: this.numero, escalera: this.escalera, puerta: this.puerta};
  }
}
