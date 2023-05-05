import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { configService } from 'src/app/providers/config/config';
import { ApiService } from 'src/app/providers/api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-customer-view',
  templateUrl: './customer-view.component.html',
  styleUrls: ['./customer-view.component.scss'],
})
export class CustomerViewComponent implements OnInit {
  getstatus:any=[]
  config: any;
  cusID: any;
  respData: any;
  activityForm: FormGroup;
  submit: boolean = false;
  activityData: any;
  minDate = new Date();
  allCount: number;
  constructor(
    private router: Router,
    private spinner: NgxSpinnerService,
    private activatedRoute: ActivatedRoute,
    private api: ApiService,
    private configService: configService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private http: HttpClient,
  ) {
    this.config = configService.config;
    this.minDate.setDate(this.minDate.getDate() - 0);
  }

  ngOnInit(): void {
    this.getData();
    this.getSalesActivity();
    this.submit = false;
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 500);
    this.getStatus();
   
   
  }
  statusList = [
    'Appointment',
    'Call Next Week',
    'Call Back',
    'Demo',
    'FollowUp',
    'Meeting',
    'Not Needed',
    'Visit Next Week',
    'Trail',
  ];
  loginBuildForm() {
    this.activityForm = this.fb.group({
      status: ['', Validators.required],
      nextActionDate:  [null],
      notes: ['', Validators.required],
    });
  }
  get f() {
    return this.activityForm.controls;
  }
  onBack() {
    this.router.navigate(['/customer-list']);
  }
  open(content) {
    this.ngOnInit();
    this.loginBuildForm();
    this.modalService.open(content, {
      size: 'lg',
      backdrop: 'static',
      backdropClass: 'light-blue-backdrop',
      keyboard: false,
    });
  }
  getData() {
    this.activatedRoute.paramMap.subscribe((params) => {
      this.cusID = params.get('id');
      this.api
        .get(this.config.routes.customer + '/' + this.cusID)
        .subscribe((resp: any) => {
          this.respData = resp.data;

          console.log('data', this.activityData);
        });

      console.log('id', this.cusID);
    });
  }
  getSalesActivity() {
    this.activatedRoute.paramMap.subscribe((params) => {
      this.cusID = params.get('id');
      this.api
        .get(this.config.routes.cusSalesActivity + '?id=' + this.cusID)
        .subscribe((resp: any) => {
          this.activityData = resp.data;
          this.allCount=resp.allCount

          console.log('data', this.respData);
        });

      console.log('id', this.cusID);
    });
  }

  addCustomerActivity() {
    let data = {
      status: this.activityForm.value.status,
      customerID: this.cusID,
      nextActionDate: this.activityForm.value.nextActionDate,
      notes: this.activityForm.value.notes,
    };
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
