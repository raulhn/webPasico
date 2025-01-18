import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreaFichaAsistenciaComponent } from './crea-ficha-asistencia.component';

describe('CreaFichaAsistenciaComponent', () => {
  let component: CreaFichaAsistenciaComponent;
  let fixture: ComponentFixture<CreaFichaAsistenciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreaFichaAsistenciaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreaFichaAsistenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
