import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {
  Router,
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
} from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from 'src/app/providers/api.service';
import { configService } from 'src/app/providers/config/config';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-week-plan-list',
  templateUrl: './week-plan-list.component.html',
  styleUrls: ['./week-plan-list.component.scss'],
})
export class WeekPlanListComponent implements OnInit {
  userIsAdmin: boolean = false;
  config: any;
  limit: number = 5;
  pageIndex: number = 1;
  respData: any = [];
  resultCount: number;
  ind: number = 1;
  fromDate: any;
  toDate: any;
  weeklyPlan: any = [];
  weeklyPlan1: any = [];
  recommendPlan: any[] = [];
  endDate: any;
  startDate: any;
  isCopied: boolean;
  getButtonLabel = 'Create';
  curerentweekStart: any;
  currentweekEnd: any;
  planstart1: any;
  planend1: any;
  constructor(
    private configService: configService,
    private api: ApiService,
    private router: Router,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,

    private datePipe: DatePipe
  ) {
    this.config = this.configService.config;
  }
  searchForm: FormGroup;
  ngOnInit(): void {
    this.loginBuildForm();
    this.getData();
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 500);
    this.getDateRange();
    // this.getrecommendPlan(this.startDate,this.endDate);
    // this. getDatas();
    let c = JSON.parse(localStorage.getItem('currentUser'));
    if (c.type == 'ADMIN') {
      this.userIsAdmin= false;
    } else if (c.type == 'IT') {
      this.userIsAdmin= true;
    ;
    } else if (c.type == 'SALES') {
      this.userIsAdmin= true;
  
    }
  }
  loginBuildForm() {
    this.searchForm = this.fb.group({
      fromDate: ['', Validators.required],
      toDate: ['', Validators.required],
    });
  }
  onClear() {
    this.searchForm.reset();
    this.getData();
  }
  validateDates(formGroup: FormGroup): boolean {
    const startDate = formGroup.get('fromDate').value;
    const endDate = formGroup.get('toDate').value;
    return endDate < startDate;
  }
  onSubmit() {
    if (this.validateDates(this.searchForm)) {
      Swal.fire({
        title: 'Error',
        text: 'To date cannot be less than from date',
        icon: 'error',
        confirmButtonText: 'Ok',
      });
      return;
    } else {
      (' fun');
    }
    if (this.searchForm.invalid) return;
    let fromDate = this.searchForm.value.fromDate;
    let toDate = this.searchForm.value.toDate;
    let fromDateFormat = this.datePipe.transform(fromDate, 'yyyy-MM-dd');
    let toDateFormat = this.datePipe.transform(toDate, 'yyyy-MM-dd');
    // console.log(this.searchForm.value);
    this.api
      .get(
        this.config.routes.weeklyPlan +
          '?page=' +
          this.pageIndex +
          '&limit=' +
          this.limit +
          '&fromDate=' +
          fromDateFormat +
          '&toDate=' +
          toDateFormat
      )
      .subscribe(
        (resp: any) => {
          try {
            this.respData = resp.data;
            this.resultCount = resp.allCount;
            // console.log(this.respData);
            // console.log('api called');
          } catch (err) {
            // console.log(err);
          }
        },
        (err) => {
          console.error(err);
        },
        () => console.log('hi')
      );
  }
  pageChange(event: number) {
    this.pageIndex = event;
    this.fromDate = this.searchForm.value.fromDate;
    this.toDate = this.searchForm.value.toDate;
    let fromDateFormat =
      this.datePipe.transform(this.fromDate, 'yyyy-MM-dd') || '';
    let toDateFormat = this.datePipe.transform(this.toDate, 'yyyy-MM-dd') || '';
    // console.log('this.pageIndex', this.pageIndex);
    this.ind = (this.pageIndex - 1) * this.limit + 1;

    // console.log('ind', this.ind);
    this.api
      .get(
        this.config.routes.weeklyPlan +
          '?page=' +
          this.pageIndex +
          '&limit=' +
          this.limit +
          '&fromDate=' +
          fromDateFormat +
          '&toDate=' +
          toDateFormat
      )
      .subscribe(
        (resp: any) => {
          try {
            this.respData = resp.data;
            this.resultCount = resp.allCount;
            // console.log(this.respData);
            // console.log('resultCount', this.resultCount);
            // console.log('api called');
          } catch (err) {
            console.log(err);
          }
        },
        (err) => {
          console.error(err);
        },
        () => console.log('hi')
      );
  }
  getData() {
    // console.log('pageIndex', this.pageIndex);

    this.api
      .get(
        this.config.routes.weeklyPlan +
          '?page=' +
          this.pageIndex +
          '&limit=' +
          this.limit
      )
      .subscribe(
        (resp: any) => {
          try {
            this.respData = resp.data;
            this.resultCount = resp.allCount;
            // console.log(this.respData);
            // console.log('api called');
          } catch (err) {
            console.log(err);
          }
        },
        (err) => {
          console.error(err);
        },
        () => console.log('hi')
      );
  }
  // customer plan list:
  planView(activityID) {
    // window.open("/week-plan-view/"+activityID, "_blank");
    this.router.navigate(['week-plan-view/' + activityID]);
  }

  // getrecommendPlan(startDate,endDate){

  //   this.api
  //   .get(
  //     this.config.routes.recommendPlan +'?fromDate='+startDate+'&toDate='+endDate )
  //   .subscribe((resp: any) => {
  //     this.recommendPlan = resp.data;

  //   });

  // }

  getDateRange() {
    this.api.get(this.config.routes.dateRange).subscribe((resp: any) => {
      this.startDate = resp.startDate;
      this.endDate = resp.endDate;
      console.log(this.startDate)
      console.log(this.endDate)

      // this.getrecommendPlan(this.startDate,this.endDate);
    });
  }



  weeklyCreate(){

    this.router.navigate(['/week-plan-create'])
  }

  getDatas() {
  this.api.get(this.config.routes.weeklyPlan).subscribe((resp: any) => {
    this.weeklyPlan1 = resp.data;
    const currentWeekStart = new Date(this.startDate);
    const currentWeekEnd = new Date(this.endDate);
    let isPlanCreated = false;

    if (resp.data.length === 0) {
      this.isCopied = false;
      this.router.navigate(['/week-plan-create']);
    }

    for (const plan of this.weeklyPlan1) {
      const planStart = new Date(plan.planStartDate);
      const planEnd = new Date(plan.planEndDate);

      if (
        planStart.getTime() === currentWeekStart.getTime() &&
        planEnd.getTime() === currentWeekEnd.getTime()
      ) {
        // Plan is within current week
        this.spinner.show();
        setTimeout(() => {
          this.spinner.hide();
        }, 400);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Plan Already Created!',
          showCancelButton: false,
          timer: 3000,
        });
        this.getButtonLabel = 'Plan Created';
        isPlanCreated = true;
        break;
      }
    }

    if (!isPlanCreated) {
      // Plan is outside of current week
      this.isCopied = false;
      this.router.navigate(['/week-plan-create'], {
        skipLocationChange: true,
      });
    } else {
      this.isCopied = true;
    }
  });
}

}
