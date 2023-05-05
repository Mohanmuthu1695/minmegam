import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/providers/api.service';
import { configService } from 'src/app/providers/config/config';
import { Location } from '@angular/common';

import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-region',
  templateUrl: './region.component.html',
  styleUrls: ['./region.component.scss'],
})
export class RegionComponent implements OnInit {
  territoryAdd: any;
  config: any;
  regionID: number;
  respData: any;
  territoryData: any = [];
  updateTerriArray: any = [];
  temArray: any = [];
  respTerritoryData: any = [];
  assignedDataArray: any;
  DataArray: any = [];
  constructor(
    private fb: FormBuilder,
    private location: Location,
    private router: Router,
    private api: ApiService,
    private activatedRoute: ActivatedRoute,
    private configService: configService,
    private spinner: NgxSpinnerService
  ) {
    this.config = this.configService.config;
  }
  regionForm: FormGroup;
  territoryList: any = [];
  ngOnInit(): void {
    console.log('called');
    this.loginBuildForm();
    this.getData();
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 500);
  }
  onAddTerritory() {
    this.territoryAdd = this.regionForm.value.territory;
    if (this.territoryAdd != '') {
      if (
        this.respTerritoryData.find(
          (e) =>
            e.territoryName.toLowerCase() == this.territoryAdd.toLowerCase()
        )
      ) {
        Swal.fire({
          title: 'Error',
          text: 'Already have this territory',
          icon: 'error',
          confirmButtonText: 'Save',
        });
        return;
      }
      const data = {
        territoryName: this.territoryAdd,
      };
      this.respTerritoryData.push(data);

      this.territoryData.push(this.territoryAdd);
      this.updateTerriArray.push(this.territoryAdd);
      console.log('updated array', this.updateTerriArray);
      this.regionForm.get('territory').setValue('');
    } else if (this.territoryAdd == '') {
      Swal.fire({
        title: 'Error',
        text: 'Empty value cannot be added',
        icon: 'error',
        confirmButtonText: 'ok',
      });
    }
    console.log(this.territoryAdd);
  }
  loginBuildForm() {
    this.regionForm = this.fb.group({
      state: [''],
      region: [''],
      territory: [''],
    });
  }
  // removeItem(e) {
  //   this.territoryData.splice(e, 1);
  //   console.log('array', this.territoryData);
  // }
  onBack() {
    this.location.back();
  }
  getData() {
    this.activatedRoute.paramMap.subscribe((params) => {
      this.regionID = parseInt(params.get('id'));
      this.api
        .get(this.config.routes.regionList + '/' + this.regionID)
        .subscribe((resp: any) => {
          this.respData = resp.data;
          this.respTerritoryData = resp.territory;
          this.regionForm.patchValue({
            state: this.respData[0].regionState,
            region: this.respData[0].regionName,
          });
          console.log('data', this.respData);
          console.log('territoryData', this.respTerritoryData);

          for (let i = 0; i < this.respTerritoryData.length; i++) {
            console.log('iter', this.respTerritoryData[i].territoryName);
            let data = this.respTerritoryData[i].territoryName;
            this.territoryData.push(data);
            console.log(this.territoryData);
          }
        });

      console.log('id', this.regionID);
    });
  }
  removeItem(e, v) {
    console.log('v', v);
    if (!(v == '' || v == undefined || v == null)) {
      // this.http
      // .get('http://192.168.1.4:3002/region/'+  id.assignedRegion )
      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to delete this territory',
        icon: 'success',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes!',
        allowOutsideClick: false,
        allowEscapeKey: false,
      }).then((result) => {
        if (result.isConfirmed) {
          this.api.delete(this.config.routes.territory + '/' + v).subscribe(
            (resp: any) => {
              Swal.fire({
                // title: 'Are you sure?',
                text: 'Assigned territory is deleted',
                // icon: 'success',
                // showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'OK',
              });
            },
            (err) => {},
            () => {
              //
              this.respTerritoryData.splice(e, 1);
            }
          );
        } else {
          // Swal.fire("Fail to Back");
        }
      });
    } else {
      this.respTerritoryData.splice(e, 1);
    }
    console.log('array', e);
    console.log('v', v);
  }
  onSubmit() {
    console.log(this.respTerritoryData.length);
    for (let i = 0; i < this.respTerritoryData.length; i++) {
      if (
        this.respTerritoryData[i].territoryID == '' ||
        this.respTerritoryData[i].territoryID == null ||
        this.respTerritoryData[i].territoryID == undefined
      ) {
        let territoryName = this.respTerritoryData[i].territoryName;

        this.DataArray.push(territoryName);
        console.log('assignedDataArray one', territoryName);
      }
    }
    let data = {
      regionID: this.regionID,
      territoryName: this.DataArray,
    };
    console.log('data onsubmit', data);
    this.api.post(this.config.routes.territory, data).subscribe(
      (resp: any) => {
        console.log(resp);
        try {
          if (resp.status == true) {
            Swal.fire({
              title: 'success',
              text: 'Successfully updated',
              timer: 4000,
              icon: 'success',
              confirmButtonText: 'Okay',
            });
            this.router.navigate(['/region-list']);
          } else {
            Swal.fire({
              title: 'error',
              text: 'failed',

              icon: 'error',
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

      () => {}
    );
  }
}
