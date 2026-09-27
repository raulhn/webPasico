import { Component, signal, OnInit } from '@angular/core';
import { CursosService } from '../../servicios/cursos.service';
@Component({
  selector: 'app-componente-cursos',
  standalone: false,
  templateUrl: './componente-cursos.component.html',
  styleUrl: './componente-cursos.component.css',
})
export class ComponenteCursosComponent implements OnInit {
  cursos = signal<any[]>([]);

  constructor(private cursosService: CursosService) {}

  ngOnInit(): void {
    this.cursosService.obtener_cursos().subscribe({
      next: (res: any) => {
        console.log(res);
        this.cursos.set(res.cursos);
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }

  insertarCurso(descripcion: string) {
    this.cursosService.registrar_curso(descripcion).subscribe({
      next: (res: any) => {
        console.log(res);
        this.cursosService.obtener_cursos().subscribe({
          next: (res: any) => {
            console.log(res);
            this.cursos.set(res.cursos);
          },
          error: (err: any) => {
            console.log(err);
          },
        });
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }

  activar_curso(nid_curso: string) {
    this.cursosService.activar_curso(nid_curso).subscribe({
      next: (res: any) => {
        console.log(res);
        this.cursosService.obtener_cursos().subscribe({
          next: (res: any) => {
            console.log(res);
            this.cursos.set(res.cursos);
          },
          error: (err: any) => {
            console.log(err);
          },
        });
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }
}
