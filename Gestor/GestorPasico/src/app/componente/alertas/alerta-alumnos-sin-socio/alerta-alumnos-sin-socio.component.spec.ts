import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertaAlumnosSinSocioComponent } from './alerta-alumnos-sin-socio.component';

describe('AlertaAlumnosSinSocioComponent', () => {
  let component: AlertaAlumnosSinSocioComponent;
  let fixture: ComponentFixture<AlertaAlumnosSinSocioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlertaAlumnosSinSocioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlertaAlumnosSinSocioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
