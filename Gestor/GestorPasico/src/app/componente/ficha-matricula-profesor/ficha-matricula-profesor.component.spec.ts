import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FichaMatriculaProfesorComponent } from './ficha-matricula-profesor.component';

describe('FichaMatriculaProfesorComponent', () => {
  let component: FichaMatriculaProfesorComponent;
  let fixture: ComponentFixture<FichaMatriculaProfesorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FichaMatriculaProfesorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FichaMatriculaProfesorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
