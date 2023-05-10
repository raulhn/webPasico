import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarComponenteCaruselComponent } from './editar-componente-carusel.component';

describe('EditarComponenteCaruselComponent', () => {
  let component: EditarComponenteCaruselComponent;
  let fixture: ComponentFixture<EditarComponenteCaruselComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditarComponenteCaruselComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarComponenteCaruselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
