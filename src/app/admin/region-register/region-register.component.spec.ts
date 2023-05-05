import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegionRegisterComponent } from './region-register.component';

describe('RegionRegisterComponent', () => {
  let component: RegionRegisterComponent;
  let fixture: ComponentFixture<RegionRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegionRegisterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegionRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
