import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioPreinscripcionPedaniaComponent } from './formulario-preinscripcion-pedania.component';

describe('FormularioPreinscripcionPedaniaComponent', () => {
  let component: FormularioPreinscripcionPedaniaComponent;
  let fixture: ComponentFixture<FormularioPreinscripcionPedaniaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormularioPreinscripcionPedaniaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormularioPreinscripcionPedaniaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
