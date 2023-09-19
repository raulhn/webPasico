import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoPreinscripcionesComponent } from './listado-preinscripciones.component';

describe('ListadoPreinscripcionesComponent', () => {
  let component: ListadoPreinscripcionesComponent;
  let fixture: ComponentFixture<ListadoPreinscripcionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListadoPreinscripcionesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListadoPreinscripcionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
