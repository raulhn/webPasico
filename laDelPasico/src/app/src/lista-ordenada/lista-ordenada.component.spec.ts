import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaOrdenadaComponent } from './lista-ordenada.component';

describe('ListaOrdenadaComponent', () => {
  let component: ListaOrdenadaComponent;
  let fixture: ComponentFixture<ListaOrdenadaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListaOrdenadaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaOrdenadaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
