import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioPreinscripcionComponent } from './formulario-preinscripcion.component';

describe('FormularioPreinscripcionComponent', () => {
  let component: FormularioPreinscripcionComponent;
  let fixture: ComponentFixture<FormularioPreinscripcionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormularioPreinscripcionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormularioPreinscripcionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
