import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatioButacasComponent } from './patio-butacas.component';

describe('PatioButacasComponent', () => {
  let component: PatioButacasComponent;
  let fixture: ComponentFixture<PatioButacasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatioButacasComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PatioButacasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
