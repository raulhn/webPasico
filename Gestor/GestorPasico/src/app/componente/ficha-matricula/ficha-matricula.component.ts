import { Component, OnInit } from '@angular/core';
import { MatriculasService } from 'src/app/servicios/matriculas.service';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { RemesaService } from 'src/app/servicios/remesa.service';

@Component({
  selector: 'app-ficha-matricula',
  templateUrl: './ficha-matricula.component.html',
  styleUrls: ['./ficha-matricula.component.css']
})
export class FichaMatriculaComponent implements OnInit{

  nid_matricula: string = "";

  asignaturas: any;
  bCargado: boolean = false;

  precio_manual: string ="";

  mensualidad_matricula: any;

  constructor(private rutaActiva: ActivatedRoute, private matriculaService: MatriculasService, private remesaService: RemesaService)
  {
    this.nid_matricula = rutaActiva.snapshot.params['nid_matricula'];
  }

  obtener_asignaturas =
  {
    next: (respuesta: any) =>
    {
      this.asignaturas = respuesta['asignaturas'];
    }
  }  

  recuperar_matricula =
  {
    next: (respuesta: any) =>
    {
      this.precio_manual = respuesta['matricula']['precio_manual'];
    }
  }

  registrar_precio =
  {
    next: (respuesta: any) =>
    {
      Swal.fire({
        icon: 'success',
        title: 'Precio Guardado',
        text: 'Se ha actualizado el precio'
      });
    },
    error: (respuesta: any) =>
    {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Se ha producido un error'
      })
    }
  }

  obtener_mensualidad_matricula =
  {
    next: (respuesta: any) =>
    {
      this.mensualidad_matricula = respuesta['resumen_mensualidad'];
      this.bCargado = true;
    }
  }

  ngOnInit(): void {
    this.matriculaService.obtener_matricula(this.nid_matricula).subscribe(this.recuperar_matricula);
    this.matriculaService.obtener_asignaturas_matriculas(this.nid_matricula).subscribe(this.obtener_asignaturas);
    this.remesaService.obtener_precio_mensualidad(this.nid_matricula).subscribe(this.obtener_mensualidad_matricula);
  }

  guardar()
  {
      this.matriculaService.registrar_precio_manual(this.nid_matricula, this.precio_manual).subscribe(this.registrar_precio);
  }
}
