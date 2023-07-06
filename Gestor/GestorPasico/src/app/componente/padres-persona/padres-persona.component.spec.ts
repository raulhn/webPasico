import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PadresPersonaComponent } from './padres-persona.component';

describe('PadresPersonaComponent', () => {
  let component: PadresPersonaComponent;
  let fixture: ComponentFixture<PadresPersonaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PadresPersonaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PadresPersonaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
