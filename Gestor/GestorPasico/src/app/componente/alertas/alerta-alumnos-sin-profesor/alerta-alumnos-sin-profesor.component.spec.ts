import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertaAlumnosSinProfesorComponent } from './alerta-alumnos-sin-profesor.component';

describe('AlertaAlumnosSinProfesorComponent', () => {
  let component: AlertaAlumnosSinProfesorComponent;
  let fixture: ComponentFixture<AlertaAlumnosSinProfesorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlertaAlumnosSinProfesorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlertaAlumnosSinProfesorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
