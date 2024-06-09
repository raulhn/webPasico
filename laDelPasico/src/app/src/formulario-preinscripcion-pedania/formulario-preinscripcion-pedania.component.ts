import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { ServicioPreinscripcionService } from 'src/app/servicios/servicio-preinscripcion.service';
import Swal from 'sweetalert2';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { Instrumento } from '../logica/instrumento';

@Component({
  selector: 'app-formulario-preinscripcion-pedania',
  templateUrl: './formulario-preinscripcion-pedania.component.html',
  styleUrls: ['./formulario-preinscripcion-pedania.component.css']
})



export class FormularioPreinscripcionPedaniaComponent implements OnInit {
 
  
  @ViewChild('instancia_sustituir') instancia_sustituir!: ElementRef;

  instrumentos_seleccionados:Instrumento [] = [];

  constructor(private recaptchaV3Service: ReCaptchaV3Service, private servicioPreinscripcion: ServicioPreinscripcionService) { 
     for(let i=0; i<3; i++)
      {
        this.instrumentos_seleccionados[i] = new Instrumento;
      }
  }


  @Input() sucursal: string = "";

  CURSO_PRIMERO: number = 1;

  familia_instrumento: string = "1";
  instrumento: string ="";

  token: string ="";

  tipo_inscripcion: string = "1";
  horario_seleccionado: string = "";

  nombre_alumno: string = "";
  primer_apellido_alumno: string  = "";
  segundo_apellido_alumno: string  = "";
  dni_alumno: string = "";
  fecha_nacimiento: string = "";
  nombre_padre: string  = "";
  primer_apellido_padre: string  = "";
  segundo_apellido_padre: string  = "";
  dni_padre: string  = "";
  correo_electronico: string  = "";
  telefono: string = "";
  provincia: string = "";
  municipio: string = "";
  direccion: string = "";
  codigo_postal: string = "";
  numero: string = "";
  puerta: string = "";
  escalera: string = "";


  ngOnInit(): void {
  }

  calculo_edad()
  {
    let date_nacimiento = new Date(this.fecha_nacimiento) 
    var fecha_actual = new Date();
    let resta =  fecha_actual.getTime() - date_nacimiento.getTime() 

    return Math.trunc(resta / (1000*60*60*24*365))
  }

