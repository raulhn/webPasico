import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { ServicioPreinscripcionService } from 'src/app/servicios/servicio-preinscripcion.service';
import Swal from 'sweetalert2';
import { ReCaptchaV3Service } from 'ngx-captcha';
//import { ReCaptchaV3Service } from 'ng-recaptcha';
import { Instrumento } from '../logica/instrumento';
import { environment } from 'src/environments/environment';


@Component({
    selector: 'app-formulario-preinscripcion-torre-pacheco',
    templateUrl: './formulario-preinscripcion-torre-pacheco.component.html',
    styleUrls: ['./formulario-preinscripcion-torre-pacheco.component.css'],
    standalone: false
})
export class FormularioPreinscripcionTorrePachecoComponent implements OnInit {
  @ViewChild('instancia_sustituir') instancia_sustituir!: ElementRef;

  instrumentos_seleccionados:Instrumento [] = [];

  constructor(private recaptchaV3Service: ReCaptchaV3Service, private servicioPreinscripcion: ServicioPreinscripcionService) { 
     for(let i=0; i<3; i++)
      {
        this.instrumentos_seleccionados[i] = new Instrumento;
      }
  }

  CURSO_PRIMERO: number = 1;
  CURSO_SEGUNDO: number = 2;
  CURSO_TERCERO: number = 3;
  CURSO_CUARTO: number = 4;
  CURSO_QUINTO: number = 5;
  CURSO_ADULTO: number = 6;
  CURSO_INICIACION: number = 7;
  CURSO_PREPARATORIO: number = 8;

  curso_seleccionado: number = 1;

  @Input() sucursal: string = "";

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
    let resta =  fecha_actual.getFullYear() - date_nacimiento.getFullYear() 

//    return Math.trunc(resta / (1000*60*60*24*365))
    return resta;
  }


  obtener_curso()
  {
    if (this.tipo_inscripcion == "1" && this.calculo_edad() > 7 && this.calculo_edad() < 18)
      return this.CURSO_PRIMERO;
    else if(this.tipo_inscripcion == "2"  && this.calculo_edad() > 7 && this.calculo_edad() < 18)
      return this.curso_seleccionado;
    else if(this.calculo_edad() > 18)
      return this.CURSO_ADULTO;
    else if(this.calculo_edad() == 7)
      return this.CURSO_PREPARATORIO
    else if(this.calculo_edad() < 7)
      return this.CURSO_INICIACION;
    return 0; // No se debería de dar
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

      if (this.familia_instrumento == "7")
      {
        this.instrumento = 'Piano'
      }

      if (this.familia_instrumento == "8")
      {
        this.instrumento = 'Guitarra'
      }


      if(this.calculo_edad() >= 7)
      {
        let data = {token: this.token, nombre: this.nombre_alumno, primer_apellido: this.primer_apellido_alumno, segundo_apellido: this.segundo_apellido_alumno,
        fecha_nacimiento: this.fecha_nacimiento, dni: this.dni_alumno, nombre_padre: this.nombre_padre, primer_apellido_padre: this.primer_apellido_padre, 
        segundo_apellido_padre: this.segundo_apellido_padre, dni_padre: this.dni_padre, correo_electronico: this.correo_electronico, telefono: this.telefono,
        provincia: this.provincia, municipio: this.municipio, direccion: this.direccion, codigo_postal: this.codigo_postal, numero: this.numero, 
        escalera: this.escalera, puerta: this.puerta, instrumento: this.instrumentos_seleccionados[0].instrumento, familia_instrumento: this.instrumentos_seleccionados[0].familia_instrumento
        , sucursal: this.sucursal,  curso: this.obtener_curso(), horario: this.horario_seleccionado, tipo_inscripcion: this.tipo_inscripcion,
        instrumento2: this.instrumentos_seleccionados[1].instrumento, familia_instrumento2: this.instrumentos_seleccionados[1].familia_instrumento,
        instrumento3: this.instrumentos_seleccionados[2].instrumento, familia_instrumento3: this.instrumentos_seleccionados[2].familia_instrumento} ;

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
    else if(this.calculo_edad() < 3)
    {
      this.lanza_error("El alumno tiene que tener al menos 3 años para poder matricularse");
      return false;
    }

    if (this.calculo_edad() < 18)
    {
      if(this.nombre_padre == "")
      {
        this.lanza_error("Es necesario instroducir un nombre para el Padre / Madre / Tutor");
        return false;
      }
      else if(this.primer_apellido_padre == "")
      {
        this.lanza_error("Es necesario instroducir el primer apellido para el Padre / Madre / Tutor");
        return false;
      }  
      else if(this.dni_padre == "")
      {
        this.lanza_error("Es necesario introducir el DNI para el Padre / Madre / Tutor");
        return false;
      }
    }

    return true;
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

    if (this.familia_instrumento == "7")
    {
      this.instrumento = 'Piano'
    }

    if (this.familia_instrumento == "8")
    {
      this.instrumento = 'Guitarra'
    }
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
 
      try
      {
        this.recaptchaV3Service.execute(environment.recaptcha.siteKey, 'importantAction',
          (token) => {
            this.token = token;

            if (this.familia_instrumento == "3")
            {
              this.instrumento = 'Percusión'
            }
      
            if(this.calculo_edad() >= 7)
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
          });
      }
      catch (error)
      {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Se ha producido un error',
        })
      }
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
