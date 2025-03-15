import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FichaPrestamoComponent } from './ficha-prestamo.component';

describe('FichaPrestamoComponent', () => {
  let component: FichaPrestamoComponent;
  let fixture: ComponentFixture<FichaPrestamoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FichaPrestamoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FichaPrestamoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
