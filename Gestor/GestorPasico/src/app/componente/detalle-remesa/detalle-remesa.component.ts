import { Component, OnInit, Input } from '@angular/core';
import { RemesaService } from 'src/app/servicios/remesa.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-detalle-remesa',
  templateUrl: './detalle-remesa.component.html',
  styleUrls: ['./detalle-remesa.component.css']
})
export class DetalleRemesaComponent implements OnInit{

 nid_remesa: string = "";

  bCargado: boolean = false;
  bCargadas_lineas: boolean = false;
  bCargados_descuentos: boolean = false;

  remesa: any;
  lineas_remesa: any;
  descuentos_remesa: any;

  constructor(private rutaActiva: ActivatedRoute, private remesaService: RemesaService)
  {
    this.nid_remesa = rutaActiva.snapshot.params['nid_remesa'];
  }

  recupera_lineas =
  {
    next: (respuesta: any) =>
    {
      this.lineas_remesa = respuesta.lineas_remesa;
      this.bCargadas_lineas = true;
    }
  }

  recupera_descuentos = 
  {
    next: (respuesta: any) =>
    {
      this.descuentos_remesa = respuesta.descuentos_remesa;
      this.bCargados_descuentos = true;
    }

  }

  recupera_remesa =
  {
    next: (respuesta: any) =>
    {
      this.remesa = respuesta.remesa[0];
      this.bCargado = true;
    }
  }

  ngOnInit(): void {
    this.remesaService.obtener_lineas_remesa(this.nid_remesa).subscribe(this.recupera_lineas);
    this.remesaService.obtener_descuentos_remesa(this.nid_remesa).subscribe(this.recupera_descuentos);
    this.remesaService.obtener_remesa(this.nid_remesa).subscribe(this.recupera_remesa);
  }
}
