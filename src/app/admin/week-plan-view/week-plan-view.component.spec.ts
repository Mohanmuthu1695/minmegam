import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeekPlanViewComponent } from './week-plan-view.component';

describe('WeekPlanViewComponent', () => {
  let component: WeekPlanViewComponent;
  let fixture: ComponentFixture<WeekPlanViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WeekPlanViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WeekPlanViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
