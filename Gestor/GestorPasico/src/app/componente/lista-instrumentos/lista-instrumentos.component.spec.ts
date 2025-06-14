import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaInstrumentosComponent } from './lista-instrumentos.component';

describe('ListaInstrumentosComponent', () => {
  let component: ListaInstrumentosComponent;
  let fixture: ComponentFixture<ListaInstrumentosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaInstrumentosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaInstrumentosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
