import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponenteComponenteComponent } from './componente-componente.component';

describe('ComponenteComponenteComponent', () => {
  let component: ComponenteComponenteComponent;
  let fixture: ComponentFixture<ComponenteComponenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComponenteComponenteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComponenteComponenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
