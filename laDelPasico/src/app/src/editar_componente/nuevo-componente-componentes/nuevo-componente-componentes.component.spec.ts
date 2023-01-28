import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevoComponenteComponentesComponent } from './nuevo-componente-componentes.component';

describe('NuevoComponenteComponentesComponent', () => {
  let component: NuevoComponenteComponentesComponent;
  let fixture: ComponentFixture<NuevoComponenteComponentesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NuevoComponenteComponentesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NuevoComponenteComponentesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
