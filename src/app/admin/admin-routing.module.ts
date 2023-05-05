import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../providers/auth.guard';
import { CustomerCreateComponent } from './customer-create/customer-create.component';
import { CustomerEditComponent } from './customer-edit/customer-edit.component';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { CustomerViewComponent } from './customer-view/customer-view.component';
import { LayoutComponent } from './layout/layout.component';
import { PeopleCreateComponent } from './people-create/people-create.component';
import { PeopleEditComponent } from './people-edit/people-edit.component';
import { PeopleListComponent } from './people-list/people-list.component';
import { PeopleViewComponent } from './people-view/people-view.component';
import { RegionListComponent } from './region-list/region-list.component';
import { RegionRegisterComponent } from './region-register/region-register.component';
import { RegionViewComponent } from './region-view/region-view.component';
import { RegionComponent } from './region/region.component';
import { WeekPlanListComponent } from './week-plan-list/week-plan-list.component';
import { WeekPlanViewComponent } from './week-plan-view/week-plan-view.component';
import { WeeklyReportListComponent } from './weekly-report-list/weekly-report-list.component';
import { WeeklyReportViewComponent } from './weekly-report-view/weekly-report-view.component';
import { SalesActivityComponent } from './sales-activity/sales-activity.component';
import { WeeklyPlanComponent } from '../weekly-plan/weekly-plan.component';
import { ReccomendationComponent } from './reccomendation/reccomendation.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', component: RegionListComponent },
      { path: 'region-register', component: RegionRegisterComponent },
      { path: 'region-list', component: RegionListComponent },
      { path: 'region-create/:id', component: RegionComponent },
      { path: 'region-view/:id', component: RegionViewComponent },
      { path: 'people-list', component: PeopleListComponent },
      { path: 'people-create', component: PeopleCreateComponent },
      { path: 'people-edit/:id', component: PeopleEditComponent },
      { path: 'people-view/:id', component: PeopleViewComponent },
      { path: 'customer-list', component: CustomerListComponent },
      { path: 'customer-create', component: CustomerCreateComponent },
      { path: 'customer-view/:id', component: CustomerViewComponent },
      { path: 'customer-edit/:id', component: CustomerEditComponent },
      { path: 'week-plan-list', component: WeekPlanListComponent },
      { path: 'week-plan-view/:id', component: WeekPlanViewComponent },
      { path: 'week-report-list', component: WeeklyReportListComponent },
      { path: 'week-report-view/:id', component: WeeklyReportViewComponent },
      { path: 'week-plan-create', component: WeeklyPlanComponent },

      { path: 'sales-activity', component: SalesActivityComponent },
      {path:'recommendation-list',component:ReccomendationComponent}
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
