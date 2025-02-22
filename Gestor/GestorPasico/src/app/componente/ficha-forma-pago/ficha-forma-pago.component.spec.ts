import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FichaFormaPagoComponent } from './ficha-forma-pago.component';

describe('FichaFormaPagoComponent', () => {
  let component: FichaFormaPagoComponent;
  let fixture: ComponentFixture<FichaFormaPagoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FichaFormaPagoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FichaFormaPagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
