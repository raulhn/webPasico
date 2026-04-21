import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgSelectorComponent } from './ng-selector.component';

describe('NgSelectorComponent', () => {
  let component: NgSelectorComponent;
  let fixture: ComponentFixture<NgSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgSelectorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NgSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
