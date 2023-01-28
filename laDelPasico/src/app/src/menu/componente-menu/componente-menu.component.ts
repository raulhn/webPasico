import { analyzeAndValidateNgModules } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { MenuService } from 'src/app/servicios/menu.service';
import { UsuariosService } from 'src/app/servicios/usuarios.service';
import { Menu } from '../../logica/menu';
import { Router } from '@angular/router';

//https://sweetalert2.github.io/#declarative-templates
import Swal from 'sweetalert2';

import { faTwitter, faInstagram, faFacebook } from '@fortawesome/free-brands-svg-icons';
import { faFloppyDisk, faPen, faX, faArrowDown, faArrowUp, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Constantes } from '../../logica/constantes';



@Component({
  selector: 'app-componente-menu',
  templateUrl: './componente-menu.component.html',
  styleUrls: ['./componente-menu.component.css']
})
export class ComponenteMenuComponent implements OnInit {
  menu_completo: Menu[][] = [];
  menu_url: String[] = [];

  esAdministrador: boolean = false;
  modoEdicion: boolean = false;

  usuario: string = '';
  esLogueado: boolean = false;

  nombre_menu: string = '';

  faTwitter = faTwitter;
  faFacebook = faFacebook;
  faInstagram = faInstagram;

  faArrowDown = faArrowDown;
  faArrowUp = faArrowUp;

  faPen = faPen;
  faXmark = faX;
  faPlus = faPlus;


  opcion_menu: string ='';
  tipo_menu: number = 0;
  
  bCargado: Promise<boolean>|null = null;



  constructor(private menuService: MenuService, private usuarioService: UsuariosService, private router: Router) { 
   
  }

 

  private iniciar_menu(menu: Menu[]):void{
    this.menu_completo[0] = menu;


    for (let i = 0; i < menu.length; i++)
    {

      this.menuService.obtenerMenu(menu[i].nid).subscribe((res: any) => {
        var menu_aux:Menu[];
        menu_aux =res.data;
        this.menu_completo[menu[i].nid] = res.data;
        
        if(menu_aux.length == 0 && i + 1 == menu.length)
        {
          this.bCargado = Promise.resolve(true);
        }
        for (var menu_item of menu_aux)
        {
          console.log(menu_item.nid);
           this.menuService.obtiene_url(menu_item.nid).subscribe((res:any) => 
          {
            console.log(res);
            if(!res.error)
            {

              this.menu_url[res.id_menu] = res.url;

              // Se considera que se ha terminado de recuperar cuando se ha recuperado la url del último item del menu, aunque eso no sea realmente asi
              if(menu[i].nid ==  menu[menu.length -1].nid && menu_aux[menu_aux.length - 1].nid == res.id_menu)
              {
                
                this.bCargado = Promise.resolve(true);
              }
            }
          }

          );
        }

      }
      );
     
    }
 
  }

  ngOnInit(): void {
    let respuesta_: any= [];
    let datos: any[];
    this.menuService.obtenerMenu(0).subscribe((res: any) => { console.log(res); this.iniciar_menu(res.data); });

    
    this.usuarioService.logueado_administrador().subscribe((res) =>{
        console.log('Admin');
        console.log(res);
        this.esAdministrador = res.administrador;
    });

    this.usuarioService.logueado().subscribe(respuesta => {
      
        if (respuesta.logueado)
        {
          this.esLogueado = true;
          console.log(respuesta.usuario);
          this.usuario = respuesta.usuario;
        }

    });

    }

    logout()
    {
      this.usuarioService.logout().subscribe(res => { if (!res.error) {this.router.navigate(['']).then(() => {window.location.reload();});}});
    }


    crear_menu(id_padre: any)
    {
      Swal.fire({
        title: 'Crear página',
        html : `<input type="text" id="nombre_menu" class="swal2-input" placeholder="Username">
                <select id="tipo_menu" class="swal2-select">
                  <option value="1">General </option>
                </select>`,
        confirmButtonText: 'Crear',
        focusConfirm: false,
        preConfirm: () => {
          this.nombre_menu = (<HTMLInputElement>document.getElementById("nombre_menu")).value;
          this.tipo_menu = Number((<HTMLInputElement>document.getElementById("tipo_menu")).value);

        }
      }).then(
        () =>
        {
          this.menuService.registrarMenu(this.nombre_menu, id_padre, this.tipo_menu, '').subscribe((res) => {console.log(res); window.location.reload();});
          
        }
      )

    }

    incrementa_orden(nOrden: number)
    {
      var nSustituye = nOrden -1;
      var html_sustituye =  document.getElementById("menu_" + nSustituye) as HTMLInputElement;
      var html_orden = document.getElementById("menu_" + nOrden) as HTMLInputElement;
    
      var html_aux = html_sustituye.value;

      html_sustituye.value = html_orden.value;
      html_orden.value = html_aux;
    }

    obtiene_url(id: number)
    {
      return this.menu_url[id];
    }

    eliminar_menu(id_menu: number)
    {
      this.menuService.eliminarMenu(id_menu).subscribe(
        (res:any) =>
        {
          if(!res.error)
          {
            window.location.reload();
          }
        }
      )
    }

    actualizar_titulo_menu(id_menu: number)
    {
      let nuevo_titulo: string;
      Swal.fire({
        title: 'Cambiar titulo',
        html : `<input type="text" id="nuevo_titulo" class="swal2-input" />`,
        confirmButtonText: 'Guadar',
        focusConfirm: false,
        preConfirm: () => {
          nuevo_titulo = (<HTMLInputElement>document.getElementById("nuevo_titulo")).value;
        }
      }).then(
        () =>
        {
          this.menuService.actualizar_titulo_menu(id_menu, nuevo_titulo).subscribe((res) => {console.log(res); window.location.reload();});
        }
      )
    }

    /**
     * Muestra los botones y elementos para editar el menu
     */
    activar_edicion()
    {
      this.modoEdicion = true;
    }

    desactivar_edicion()
    {
      this.modoEdicion = false;
    }
}
