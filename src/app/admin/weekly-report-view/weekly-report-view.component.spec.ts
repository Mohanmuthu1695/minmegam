import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeeklyReportViewComponent } from './weekly-report-view.component';

describe('WeeklyReportViewComponent', () => {
  let component: WeeklyReportViewComponent;
  let fixture: ComponentFixture<WeeklyReportViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WeeklyReportViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WeeklyReportViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
