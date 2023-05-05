import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AdminModule } from './admin/admin.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ApiService } from './providers/api.service';
import { LoginComponent } from './auth/login/login.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { InterceptorInterceptor } from './providers/interceptor.interceptor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgxSpinnerModule } from 'ngx-spinner';
import { DatePipe } from '@angular/common';


@NgModule({
  declarations: [AppComponent, LoginComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AdminModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    NgxPaginationModule,
    NgxSpinnerModule,
    BsDatepickerModule.forRoot(),
 
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorInterceptor,
      multi: true,
    },
    // { provide: LocationStrategy, useClass: HashLocationStrategy },
    // {
    //   provide: RECAPTCHA_SETTINGS,
    //   useValue: {
    //     siteKey: '6LcQGDsbAAAAAC_3GAPQw_2d18m0SLdtzgyuuwvb',
    //   } as RecaptchaSettings,
    // },
    DatePipe
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
