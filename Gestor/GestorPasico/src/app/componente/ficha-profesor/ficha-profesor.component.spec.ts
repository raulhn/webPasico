import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FichaProfesorComponent } from './ficha-profesor.component';

describe('FichaProfesorComponent', () => {
  let component: FichaProfesorComponent;
  let fixture: ComponentFixture<FichaProfesorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FichaProfesorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FichaProfesorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
