import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BandaTitularComponent } from './banda-titular.component';

describe('BandaTitularComponent', () => {
  let component: BandaTitularComponent;
  let fixture: ComponentFixture<BandaTitularComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BandaTitularComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BandaTitularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
