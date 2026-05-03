import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertaGeneralComponent } from './alerta-general.component';

describe('AlertaGeneralComponent', () => {
  let component: AlertaGeneralComponent;
  let fixture: ComponentFixture<AlertaGeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlertaGeneralComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlertaGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
