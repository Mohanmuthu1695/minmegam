import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { RegionComponent } from './region/region.component';
import { LayoutComponent } from './layout/layout.component';
import { RegionListComponent } from './region-list/region-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegionRegisterComponent } from './region-register/region-register.component';
import { RegionViewComponent } from './region-view/region-view.component';
import { PeopleListComponent } from './people-list/people-list.component';
import { PeopleCreateComponent } from './people-create/people-create.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { CustomerCreateComponent } from './customer-create/customer-create.component';
import { PeopleEditComponent } from './people-edit/people-edit.component';
import { PeopleViewComponent } from './people-view/people-view.component';
import { CustomerViewComponent } from './customer-view/customer-view.component';
import { CustomerEditComponent } from './customer-edit/customer-edit.component';
import { HttpClientModule } from '@angular/common/http';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { NgxPaginationModule } from 'ngx-pagination';
import { WeekPlanListComponent } from './week-plan-list/week-plan-list.component';
import { WeekPlanViewComponent } from './week-plan-view/week-plan-view.component';
import { WeeklyReportListComponent } from './weekly-report-list/weekly-report-list.component';
import { WeeklyReportViewComponent } from './weekly-report-view/weekly-report-view.component';
import { SalesActivityComponent } from './sales-activity/sales-activity.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialogModule } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { WeeklyPlanComponent } from '../weekly-plan/weekly-plan.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ReccomendationComponent } from './reccomendation/reccomendation.component';
import { HeaderComponent } from './layout/header/header.component';



@NgModule({
  declarations: [
    RegionComponent,
    LayoutComponent,
    RegionListComponent,
    RegionRegisterComponent,
    RegionViewComponent,
    PeopleListComponent,
    PeopleCreateComponent,
    CustomerListComponent,
    CustomerCreateComponent,
    PeopleEditComponent,
    PeopleViewComponent,
    CustomerViewComponent,
    CustomerEditComponent,
    WeekPlanListComponent,
    WeekPlanViewComponent,
    WeeklyReportListComponent,
    WeeklyReportViewComponent,
    SalesActivityComponent,
    WeeklyPlanComponent,
    ReccomendationComponent,
    HeaderComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    NgxSpinnerModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatIconModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatSidenavModule,
    MatButtonModule,
    MatDialogModule,
    MatRadioModule,
    MatPaginatorModule,
    MatSnackBarModule,
    MatDividerModule,
    BrowserModule,
    NgxPaginationModule,
    BsDatepickerModule.forRoot(),
  
  ],
})
export class AdminModule {}
