import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioPreinscripcionTorrePachecoComponent } from './formulario-preinscripcion-torre-pacheco.component';

describe('FormularioPreinscripcionTorrePachecoComponent', () => {
  let component: FormularioPreinscripcionTorrePachecoComponent;
  let fixture: ComponentFixture<FormularioPreinscripcionTorrePachecoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormularioPreinscripcionTorrePachecoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormularioPreinscripcionTorrePachecoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
