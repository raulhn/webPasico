import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarComponenteImagenComponent } from './editar-componente-imagen.component';

describe('EditarComponenteImagenComponent', () => {
  let component: EditarComponenteImagenComponent;
  let fixture: ComponentFixture<EditarComponenteImagenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditarComponenteImagenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarComponenteImagenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
