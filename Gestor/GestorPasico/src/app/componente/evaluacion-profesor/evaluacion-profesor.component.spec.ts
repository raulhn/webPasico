import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluacionProfesorComponent } from './evaluacion-profesor.component';

describe('EvaluacionProfesorComponent', () => {
  let component: EvaluacionProfesorComponent;
  let fixture: ComponentFixture<EvaluacionProfesorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EvaluacionProfesorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EvaluacionProfesorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
