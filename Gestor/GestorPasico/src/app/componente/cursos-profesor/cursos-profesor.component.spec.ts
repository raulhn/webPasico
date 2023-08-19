import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CursosProfesorComponent } from './cursos-profesor.component';

describe('CursosProfesorComponent', () => {
  let component: CursosProfesorComponent;
  let fixture: ComponentFixture<CursosProfesorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CursosProfesorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CursosProfesorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
