import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from 'src/app/providers/api.service';
import { configService } from 'src/app/providers/config/config';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-weekly-report-list',
  templateUrl: './weekly-report-list.component.html',
  styleUrls: ['./weekly-report-list.component.scss'],
})
export class WeeklyReportListComponent implements OnInit {
  config: any;
  limit: number = 5;
  pageIndex: number = 1;
  respData: any = [];
  resultCount: any;
  ind: number = 1;
  fromDate: any;
  toDate: any;

  constructor(
    private configService: configService,
    private api: ApiService,
    private router: Router,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private spinner: NgxSpinnerService
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
    
  }
  loginBuildForm() {
    this.searchForm = this.fb.group({
      fromDate: ['', Validators.required],
      toDate: ['', Validators.required],
    });
  }
  validateDates(formGroup: FormGroup): boolean {
    const startDate = formGroup.get('fromDate').value;
    const endDate = formGroup.get('toDate').value;
    return endDate < startDate;
  }
  onClear() {
    this.searchForm.reset();
    this.getData();
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
    console.log(this.searchForm.value);
    this.api
      .get(
        this.config.routes.weeklyReport +
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
            console.log(this.respData);
            console.log('api called');
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
  pageChange(event: number) {
    this.pageIndex = event;
    this.fromDate = this.searchForm.value.fromDate;
    this.toDate = this.searchForm.value.toDate;
    let fromDateFormat =
      this.datePipe.transform(this.fromDate, 'yyyy-MM-dd') || '';
    let toDateFormat = this.datePipe.transform(this.toDate, 'yyyy-MM-dd') || '';
    console.log('this.pageIndex', this.pageIndex);
    this.ind = (this.pageIndex - 1) * this.limit + 1;

    console.log('ind', this.ind);
    this.api
      .get(
        this.config.routes.weeklyReport +
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
            console.log('resultCount', this.resultCount);
            console.log('api called');
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
        this.config.routes.weeklyReport +
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
            console.log('data',this.respData);
            console.log('api called');
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
  reportView(activityID) {
    // window.open("/week-plan-view/"+activityID, "_blank");
    this.router.navigate(['week-report-view/' + activityID]);
  }
}
