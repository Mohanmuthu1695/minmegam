import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from 'src/app/providers/api.service';
import { configService } from 'src/app/providers/config/config';

import Swal from 'sweetalert2';
enum status {
  Appointment = 'appointment',
  CallNextWeek = 'Call Next Week',
  CallBack = 'Call Back',
  Demo = 'Demo',
  FollowUp = 'FollowUp',
  Meeting = 'Meeting',
  NotNeeded = 'Not Needed',
  VisitNextWeek = 'Visit Next Week',
  Trail = 'Trail',
}
@Component({
  selector: 'app-week-plan-view',
  templateUrl: './week-plan-view.component.html',
  styleUrls: ['./week-plan-view.component.scss'],
})
export class WeekPlanViewComponent implements OnInit {
  getstatus:any=[]
  statusOptions: string[] = Object.values(status);
  submit: boolean;
  activityForm: FormGroup;
  config: any;
  weeklyPlanCreate: any = [];
  panId: string;
  planId: string;
  cusID: any;
  tempCusID: any;
  minDate: Date;
  fromTo:FormGroup
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private api: ApiService,
    private configService: configService,
    private modalService: NgbModal,
    private fb: FormBuilder
  ) {
    this.config = configService.config;
    this.minDate = new Date();
    this.minDate.setDate(this.minDate.getDate() - 0);
    this.fromTo=new FormGroup({
      planStartDate:new FormControl(),
      planEndDate:new FormControl()
    })
  }

  ngOnInit(): void {
    this.submit = false;
    this.getweeklyPlanView();
    this.getStatus();
    
  }
  onBack() {
    this.router.navigate(['/week-plan-list']);
  }
  loginBuildForm() {
    this.activityForm = this.fb.group({
      status: ['', Validators.required],
      nextActionDate: [null],
      notes: ['', Validators.required],
    });
  }
  get f() {
    return this.activityForm.controls;
  }
  open(content, cusId) {
    this.tempCusID = cusId;
    this.ngOnInit();
    this.loginBuildForm();
    this.modalService.open(content, {
      size: 'lg',
      backdrop: 'static',
      backdropClass: 'light-blue-backdrop',
      keyboard: false,
    });
  }
  // addCustomerActivity() {
  //   Swal.fire({
  //     // title: 'Are you sure?',
  //     text: 'Activity is saved succesfully',
  //     // icon: 'success',
  //     // showCancelButton: true,
  //     confirmButtonColor: '#3085d6',
  //     cancelButtonColor: '#d33',
  //     confirmButtonText: 'OK',
  //   });
  // }
  addCustomerActivity() {
    let data = {
      status: this.activityForm.value.status,
      customerID: this.tempCusID,
      nextActionDate: this.activityForm.value.nextActionDate,
      notes: this.activityForm.value.notes,
    };
    console.log('data', data);

    this.api.post(this.config.routes.cusSalesActivity, data).subscribe(
      (resp: any) => {
        if (resp.status == true) {
          Swal.fire({
            // title: 'Are you sure?',
            text: 'Activity is saved succesfully',
            // icon: 'success',
            // showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'OK',
          });
        }
      },
      (err) => {},
      () => {
        this.modalService.dismissAll();
        this.ngOnInit();
      }
    );
  }
  onAdd() {
    this.submit = true;
    if (this.activityForm.invalid) return;
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to save this activity',
      icon: 'success',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes!',
      allowOutsideClick: false,
      allowEscapeKey: false,
    }).then((result) => {
      if (result.isConfirmed) {
        this.addCustomerActivity();
      } else {
        // Swal.fire("Fail to Back");
      }
    });
  }
  getweeklyPlanView() {
    this.activatedRoute.paramMap.subscribe((params) => {
      this.planId = params.get('id');
      console.log('id', this.planId);
      this.api
        .get(this.config.routes.weeklyPlanCreate + '?planID=' + this.planId)
        .subscribe((resp: any) => {
          this.weeklyPlanCreate = resp.data;
          
          this.fromTo.patchValue({
            planStartDate: this.weeklyPlanCreate[0]?.planStartDate,
            planEndDate:this.weeklyPlanCreate[0]?.planEndDate

          })
        });
    });
  }
  customerView(customerId) {
    // this.router.navigate(['customer-view/' + customerId]);

    // const url=this.router.navigate(['customer-view/' + customerId]);

    window.open('/customer-view/' + customerId, '_blank');
  }
  getStatus(){
    this.api.get(this.config.routes.activityStatus).subscribe((resp: any) => {
      this.getstatus = resp.data;
  })
  }
  setNull(){
    let statusSelected= this.activityForm.get('status').value;
    if(statusSelected !=="Not Needed"){
      this.activityForm.get('nextActionDate').setValidators([Validators.required]);
      this.activityForm.get('nextActionDate').updateValueAndValidity();
      this.activityForm.get('nextActionDate').enable()
    }
    else{
      this.activityForm.get('nextActionDate').clearValidators();
      this.activityForm.get('nextActionDate').updateValueAndValidity(); 
      this.activityForm.get('nextActionDate').disable()
    }
    }
}
