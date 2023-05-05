import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from 'src/app/providers/api.service';
import { configService } from 'src/app/providers/config/config';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-people-create',
  templateUrl: './people-create.component.html',
  styleUrls: ['./people-create.component.scss'],
})
export class PeopleCreateComponent implements OnInit {
  autoCompleteUsed1=false;
  autoCompleteUsed = false;
  config: any;
  regionList: any;
  territoryList: any;
  assignedRegion: any;
  assignedDataArray: any = [];
  assignedTerritory: any;
  department: any = ['ADMIN', 'IT', 'SALES'];
  // recommendedEmailDomains = ['gmail.com', 'yahoo.com'];
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private api: ApiService,
    private configService: configService,
    private spinner: NgxSpinnerService,
    private http: HttpClient
  ) {
    this.config = this.configService.config;
  
  }
  peopleForm: FormGroup;
  ngOnInit(): void {
    this.peopleBuildForm();
    this.getRegionList();
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 500);
  }
  submit: boolean = false;
  peopleBuildForm() {
    this.peopleForm = this.fb.group(
      {
        peopleName: ['', Validators.required],
        peopleDepartment: ['', Validators.required],
        assignedRegion: [''],
        assignedTerritory: [''],
        userName: ['', [Validators.required,Validators.email]],
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
        validator: PeopleCreateComponent.ConfirmedValidator(
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
  onBack() {
    this.router.navigate(['/people-list']);
  }
  getRegionList() {
    this.api.get(this.config.routes.regiondropDownList).subscribe(
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
    this.api
      .get(this.config.routes.regionList + '/' + id.assignedRegion)
      .subscribe((resp: any) => {
        this.territoryList = resp.territory;

        console.log('data', this.territoryList);
      });
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

    // for (let i = 0; i < this.assignedDataArray.length; i++) {
    //   if (this.assignedDataArray[i].regID == data.regID) {
    //   }
    // }
    // this.assignedDataArray.forEach((e) => {
    //   if (!e.regID == data.regID) {
    //     console.log('e');
    //   }
    // });
    if (this.assignedDataArray.find((e) => e.territoryID == data.territoryID)) {
      Swal.fire({
        title: 'Error',
        text: 'Already assigned this territory',
        icon: 'error',
        confirmButtonText: 'Ok',
      });
      return;
    } else {
      console.log('onadd', data);
      this.assignedDataArray.push(data);
      console.log('Assign Data', this.assignedDataArray);
      // this.peopleForm.reset()
      this.peopleForm.get('assignedRegion').setValue('');
      this.peopleForm.get('assignedTerritory').setValue('');
    }
  }

  removeItem(e) {
    this.assignedDataArray.splice(e, 1);
  }

  onSubmit() {
    this.submit = true;
    console.log(this.peopleForm.value);
    let data = {
      name: this.peopleForm.value.peopleName,
      department: this.peopleForm.value.peopleDepartment,

      userName: this.peopleForm.value.userName,
      userPassword: this.peopleForm.value.confirmUserPassword,
      // confirmUserPassword: this.peopleForm.value.confirmUserPassword,
      list: this.assignedDataArray,
    };
    if (this.peopleForm.invalid) return;
    // this.http
    //   .post('http://192.168.1.4:3002/people', data)
    this.api.post(this.config.routes.people, data).subscribe(
      (resp: any) => {
        if (resp.status == true) {
          Swal.fire({
            title: '  Success',
            text: 'Successfully people created',
            icon: 'success',
            confirmButtonText: 'Okay',
          });
          this.router.navigate(['/people-list']);
        } else {
          Swal.fire({
            title: 'error',
            text: 'failed',

            icon: 'error',
            confirmButtonText: 'Okay',
          });
        }
      },
      (err) => {
        console.error(err);
      },
      () => console.log('get')
    );
  }
 
//   suggestEmailDomains(event: Event) {
//     if (this.autoCompleteUsed) {
//       return;
//     }

//     const inputElement = event.target as HTMLInputElement;
//     const inputValue = inputElement.value;
//     const atIndex = inputValue.indexOf('@');
//     if (atIndex !== -1 && inputValue.length > atIndex + 1) {
//       const inputAfterAt = inputValue.slice(atIndex + 1);
//       const lastChar = inputAfterAt[inputAfterAt.length - 1];
//       const matchingDomains = lastChar === 'g' ? ['gmail.com'] : lastChar === 'm' ? ['minmegam.com'] : [];
//       if (matchingDomains.length > 0) {
//         const inputBeforeAt = inputValue.slice(0, atIndex);
//         const suggestedDomain = matchingDomains[0];
//         inputElement.value = inputBeforeAt + '@' + suggestedDomain;
//         this.autoCompleteUsed = true;
//       }
//     }
    
// }
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
