import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BloqueButacasComponent } from './bloque-butacas.component';

describe('BloqueButacasComponent', () => {
  let component: BloqueButacasComponent;
  let fixture: ComponentFixture<BloqueButacasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BloqueButacasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BloqueButacasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
