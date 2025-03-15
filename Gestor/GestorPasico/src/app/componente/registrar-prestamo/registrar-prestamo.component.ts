import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InventarioService } from 'src/app/servicios/inventario.service';
import { PersonasService } from 'src/app/servicios/personas.service';
import { PrestamosService } from 'src/app/servicios/prestamos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registrar-prestamo',
  templateUrl: './registrar-prestamo.component.html',
  styleUrls: ['./registrar-prestamo.component.css']
})
export class RegistrarPrestamoComponent implements OnInit{

  lista_personas: any;
  lista_inventario: any;

  bCargadasPersonas: boolean = false;
  bCargadoInventario: boolean = false;

  persona_seleccionada: string = "";
  inventario_seleccionado: string = "";

  fecha_inicio: string ="";

  constructor(private personasService: PersonasService, private inventarioService: InventarioService, 
              private prestamosServices: PrestamosService, private router : Router)
  {}


  peticion_obtener_personas=
  {
    next: (respuesta: any) =>
    {
      this.lista_personas = respuesta.personas;
      this.bCargadasPersonas = true;
    }
  }

  peticion_obtener_inventarios =
  {
    next: (respuesta: any) =>
    {
      this.lista_inventario = respuesta.inventarios
      this.bCargadoInventario = true;
    }
  }
  ngOnInit(): void {
    this.personasService.obtener_lista_personas().subscribe(this.peticion_obtener_personas);
    this.inventarioService.obtener_inventarios().subscribe(this.peticion_obtener_inventarios);
  }

  comparePersona(item: any, selected: any) {
    return item['nid'] == selected;
  }

  compareInventario(item: any, selected: any) {
    return item['nid_inventario'] == selected;
  }

  peticion_registrar_inventario =
  {
      next: (respuesta: any) =>
      {
          Swal.fire({
            icon: 'success',
            title: 'Registro correcto',
            text: 'Se ha registrado correctamente'
          }).then( () =>
            {
              this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
                {
                  this.router.navigate(['/ficha_prestamo/' + respuesta.nid_prestamo]);
                }
              )
            }
          )
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

  registrar_inventario()
  {
    this.prestamosServices.registrar_prestamo(this.persona_seleccionada, this.inventario_seleccionado, this.fecha_inicio).subscribe(this.peticion_registrar_inventario)
  }

}
