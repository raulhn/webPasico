import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarComponenteVideoComponent } from './editar-componente-video.component';

describe('EditarComponenteVideoComponent', () => {
  let component: EditarComponenteVideoComponent;
  let fixture: ComponentFixture<EditarComponenteVideoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditarComponenteVideoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarComponenteVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
