import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MadresPersonaComponent } from './madres-persona.component';

describe('MadresPersonaComponent', () => {
  let component: MadresPersonaComponent;
  let fixture: ComponentFixture<MadresPersonaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MadresPersonaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MadresPersonaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
