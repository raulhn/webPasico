import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FichaPersonaComponent } from './ficha-persona.component';

describe('FichaPersonaComponent', () => {
  let component: FichaPersonaComponent;
  let fixture: ComponentFixture<FichaPersonaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FichaPersonaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FichaPersonaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
