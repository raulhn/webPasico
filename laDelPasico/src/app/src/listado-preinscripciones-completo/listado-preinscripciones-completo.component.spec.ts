import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoPreinscripcionesCompletoComponent } from './listado-preinscripciones-completo.component';

describe('ListadoPreinscripcionesCompletoComponent', () => {
  let component: ListadoPreinscripcionesCompletoComponent;
  let fixture: ComponentFixture<ListadoPreinscripcionesCompletoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListadoPreinscripcionesCompletoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListadoPreinscripcionesCompletoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
