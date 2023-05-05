import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeekPlanListComponent } from './week-plan-list.component';

describe('WeekPlanListComponent', () => {
  let component: WeekPlanListComponent;
  let fixture: ComponentFixture<WeekPlanListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WeekPlanListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WeekPlanListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
