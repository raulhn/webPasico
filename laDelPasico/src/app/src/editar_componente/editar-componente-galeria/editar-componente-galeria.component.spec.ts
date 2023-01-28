import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarComponenteGaleriaComponent } from './editar-componente-galeria.component';


describe('EditarComponenteGaleriaComponent', () => {
  let component: EditarComponenteGaleriaComponent;
  let fixture: ComponentFixture<EditarComponenteGaleriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditarComponenteGaleriaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarComponenteGaleriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
