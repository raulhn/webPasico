import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponenteComponentesComponent } from './componente-componentes.component';

describe('ComponenteComponentesComponent', () => {
  let component: ComponenteComponentesComponent;
  let fixture: ComponentFixture<ComponenteComponentesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComponenteComponentesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComponenteComponentesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
