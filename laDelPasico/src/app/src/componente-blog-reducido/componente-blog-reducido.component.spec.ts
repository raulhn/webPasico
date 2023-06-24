import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponenteBlogReducidoComponent } from './componente-blog-reducido.component';

describe('ComponenteBlogReducidoComponent', () => {
  let component: ComponenteBlogReducidoComponent;
  let fixture: ComponentFixture<ComponenteBlogReducidoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComponenteBlogReducidoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComponenteBlogReducidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
