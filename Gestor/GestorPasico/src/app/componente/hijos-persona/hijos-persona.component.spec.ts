import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HijosPersonaComponent } from './hijos-persona.component';

describe('HijosPersonaComponent', () => {
  let component: HijosPersonaComponent;
  let fixture: ComponentFixture<HijosPersonaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HijosPersonaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HijosPersonaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
