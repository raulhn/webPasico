import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarCompomenteComponentesComponent } from './editar-compomente-componentes.component';

describe('EditarCompomenteComponentesComponent', () => {
  let component: EditarCompomenteComponentesComponent;
  let fixture: ComponentFixture<EditarCompomenteComponentesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditarCompomenteComponentesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarCompomenteComponentesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
