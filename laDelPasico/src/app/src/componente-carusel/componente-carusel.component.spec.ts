import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponenteCaruselComponent } from './componente-carusel.component';

describe('ComponenteCaruselComponent', () => {
  let component: ComponenteCaruselComponent;
  let fixture: ComponentFixture<ComponenteCaruselComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComponenteCaruselComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComponenteCaruselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
