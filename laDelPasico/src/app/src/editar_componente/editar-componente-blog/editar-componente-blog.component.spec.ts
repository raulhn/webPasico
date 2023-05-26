import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarComponenteBlogComponent } from './editar-componente-blog.component';

describe('EditarComponenteBlogComponent', () => {
  let component: EditarComponenteBlogComponent;
  let fixture: ComponentFixture<EditarComponenteBlogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditarComponenteBlogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarComponenteBlogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
