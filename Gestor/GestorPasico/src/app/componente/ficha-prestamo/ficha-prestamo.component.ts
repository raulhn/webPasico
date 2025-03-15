import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InventarioService } from 'src/app/servicios/inventario.service';
import { PersonasService } from 'src/app/servicios/personas.service';
import { PrestamosService } from 'src/app/servicios/prestamos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ficha-prestamo',
  templateUrl: './ficha-prestamo.component.html',
  styleUrls: ['./ficha-prestamo.component.css']
})
export class FichaPrestamoComponent implements OnInit {

  nid_prestamo: string = '';
  prestamo: any;
  bCargado_Prestamo: boolean = false;

  bCargadas_Personas: boolean = false;
  bCargado_Inventario: boolean = false;

  lista_personas: any = [];
  lista_inventario: any = [];


  constructor(private servicesPrestamos: PrestamosService, private route: ActivatedRoute, private personaService: PersonasService, 
              private inventarioService: InventarioService) { 
    this.nid_prestamo = this.route.snapshot.params['nid_prestamo'];
  }

  peticion_obtener_prestamo =
  {
    next: (respuesta: any) => {
      this.prestamo = respuesta['prestamo'];
      this.bCargado_Prestamo = true;
    }
  }

  peticion_obtener_persona ={
   next: (respuesta: any) => {
     this.lista_personas = respuesta['personas'];
     this.bCargadas_Personas = true;
   } 
  }


  peticion_obtener_inventario =
  {
    next: (respuesta: any) => {
      this.lista_inventario = respuesta['inventarios'];
      this.bCargado_Inventario = true;
    }
  }

  peticion_actualizar_prestamo =
  {
    next: (respuesta: any) => {
      Swal.fire({
        title: 'Correcto',
        text: 'Se ha actualizado correctamente',
        icon: 'success',
        confirmButtonText: 'Aceptar'
      });
    },
    error: (error: any) => {
      Swal.fire({
        title: 'Error',
        text: 'Ha ocurrido un error',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
    }
  }

  ngOnInit(): void {
    this.servicesPrestamos.obtener_prestamo(this.nid_prestamo).subscribe(this.peticion_obtener_prestamo);
    this.personaService.obtener_lista_personas().subscribe(this.peticion_obtener_persona);
    this.inventarioService.obtener_inventarios().subscribe(this.peticion_obtener_inventario);
  }

  guardar()
  {
    this.servicesPrestamos.actualizar_prestamo(this.prestamo.nid_prestamo, this.prestamo.nid_persona, 
              this.prestamo.nid_inventario, this.prestamo.fecha_inicio, this.prestamo.fecha_fin).subscribe(this.peticion_actualizar_prestamo);
  }

}
