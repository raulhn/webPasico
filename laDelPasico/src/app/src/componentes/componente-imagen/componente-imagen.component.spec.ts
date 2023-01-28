import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponenteImagenComponent } from './componente-imagen.component';

describe('ComponenteImagenComponent', () => {
  let component: ComponenteImagenComponent;
  let fixture: ComponentFixture<ComponenteImagenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComponenteImagenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComponenteImagenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
