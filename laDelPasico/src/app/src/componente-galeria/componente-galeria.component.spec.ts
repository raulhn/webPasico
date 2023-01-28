import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponenteGaleriaComponent } from './componente-galeria.component';

describe('ComponenteGaleriaComponent', () => {
  let component: ComponenteGaleriaComponent;
  let fixture: ComponentFixture<ComponenteGaleriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComponenteGaleriaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComponenteGaleriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
