import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FichaInventarioComponent } from './ficha-inventario.component';

describe('FichaInventarioComponent', () => {
  let component: FichaInventarioComponent;
  let fixture: ComponentFixture<FichaInventarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FichaInventarioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FichaInventarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
