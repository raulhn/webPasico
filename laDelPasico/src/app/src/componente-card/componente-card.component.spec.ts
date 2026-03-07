import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponenteCardComponent } from './componente-card.component';

describe('ComponenteCardComponent', () => {
  let component: ComponenteCardComponent;
  let fixture: ComponentFixture<ComponenteCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponenteCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComponenteCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
