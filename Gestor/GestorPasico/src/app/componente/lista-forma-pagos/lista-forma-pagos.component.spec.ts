import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaFormaPagosComponent } from './lista-forma-pagos.component';

describe('ListaFormaPagosComponent', () => {
  let component: ListaFormaPagosComponent;
  let fixture: ComponentFixture<ListaFormaPagosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListaFormaPagosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaFormaPagosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
