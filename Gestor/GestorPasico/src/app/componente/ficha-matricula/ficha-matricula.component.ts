import { Component, OnInit } from '@angular/core';
import { MatriculasService } from 'src/app/servicios/matriculas.service';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

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

  constructor(private rutaActiva: ActivatedRoute, private matriculaService: MatriculasService)
  {
    this.nid_matricula = rutaActiva.snapshot.params['nid_matricula'];
  }

  obtener_asignaturas =
  {
    next: (respuesta: any) =>
    {
      this.asignaturas = respuesta['asignaturas'];
      this.bCargado = true;
    }
  }  

  recuperar_matricula =
  {
    next: (respuesta: any) =>
    {
      console.log('Recupera')
      console.log(respuesta)
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

  ngOnInit(): void {
    this.matriculaService.obtener_matricula(this.nid_matricula).subscribe(this.recuperar_matricula);
    this.matriculaService.obtener_asignaturas_matriculas(this.nid_matricula).subscribe(this.obtener_asignaturas);
  }

  guardar()
  {
      this.matriculaService.registrar_precio_manual(this.nid_matricula, this.precio_manual).subscribe(this.registrar_precio);
  }
}
