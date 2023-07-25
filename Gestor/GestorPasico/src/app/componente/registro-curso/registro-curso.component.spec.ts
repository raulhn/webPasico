import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroCursoComponent } from './registro-curso.component';

describe('RegistroCursoComponent', () => {
  let component: RegistroCursoComponent;
  let fixture: ComponentFixture<RegistroCursoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistroCursoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistroCursoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
