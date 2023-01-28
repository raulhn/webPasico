import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarComponentePaginasComponent } from './editar-componente-paginas.component';

describe('EditarComponentePaginasComponent', () => {
  let component: EditarComponentePaginasComponent;
  let fixture: ComponentFixture<EditarComponentePaginasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditarComponentePaginasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarComponentePaginasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
