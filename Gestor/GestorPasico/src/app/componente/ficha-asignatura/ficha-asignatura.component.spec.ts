import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FichaAsignaturaComponent } from './ficha-asignatura.component';

describe('FichaAsignaturaComponent', () => {
  let component: FichaAsignaturaComponent;
  let fixture: ComponentFixture<FichaAsignaturaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FichaAsignaturaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FichaAsignaturaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
