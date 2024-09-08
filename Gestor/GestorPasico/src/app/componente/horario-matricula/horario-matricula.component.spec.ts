import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HorarioMatriculaComponent } from './horario-matricula.component';

describe('HorarioMatriculaComponent', () => {
  let component: HorarioMatriculaComponent;
  let fixture: ComponentFixture<HorarioMatriculaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HorarioMatriculaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HorarioMatriculaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
