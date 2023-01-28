import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponenteVideoComponent } from './componente-video.component';

describe('ComponenteVideoComponent', () => {
  let component: ComponenteVideoComponent;
  let fixture: ComponentFixture<ComponenteVideoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComponenteVideoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComponenteVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
