import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from 'src/app/providers/api.service';
import { configService } from 'src/app/providers/config/config';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-people-edit',
  templateUrl: './people-edit.component.html',
  styleUrls: ['./people-edit.component.scss'],
})
export class PeopleEditComponent implements OnInit {
  config: any;
  peopleID: number;
  respData: any = [];
  regionList: any = [];
  territoryList: any = [];
  regionData: any = [];
  assignedDataArray: any = [];
  territoryArray: any = [];
  department: any = ['ADMIN', 'IT', 'SALES'];
  submit: boolean = false;

  constructor(
    private fb: FormBuilder,

    private router: Router,
    private api: ApiService,
    private activatedRoute: ActivatedRoute,
    private configService: configService,
    private http: HttpClient,
    private spinner: NgxSpinnerService
  ) {
    this.config = this.configService.config;
  }
  peopleForm: FormGroup;
  ngOnInit(): void {
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 500);
    this.peopleBuildForm();
    this.getData();
    this.getRegionList();
  }
  getRegionList() {
    this.api
      .get(this.config.routes.regiondropDownList)
      // this.http
      //   .get('http://192.168.1.4:3002/region/' + '?page=' + '&limit=')
      .subscribe(
        (resp: any) => {
          try {
            this.regionList = resp.data;
            console.log(this.regionList);
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
  onSelected(regid) {
    this.peopleForm.get('assignedTerritory').setValue('');

    let id = JSON.parse(regid);
    console.log('id', id);
    // this.http
    //   .get('http://192.168.1.4:3002/region/' + id.assignedRegion)
    this.api
      .get(this.config.routes.regionList + '/' + id.assignedRegion)
      .subscribe((resp: any) => {
        this.territoryList = resp.territory;

        console.log('data', this.territoryList);
      });
  }
  peopleBuildForm() {
    this.peopleForm = this.fb.group(
      {
        peopleName: ['', Validators.required],
        peopleDepartment: ['', Validators.required],
        assignedRegion: [''],
        assignedTerritory: [''],
        userName: ['',[Validators.required,Validators.email]],
        userPassword: [
          '',
          Validators.compose([
            Validators.required,
            Validators.maxLength(15),
            Validators.minLength(6),
          ]),
        ],
        confirmUserPassword: [
          '',
          Validators.compose([
            Validators.required,
            Validators.maxLength(15),
            Validators.minLength(6),
          ]),
        ],
      },
      {
        validator: PeopleEditComponent.ConfirmedValidator(
          'userPassword',
          'confirmUserPassword'
        ),
      }
    );
  }
  static ConfirmedValidator(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      if (
        matchingControl.errors &&
        !matchingControl.errors.confirmedValidator
      ) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ confirmedValidator: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }
  get f() {
    return this.peopleForm.controls;
  }
  // o() {
  //   console.log('test', this.peopleForm.value.assignedTerritory);
  // }
  onBack() {
    this.router.navigate(['/people-list']);
  }
  onAdd() {
    let regionValue = JSON.parse(this.peopleForm.value.assignedRegion);
    let territoryValue = JSON.parse(this.peopleForm.value.assignedTerritory);
    console.log('regionValue', regionValue, 'territoryValue', territoryValue);
    let data = {
      regionID: regionValue.assignedRegion,
      regionName: regionValue.regName,
      territoryID: territoryValue.assignedTerritory,
      territoryName: territoryValue.terName,
    };
    if (this.territoryArray.find((e) => e.territoryID == data.territoryID)) {
      Swal.fire({
        title: 'Error',
        text: 'Already assigned this territory',
        icon: 'error',
        confirmButtonText: 'ok',
      });
      return;
    } else {
      console.log('onadd', data);
      this.territoryArray.push(data);
      console.log('Assign Data', this.territoryArray);
      // this.peopleForm.reset()
      this.peopleForm.get('assignedRegion').setValue('');
      this.peopleForm.get('assignedTerritory').setValue('');
    }
  }
  removeItem(e, v) {
    console.log('v', v);
    if (!(v == '' || v == undefined || v == null)) {
      // this.http
      // .get('http://192.168.1.4:3002/region/'+  id.assignedRegion )
      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to delete this assigned territory',
        icon: 'success',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes!',
        allowOutsideClick: false,
        allowEscapeKey: false,
      }).then((result) => {
        if (result.isConfirmed) {
          this.api
            .delete(this.config.routes.peopleRegionTerritory + '/' + v)
            .subscribe(
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
                this.territoryArray.splice(e, 1);
              }
            );
        } else {
          // Swal.fire("Fail to Back");
        }
      });
    } else {
      this.territoryArray.splice(e, 1);
    }
    console.log('array', e);
    console.log('v', v);
  }
  getData() {
    this.activatedRoute.paramMap.subscribe((params) => {
      this.peopleID = parseInt(params.get('id'));
      this.api
        .get(this.config.routes.people + '/' + this.peopleID)
        // this.http
        //   .get('http://192.168.1.4:3002/people/' + this.peopleID)
        .subscribe((resp: any) => {
          this.respData = resp.peopleData;
          this.regionData = resp.regionData;
          this.territoryArray = this.regionData;
          console.log('regionData', this.regionData);

          // console.log('assignedDataArray', this.assignedDataArray);

          console.log('people', this.respData);
          this.peopleForm.patchValue({
            peopleName: this.respData[0].name,
            peopleDepartment: this.respData[0].department,
            // assignedRegion: this.respData[0].name,
            userName: this.respData[0].userName,
            userPassword: this.respData[0].userPassword,
            confirmUserPassword: this.respData[0].userPassword,
          });
        });
    });
  }
  onSubmit() {
    this.submit = true;
    if (this.peopleForm.invalid) return;
    console.log(this.peopleForm.value);
    console.log('length', this.territoryArray.length);
    console.log('length', this.territoryArray);
    // return;
    for (let i = 0; i < this.territoryArray.length; i++) {
      if (
        this.territoryArray[i].peopleRegionId == '' ||
        this.territoryArray[i].peopleRegionId == null ||
        this.territoryArray[i].peopleRegionId == undefined
      ) {
        let data = {
          regionID: this.territoryArray[i].regionID,
          regionName: this.territoryArray[i].regionName,
          territoryID: this.territoryArray[i].territoryID,
          territoryName: this.territoryArray[i].territoryName,
          peopleID: this.peopleID,
        };
        this.assignedDataArray.push(data);
        console.log('assignedDataArray one', data);
      }
    }
    console.log('assignedDataArray', this.assignedDataArray);
    let data = {
      name: this.peopleForm.value.peopleName,
      department: this.peopleForm.value.peopleDepartment,

      userName: this.peopleForm.value.userName,
      userPassword: this.peopleForm.value.confirmUserPassword,
      // confirmUserPassword: this.peopleForm.value.confirmUserPassword,
      list: this.assignedDataArray,
    };
    console.log('data', data);

    this.api
      .put(this.config.routes.people + '/' + this.peopleID, data)
      // this.http
      //   .put('http://192.168.1.4:3002/people/' + this.peopleID, data)
      .subscribe((resp: any) => {
        if (resp.status == true) {
          Swal.fire({
            title: '  Success',
            text: 'Successfully people updated',
            icon: 'success',
            confirmButtonText: 'Okay',
          });
          this.router.navigate(['/people-list']);
        }
      });
  }
  suggestEmailDomains(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const inputValue = inputElement.value;
    const prevValue = inputElement.getAttribute('prev-value') ?? '';
  
    if (inputValue.length < prevValue.length) {
      // user is erasing text
      inputElement.setAttribute('prev-value', inputValue);
      return;
    }
  
    const atIndex = inputValue.indexOf('@');
    if (atIndex !== -1 && inputValue.length > atIndex + 2) {
      const domainSnippet = inputValue.slice(atIndex + 1, atIndex + 3);
      const matchingDomains = domainSnippet === 'gm' ? ['gmail.com'] : domainSnippet === 'mi' ? ['minmegam.com'] : [];
      if (matchingDomains.length > 0) {
        const inputBeforeAt = inputValue.slice(0, atIndex);
        const suggestedDomain = matchingDomains[0];
        inputElement.value = inputBeforeAt + '@' + suggestedDomain;
        inputElement.setAttribute('prev-value', inputElement.value);
  
        // save full email value to a hidden input field
        const emailInput = this.peopleForm.get('userName');
        if (emailInput) {
          emailInput.setValue(inputElement.value);
        }
      }
    } else {
      inputElement.setAttribute('prev-value', inputValue);
    }
  }
  
  
}
