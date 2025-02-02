import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearFichaInventarioComponent } from './crear-ficha-inventario.component';

describe('CrearFichaInventarioComponent', () => {
  let component: CrearFichaInventarioComponent;
  let fixture: ComponentFixture<CrearFichaInventarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrearFichaInventarioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearFichaInventarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
