import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroMatriculaComponent } from './registro-matricula.component';

describe('RegistroMatriculaComponent', () => {
  let component: RegistroMatriculaComponent;
  let fixture: ComponentFixture<RegistroMatriculaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistroMatriculaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistroMatriculaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
