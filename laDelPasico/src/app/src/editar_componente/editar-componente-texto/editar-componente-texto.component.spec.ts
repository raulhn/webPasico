import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarComponenteTextoComponent } from './editar-componente-texto.component';

describe('EditarComponenteTextoComponent', () => {
  let component: EditarComponenteTextoComponent;
  let fixture: ComponentFixture<EditarComponenteTextoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditarComponenteTextoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarComponenteTextoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
