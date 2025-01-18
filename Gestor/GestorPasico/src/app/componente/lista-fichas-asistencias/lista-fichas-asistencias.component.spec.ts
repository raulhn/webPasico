import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaFichasAsistenciasComponent } from './lista-fichas-asistencias.component';

describe('ListaFichasAsistenciasComponent', () => {
  let component: ListaFichasAsistenciasComponent;
  let fixture: ComponentFixture<ListaFichasAsistenciasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListaFichasAsistenciasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaFichasAsistenciasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