  obtener_curso()
  {
    if (this.tipo_inscripcion == "1" && this.calculo_edad() >= 7)
      return this.CURSO_PRIMERO;
    return 0; // Se tendrá que controlar
  }
  

  
  lanza_registro =
  {
    next: (respuesta: any) =>
    {
      this.token = respuesta;

      if (this.familia_instrumento == "3")
      {
        this.instrumento = 'Percusión'
      }

      if(this.comprueba_edad())
      {
        let data = {token: this.token, nombre: this.nombre_alumno, primer_apellido: this.primer_apellido_alumno, segundo_apellido: this.segundo_apellido_alumno,
        fecha_nacimiento: this.fecha_nacimiento, dni: this.dni_alumno, nombre_padre: this.nombre_padre, primer_apellido_padre: this.primer_apellido_padre, 
        segundo_apellido_padre: this.segundo_apellido_padre, dni_padre: this.dni_padre, correo_electronico: this.correo_electronico, telefono: this.telefono,
        provincia: this.provincia, municipio: this.municipio, direccion: this.direccion, codigo_postal: this.codigo_postal, numero: this.numero, 
        escalera: this.escalera, puerta: this.puerta, instrumento: this.instrumento, familia_instrumento: this.familia_instrumento, sucursal: this.sucursal,  
        curso: this.obtener_curso(), horario: this.horario_seleccionado, tipo_inscripcion: this.tipo_inscripcion,
        instrumento2: this.instrumentos_seleccionados[1].instrumento, familia_instrumento2: this.instrumentos_seleccionados[1].familia_instrumento,
        instrumento3: this.instrumentos_seleccionados[2].instrumento, familia_instrumento3: this.instrumentos_seleccionados[2].familia_instrumento};

        this.servicioPreinscripcion.registrar_preinscripcion(data).subscribe(this.realiza_registro);
      }
      else
      {
        let data = {token: this.token, nombre: this.nombre_alumno, primer_apellido: this.primer_apellido_alumno, segundo_apellido: this.segundo_apellido_alumno,
        fecha_nacimiento: this.fecha_nacimiento, dni: this.dni_alumno, nombre_padre: this.nombre_padre, primer_apellido_padre: this.primer_apellido_padre, 
        segundo_apellido_padre: this.segundo_apellido_padre, dni_padre: this.dni_padre, correo_electronico: this.correo_electronico, telefono: this.telefono,
        provincia: this.provincia, municipio: this.municipio, direccion: this.direccion, codigo_postal: this.codigo_postal, numero: this.numero, 
        escalera: this.escalera, puerta: this.puerta, instrumento: "", familia_instrumento: "", sucursal: this.sucursal, curso: this.obtener_curso(), 
        horario: this.horario_seleccionado, tipo_inscripcion: this.tipo_inscripcion,
        instrumento2: "", familia_instrumento2: "",  instrumento3: "", familia_instrumento3: ""};
        
        this.servicioPreinscripcion.registrar_preinscripcion(data).subscribe(this.realiza_registro);
      }
    }
    ,
    error: (respuesta: any) =>
    {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Se ha producido un error',
      })
    }
  }

  lanza_error(mensaje: string)
  {
    Swal.fire({
      icon: 'error',
      title: 'Revise los datos',
      text: mensaje
    })
  }

  valida_formulario()
  {
    if (this.fecha_nacimiento == "")
    {
      this.lanza_error('Es necesario instroducir una fecha de nacimiento')
      return false;
    }
    else if (this.telefono == "")
    {
      this.lanza_error("Es necesario introducir un teléfono")
      return false;
    }
    else if (this.correo_electronico == "")
    {
      this.lanza_error("Es necesario introducir un correo electrónico");
      return false;
    }
    else if (this.nombre_alumno == "")
    {
      this.lanza_error("Es necesario introducir un nombre para el alumno")
      return false;
    }
    else if (this.primer_apellido_alumno == "")
    {
      this.lanza_error("Es necesario introducir un apellido para el alumno")
      return false;
    }
    return true;
  }

  comprueba_edad()
  {
    return this.calculo_edad() > 7;
  }
  
  comprueba_edad_primero()
  {
    return this.calculo_edad() > 7 && this.calculo_edad() < 18;
  }


  actualiza_instrumento(nueva_familia: string)
  {
    this.familia_instrumento = nueva_familia;
    this.instrumento = "";
    if(this.familia_instrumento == "3")
    {
      this.instrumento = "Percusión";
    }
  }

  
  actualiza_tipo_inscripcion(tipo_inscripcion: string)
  {
    this.tipo_inscripcion = tipo_inscripcion;
  }

  actualiza_horario(horario: string)
  {
    this.horario_seleccionado = horario;
  }

  realiza_registro =
  {
    next: (respuesta: any) =>
    {  
      Swal.fire({
      icon: 'success',
      title: 'Registro correcto',
      text: 'Gracias por su solicitud, nos pondremos en contacto con usted lo antes posible'
    })
  },
  error: (respuesta: any) =>
  {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Se ha producido un error',
    })
  }
  }

  
  registrar()
  {
    if(this.valida_formulario())
    {
      this.recaptchaV3Service.execute('importantAction')
      .subscribe(this.lanza_registro);
    }
  }

  add_instrumento(num_instrumento: number)
  {
      Swal.fire({
        title: 'Elige Instrumento',
        html: this.instancia_sustituir.nativeElement,
        confirmButtonText: 'Seleccionar',
        showCancelButton: true
      }).then(
        (results: any) =>
          {
            if(results.isConfirmed)
              {
                this.instrumentos_seleccionados[num_instrumento].familia_instrumento = this.familia_instrumento;
                this.instrumentos_seleccionados[num_instrumento].instrumento = this.instrumento;
              }
          }
      )
  }

}
