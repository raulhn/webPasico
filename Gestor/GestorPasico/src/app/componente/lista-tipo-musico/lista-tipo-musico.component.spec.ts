import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaTipoMusicoComponent } from './lista-tipo-musico.component';
import { MenuComponent } from '../menu/menu.component';


describe('ListaTipoMusicoComponent', () => {
  let component: ListaTipoMusicoComponent;
  let fixture: ComponentFixture<ListaTipoMusicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaTipoMusicoComponent],
      declarations: [MenuComponent],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaTipoMusicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
