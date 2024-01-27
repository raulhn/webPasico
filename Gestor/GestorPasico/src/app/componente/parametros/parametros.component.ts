import { Component, OnInit } from '@angular/core';
import { ParametrosService } from 'src/app/servicios/parametros.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-parametros',
  templateUrl: './parametros.component.html',
  styleUrls: ['./parametros.component.css']
})
export class ParametrosComponent implements OnInit{

  NOMBRE_PARAMETRO_INSTRUMENTO_BANDA = 'PRECIO_INSTRUMENTO_BANDA';
  NOMBRE_PARAMETRO_INSTRUMENTO_NO_BANDA = 'PRECIO_INSTRUMENTO_NO_BANDA';
  NOMBRE_PARAMETRO_LENGUAJE = 'PRECIO_LENGUAJE';
  NOMBRE_PARAMETRO_PORCENTAJE_FAMILIA = 'PORCENTAJE_DESCUENTO_FAMILIA';
  NOMBRE_PARAMETRO_VIENTO_CUERDA = 'REBAJA_VIENTO_CUERDA';
  NOMBRE_PARAMETRO_NO_SOCIO = 'SUMA_PRECIO_NO_SOCIO';
  NOMBRE_PARAMETRO_PRECIO_SOCIO = 'PRECIO_SOCIO';

  NUM_PETICIONES: number = 6;

  precio_instrumento_banda: string = "";
  precio_instrumento_no_banda: string = "";
  precio_lenguaje: string = "";
  precio_socio: string = "";

  porcentaje_familia: string = "";
  rebaja_viento_cuerda: string = "";

  suma_precio_no_socio: string = "";

  v_error: number = 0;
  v_peticiones: number = 0;

  constructor(private parametrosService: ParametrosService)
  {}
 
  peticion_guardar = 
  {
    next: (respuesta: any) =>
    {
      this.v_peticiones = this.v_peticiones + 1;
      if(this.v_peticiones == this.NUM_PETICIONES)
      {
        if(this.v_error == 1)
        {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Se ha producido un error'
          })
        }
        else
        {
          Swal.fire({
            icon: 'success',
            title: 'Actualización completada',
            text: 'Se han actualizado los parámetros de forma correcta'
          });
        }
      }
    },
    error: (respuesta: any) =>
    {
      this.v_peticiones = this.v_peticiones + 1;
      this.v_error = 1;
    }   
  }

  recuperar_valores =
  {
    next: (respuesta: any) =>
    {
      console.log(respuesta);

      if(respuesta['valor']['nombre'] == this.NOMBRE_PARAMETRO_INSTRUMENTO_BANDA)
      {
        this.precio_instrumento_banda = respuesta['valor']['valor'];
      }
      else if(respuesta['valor']['nombre'] == this.NOMBRE_PARAMETRO_INSTRUMENTO_NO_BANDA)
      {
        this.precio_instrumento_no_banda = respuesta['valor']['valor'];
      }
      else if(respuesta['valor']['nombre'] == this.NOMBRE_PARAMETRO_LENGUAJE)
      {
        this.precio_lenguaje = respuesta['valor']['valor'];
      }
      else if(respuesta['valor']['nombre'] == this.NOMBRE_PARAMETRO_PORCENTAJE_FAMILIA)
      {
        this.porcentaje_familia = respuesta['valor']['valor'];
      }
      else if(respuesta['valor']['nombre'] == this.NOMBRE_PARAMETRO_VIENTO_CUERDA)
      {
        this.rebaja_viento_cuerda = respuesta['valor']['valor'];
      }
      else if(respuesta['valor']['nombre'] == this.NOMBRE_PARAMETRO_NO_SOCIO)
      {
        this.suma_precio_no_socio = respuesta['valor']['valor'];
      }
      else if(respuesta['valor']['nombre'] == this.NOMBRE_PARAMETRO_PRECIO_SOCIO)
      {
        this.precio_socio = respuesta['valor']['valor'];
      }
    }
  }

  ngOnInit(): void {
    this.parametrosService.obtener_valor(this.NOMBRE_PARAMETRO_INSTRUMENTO_BANDA).subscribe(this.recuperar_valores)
    this.parametrosService.obtener_valor(this.NOMBRE_PARAMETRO_INSTRUMENTO_NO_BANDA).subscribe(this.recuperar_valores)
    this.parametrosService.obtener_valor(this.NOMBRE_PARAMETRO_LENGUAJE).subscribe(this.recuperar_valores)
    this.parametrosService.obtener_valor(this.NOMBRE_PARAMETRO_PORCENTAJE_FAMILIA).subscribe(this.recuperar_valores)
    this.parametrosService.obtener_valor(this.NOMBRE_PARAMETRO_VIENTO_CUERDA).subscribe(this.recuperar_valores)
    this.parametrosService.obtener_valor(this.NOMBRE_PARAMETRO_NO_SOCIO).subscribe(this.recuperar_valores)
    this.parametrosService.obtener_valor(this.NOMBRE_PARAMETRO_PRECIO_SOCIO).subscribe(this.recuperar_valores)
  }

  guardar()
  {
    this.v_error = 0;
    this.v_peticiones = 0;

    this.parametrosService.actualizar_valor(this.NOMBRE_PARAMETRO_INSTRUMENTO_BANDA, this.precio_instrumento_banda).subscribe(this.peticion_guardar);
    this.parametrosService.actualizar_valor(this.NOMBRE_PARAMETRO_INSTRUMENTO_NO_BANDA, this.precio_instrumento_no_banda).subscribe(this.peticion_guardar);
    this.parametrosService.actualizar_valor(this.NOMBRE_PARAMETRO_LENGUAJE, this.precio_lenguaje).subscribe(this.peticion_guardar);
    this.parametrosService.actualizar_valor(this.NOMBRE_PARAMETRO_PORCENTAJE_FAMILIA, this.porcentaje_familia).subscribe(this.peticion_guardar);
    this.parametrosService.actualizar_valor(this.NOMBRE_PARAMETRO_VIENTO_CUERDA, this.rebaja_viento_cuerda).subscribe(this.peticion_guardar);
    this.parametrosService.actualizar_valor(this.NOMBRE_PARAMETRO_NO_SOCIO, this.suma_precio_no_socio).subscribe(this.peticion_guardar);
    this.parametrosService.actualizar_valor(this.NOMBRE_PARAMETRO_PRECIO_SOCIO, this.precio_socio).subscribe(this.peticion_guardar);
  }
}
