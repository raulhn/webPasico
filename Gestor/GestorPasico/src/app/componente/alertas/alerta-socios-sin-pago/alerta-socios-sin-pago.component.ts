import { Component, OnInit, signal } from '@angular/core';
import { AlertasService } from '../../../servicios/alertas.service';
import { URL } from 'src/app/logica/constantes';

@Component({
  selector: 'app-alerta-socios-sin-pago',
  templateUrl: './alerta-socios-sin-pago.component.html',
  styleUrl: './alerta-socios-sin-pago.component.css',
  standalone: false,
})
export class AlertaSociosSinPagoComponent implements OnInit {
  enlaceFicha: string = URL.URL_FRONT_END + '/ficha_persona/';

  $sociosSinPago = signal([]);
  $idTablaSociosSinPago = signal('tabla_personas');
  cabecera_tabla_socios_sin_pago = [
    { title: 'Nombre', data: 'nombre' },
    { title: 'Primer Apellido', data: 'primer_apellido' },
    { title: 'Segundo Apellido', data: 'segundo_apellido' },
    { title: 'Email', data: 'correo_electronico' },
    { title: 'Teléfono', data: 'telefono' },
  ];

  socioSeleccionado: any;

  bCargadosSocios: boolean = false;

  clickSocio(data: any) {
    this.socioSeleccionado = data;
  }

  constructor(private alertasService: AlertasService) {}

  peticion_socios_sin_pago = {
    next: (res: any) => {
      this.$sociosSinPago.set(res.socios_sin_forma_pago);
      this.bCargadosSocios = true;
    },
    error: (err: any) => {
      console.log(err);
    },
  };

  ngOnInit(): void {
    this.alertasService
      .obtener_socios_sin_pago()
      .subscribe(this.peticion_socios_sin_pago);
  }

  obtenerUrlFicha() {
    return this.enlaceFicha + this.socioSeleccionado.nid;
  }
}
