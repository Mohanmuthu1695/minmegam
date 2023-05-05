import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeeklyReportListComponent } from './weekly-report-list.component';

describe('WeeklyReportListComponent', () => {
  let component: WeeklyReportListComponent;
  let fixture: ComponentFixture<WeeklyReportListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WeeklyReportListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WeeklyReportListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
