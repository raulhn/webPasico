import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleRemesaComponent } from './detalle-remesa.component';

describe('DetalleRemesaComponent', () => {
  let component: DetalleRemesaComponent;
  let fixture: ComponentFixture<DetalleRemesaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetalleRemesaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalleRemesaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
