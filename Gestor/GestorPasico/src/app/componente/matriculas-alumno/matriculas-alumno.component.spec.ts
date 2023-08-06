import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatriculasAlumnoComponent } from './matriculas-alumno.component';

describe('MatriculasAlumnoComponent', () => {
  let component: MatriculasAlumnoComponent;
  let fixture: ComponentFixture<MatriculasAlumnoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MatriculasAlumnoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatriculasAlumnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
