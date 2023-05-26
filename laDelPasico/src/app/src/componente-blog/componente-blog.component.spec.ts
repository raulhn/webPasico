import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponenteBlogComponent } from './componente-blog.component';

describe('ComponenteBlogComponent', () => {
  let component: ComponenteBlogComponent;
  let fixture: ComponentFixture<ComponenteBlogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComponenteBlogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComponenteBlogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
