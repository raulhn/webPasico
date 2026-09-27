import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponenteCursosComponent } from './componente-cursos.component';

describe('ComponenteCursosComponent', () => {
  let component: ComponenteCursosComponent;
  let fixture: ComponentFixture<ComponenteCursosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponenteCursosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComponenteCursosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
