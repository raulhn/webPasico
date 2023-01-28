import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentePaginasComponent } from './componente-paginas.component';

describe('ComponentePaginasComponent', () => {
  let component: ComponentePaginasComponent;
  let fixture: ComponentFixture<ComponentePaginasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComponentePaginasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComponentePaginasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
