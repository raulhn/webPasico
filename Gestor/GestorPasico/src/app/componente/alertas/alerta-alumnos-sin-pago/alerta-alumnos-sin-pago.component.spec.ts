import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertaAlumnosSinPagoComponent } from './alerta-alumnos-sin-pago.component';

describe('AlertaAlumnosSinPagoComponent', () => {
  let component: AlertaAlumnosSinPagoComponent;
  let fixture: ComponentFixture<AlertaAlumnosSinPagoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlertaAlumnosSinPagoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlertaAlumnosSinPagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
