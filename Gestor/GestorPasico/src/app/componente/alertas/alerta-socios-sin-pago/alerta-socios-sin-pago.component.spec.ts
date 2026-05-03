import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertaSociosSinPagoComponent } from './alerta-socios-sin-pago.component';

describe('AlertaSociosSinPagoComponent', () => {
  let component: AlertaSociosSinPagoComponent;
  let fixture: ComponentFixture<AlertaSociosSinPagoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlertaSociosSinPagoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlertaSociosSinPagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
