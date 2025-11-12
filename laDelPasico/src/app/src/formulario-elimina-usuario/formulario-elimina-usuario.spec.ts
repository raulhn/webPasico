import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioEliminaUsuario } from './formulario-elimina-usuario';

describe('FormularioEliminaUsuario', () => {
  let component: FormularioEliminaUsuario;
  let fixture: ComponentFixture<FormularioEliminaUsuario>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormularioEliminaUsuario]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormularioEliminaUsuario);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
