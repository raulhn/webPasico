import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponenteMenuComponent } from './componente-menu.component';

describe('ComponenteMenuComponent', () => {
  let component: ComponenteMenuComponent;
  let fixture: ComponentFixture<ComponenteMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComponenteMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComponenteMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
