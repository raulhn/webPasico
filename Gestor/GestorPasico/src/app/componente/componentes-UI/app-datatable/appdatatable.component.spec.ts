import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppDataTableComponent } from './appdatatable.component';

/** Utility to generate dummy rows for testing. */
function generateData(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `Name${i + 1}`,
  }));
}

describe('DataTableComponent', () => {
  let component: AppDataTableComponent;
  let fixture: ComponentFixture<AppDataTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppDataTableComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(AppDataTableComponent);
    component = fixture.componentInstance;
  });
});
