import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FichaAsistenciaComponent } from './ficha-asistencia.component';

describe('FichaAsistenciaComponent', () => {
  let component: FichaAsistenciaComponent;
  let fixture: ComponentFixture<FichaAsistenciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FichaAsistenciaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FichaAsistenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
