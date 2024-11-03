import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroMusicoComponent } from './registro-musico.component';

describe('RegistroMusicoComponent', () => {
  let component: RegistroMusicoComponent;
  let fixture: ComponentFixture<RegistroMusicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistroMusicoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistroMusicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
