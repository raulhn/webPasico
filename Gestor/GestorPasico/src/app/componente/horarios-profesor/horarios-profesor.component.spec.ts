import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HorariosProfesorComponent } from './horarios-profesor.component';

describe('HorariosProfesorComponent', () => {
  let component: HorariosProfesorComponent;
  let fixture: ComponentFixture<HorariosProfesorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HorariosProfesorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HorariosProfesorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
