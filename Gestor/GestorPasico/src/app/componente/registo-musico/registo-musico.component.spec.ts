import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistoMusicoComponent } from './registo-musico.component';

describe('RegistoMusicoComponent', () => {
  let component: RegistoMusicoComponent;
  let fixture: ComponentFixture<RegistoMusicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistoMusicoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistoMusicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
