import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FichaMatriculaComponent } from './ficha-matricula.component';

describe('FichaMatriculaComponent', () => {
  let component: FichaMatriculaComponent;
  let fixture: ComponentFixture<FichaMatriculaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FichaMatriculaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FichaMatriculaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
