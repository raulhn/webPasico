import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlateaComponent } from './platea.component';

describe('PlateaComponent', () => {
  let component: PlateaComponent;
  let fixture: ComponentFixture<PlateaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlateaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlateaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
