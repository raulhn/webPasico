import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarComponenteCardComponent } from './editar-componente-card.component';

describe('EditarComponenteCardComponent', () => {
  let component: EditarComponenteCardComponent;
  let fixture: ComponentFixture<EditarComponenteCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarComponenteCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarComponenteCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
