import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaInventariosComponent } from './lista-inventarios.component';

describe('ListaInventariosComponent', () => {
  let component: ListaInventariosComponent;
  let fixture: ComponentFixture<ListaInventariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListaInventariosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaInventariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
