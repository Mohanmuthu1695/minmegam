import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/providers/api.service';
import { Location } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';

import { configService } from 'src/app/providers/config/config';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-region-register',
  templateUrl: './region-register.component.html',
  styleUrls: ['./region-register.component.scss'],
})
export class RegionRegisterComponent implements OnInit {
  config: any;
  stateList: any=[];
  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private router: Router,
    private api: ApiService,
    private configService: configService,
    private location: Location
  ) {
    this.config = this.configService.config;
  }
  regionRegisterForm: FormGroup;
  submit: boolean = false;
  ngOnInit(): void {
    this.loginBuildForm();
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 500);
    this.getStateList()
  }
  loginBuildForm() {
    this.regionRegisterForm = this.fb.group({
      state: ['', Validators.required],
      region: ['', Validators.required],
    });
  }
  get f() {
    return this.regionRegisterForm.controls;
  }
  onBack() {
    this.location.back();
  }
  onSubmit() {
    this.submit = true;
    if (this.regionRegisterForm.invalid) return;
    this.spinner.show();
    let data = {
      regionName: this.regionRegisterForm.value.region,
      regionState: this.regionRegisterForm.value.state,
    };
    this.api.post(this.config.routes.regionList, data).subscribe(
      (resp: any) => {
        console.log(resp);
        try {
          if (resp.status == true) {
            Swal.fire({
              title: 'success',
              text: 'Successfully submitted',
              timer: 4000,
              icon: 'success',
              confirmButtonText: 'Okay',
            });
          }
        } catch (ex) {
          console.log(ex);
        }
      },
      (err) => {
        console.log(err);
      },

      () => {
        // this.ngOnInit();
        this.router.navigate(['/region-list']);
        this.spinner.hide();
      }
    );

    console.log(this.regionRegisterForm.value);
  }
  getStateList() {
    this.api.get(this.config.routes.stateList).subscribe(
      (resp: any) => {
        try {
          this.stateList = resp.data;
        } catch (err) {
          console.log(err);
        }
      },
      (err) => {
        console.error(err);
      },
      () => console.log('get')
    );
  }
}
