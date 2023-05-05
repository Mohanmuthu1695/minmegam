import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from 'src/app/providers/api.service';
import { configService } from 'src/app/providers/config/config';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-customer-create',
  templateUrl: './customer-create.component.html',
  styleUrls: ['./customer-create.component.scss'],
})
export class CustomerCreateComponent implements OnInit {
  config: any;
  d: any = [];
  territoryList: any = [];
  regionList: any = [];
  regionTerritoryList: any;
  stateDistrictList: any = [];
  stateList: any;
  c: any = [];
  districtList: any;
  getindustry: any = [];
  gettargetProduct: any = []
  uniqueTerritoriesList:any=[]
  showerror=false;
  constructor(
    private modalService: NgbModal,
    private spinner: NgxSpinnerService,

    private fb: FormBuilder,
    private router: Router,
    private configService: configService,
    private api: ApiService
  ) {
    this.config = this.configService.config;
  }
  customerForm: FormGroup;
  submit: boolean = false;
  ngOnInit(): void {
    
    this.customerBuildForm();
    this.spinner.show();
    this.getRegionTerritoryList();
    // this.getStateList();
    // this.getStateDistrictList();
    setTimeout(() => {
      this.spinner.hide();
    }, 500);
    this.getIndustry();
    this.getTargetProduct();
    if (this.customerForm.controls['companyRegion'].value === null) {
     
      this.customerForm.controls['companyTerritory'].disable();
      this.customerForm.get('companyRegion').valueChanges.subscribe((value)=>{
        if (value) {
          this.customerForm.get('companyTerritory').enable() ;
          
        } else {
          this.customerForm.get('companyTerritory').disable();
        }
      })
      
      
    }
    
  }
  OnlyNumbersAllowed(event): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      // console.log("charCode restricted is " + charCode);
      return false;
    }
    return true;
  }
  get f() {
    return this.customerForm.controls;
  }
 

  customerBuildForm() {
    this.customerForm = this.fb.group({
      companyName: ['', Validators.required],
      industryType: [null, Validators.required],
      targetProduct: ['', Validators.required],
      customerName: ['', Validators.required],
      customerDesignation: ['', Validators.required],
      mobileNumber: [''],
      landLineNumber: [''],
      cusEmail: [''],
      additionalContact: [''],
      companyRegion: [null, Validators.required],
      companyTerritory: ['', Validators.required],
      // companyState: [''],
      // companyDistrict: [''],
      companyAddress: [''],
    });
  }

  onBack() {
    this.router.navigate(['/customer-list']);
  }
  getView = () => {
    // Do something with the company name, such as fetch additional data or display it in a separate view
    console.log(`Viewing details for `);
  };
  onSubmit() {
    this.showError();
    this.validatephone();
    this.validateMobile();
    this.submit = true;
    if (this.customerForm.invalid) return;
    let regionValue = this.customerForm.value.companyRegion;
    let territoryValue = this.customerForm.value.companyTerritory;
    console.log('regionValue', regionValue);
    console.log('territoryValue', territoryValue);
    let data = {
      companyName: this.customerForm.value.companyName,
      industryType: this.customerForm.value.industryType,
      targetProduct: this.customerForm.value.targetProduct,
      cusName: this.customerForm.value.customerName,
      cusDesignation: this.customerForm.value.customerDesignation,
      cusPhoneNo: this.customerForm.value.mobileNumber,
      cusEmail: this.customerForm.value.cusEmail,
      cusAddContact: this.customerForm.value.additionalContact,
      cusRegion: regionValue,
      cusTerritory: territoryValue,
      landLineNumber: this.customerForm.value.landLineNumber,
      // cusState: this.customerForm.value.companyState,
      // cusDistrict: this.customerForm.value.companyDistrict,
      cusAddress: this.customerForm.value.companyAddress,
    };
    console.log("data",data)
  
    this.api.post(this.config.routes.customer, data).subscribe(
      (resp: any) => {
        console.log(resp);
        this.d = resp.data;
        console.log('d', this.d);
        var i = 0;
        const dat = () => {
          let tableHtml = '<table class="">';
          for (let item of this.d) {
            i++;
            tableHtml += `<tr><td><a class="float-start" href="/customer-view/${item.customerId}" target='_blank'><button class="btn btn-outline">${i} &nbsp ${item.companyName}</button></a></td></tr>`;
          }
          tableHtml += '</table>';

          // const viewButtons = document.querySelectorAll('.view-button');
          // viewButtons.forEach((button) => {
          //   button.addEventListener('click', () => this.getView());
          // });

          return tableHtml;
        };

        try {
          if (resp.data) {
            console.log('msg', resp.data);
            Swal.fire({
              title: 'Similar data found , Do you want to save this customer?',
              text: '',
              icon: 'success',

              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Yes!',
              allowOutsideClick: false,
              allowEscapeKey: false,
              html: dat(),
            }).then((result) => {
              if (result.isConfirmed) {
                this.customerCreateConfirm(data);
              } else {
                // Swal.fire("Fail to Back");
              }
            });
          }
          if (resp.status == true && !resp.data) {
            Swal.fire({
              title: '  Success',
              text: 'Successfully customer details created',
              icon: 'success',
              confirmButtonText: 'Okay',
            });

            this.router.navigate(['/customer-list']);
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
      }
    );

    console.log('value', this.customerForm.value);
    
  }
  // getRegionList() {
  //   this.api.get(this.config.routes.regionTerritoryList).subscribe(
  //     (resp: any) => {
  //       try {
  //         this.regionTerritoryList = resp.data;
  //         this.c = this.getUniqueListBy(this.regionTerritoryList, 'regionID');
  //         console.log('c', this.c);

          // for (let i = 0; i < this.regionTerritoryList.length; i++) {
          //   let data = this.regionTerritoryList[i].regionName;

          //   this.regionList.push(data);
          // }
          // this.regionList = [...new Set(this.regionList)];
          // console.log('regionList', this.regionList);
          // //
          // for (let i = 0; i < this.regionTerritoryList.length; i++) {
          //   let data = this.regionTerritoryList[i].territoryName;

          //   this.territoryList.push(data);
          // }
          // this.territoryList = [...new Set(this.territoryList)];
          // console.log('territoryList', this.territoryList);
  //       } catch (err) {
  //         console.log(err);
  //       }
  //     },
  //     (err) => {
  //       console.error(err);
  //     },
  //     () => console.log('get')
  //   );
  // }
  // onSelected(regid) {
  //   this.customerForm.get('companyTerritory').setValue('');

  //   let id = JSON.parse(regid);
  //   console.log('id', id);
  //   this.api
  //     .get(this.config.routes.regionList + '/' + id.assignedRegion)
  //     .subscribe((resp: any) => {
  //       this.territoryList = resp.territory;

  //       console.log('data', this.territoryList);
  //     });
  // }
  // getUniqueListBy(arr, key) {
  //   return [...new Map(arr.map((item) => [item[key], item])).values()];
  // }
  customerCreateConfirm(data) {
    this.api.post(this.config.routes.customer + '?check=true', data).subscribe(
      (resp: any) => {
        console.log(resp);
        try {
          if (resp.status == true) {
            Swal.fire({
              title: '  Success',
              text: 'Successfully customer details Created',
              icon: 'success',
              confirmButtonText: 'Okay',
            });
            this.router.navigate(['/customer-list']);
          }
        } catch (ex) {
          console.log(ex);
        }
      },
      (err) => {
        console.log(err);
      },

      () => {
        this.spinner.hide();

        // this.ngOnInit();
      }
    );
  }
  getIndustry() {
    this.api.get(this.config.routes.industryType).subscribe((resp: any) => {
      this.getindustry = resp.data;
    })
  }
  getTargetProduct() {
    this.api.get(this.config.routes.targetProduct).subscribe((resp: any) => {
      this.gettargetProduct = resp.data;
    })
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
      const matchingDomains = domainSnippet === 'gm' ? ['gmail.com'] : [];
      if (matchingDomains.length > 0) {
        const inputBeforeAt = inputValue.slice(0, atIndex);
        const suggestedDomain = matchingDomains[0];
        inputElement.value = inputBeforeAt + '@' + suggestedDomain;
        inputElement.setAttribute('prev-value', inputElement.value);
  
        // save full email value to a hidden input field
        const emailInput = this.customerForm.get('cusEmail');
        if (emailInput) {
          emailInput.setValue(inputElement.value);
        }
      }
    } else {
      inputElement.setAttribute('prev-value', inputValue);
    }
  }
  onRegionChange(region: string) {
    if (region) {
      this.territoryList = this.getTerritoriesForRegion(region);
    } else {
      this.territoryList = this.getUniqueTerritories();
    }
    this.customerForm.get('companyTerritory').setValue(''); // reset the selected territory
  }

  
  getRegionTerritoryList() {
    this.api.get(this.config.routes.regionTerritoryList).subscribe((resp: any) => {
      this.regionTerritoryList = resp.data;
  
      // Create an array of unique region names (filtered to remove null or undefined values)
      this.regionList = [...new Set(this.regionTerritoryList.map(item => item.regionName).filter(item => item))];
  
      // Create an array of unique territory names (filtered to remove null or undefined values)
      this.territoryList = this.getUniqueTerritories().filter(item => item);
      this.uniqueTerritoriesList = [...new Set(this.regionTerritoryList.map(item => item.territoryName))];
    });
  }
  

getTerritoriesForRegion(region: string | undefined = undefined) {
  let territories = [];
  if (region) {
    territories = this.regionTerritoryList.filter(item => item.regionName === region)
                                          .map(item => item.territoryName);
  } else {
    territories = [...new Set(this.regionTerritoryList.map(item => item.territoryName))];
   
  }
  return [...new Set(territories)];
}
getUniqueTerritories() {
  const territories = this.regionTerritoryList.map(item => item.territoryName);
  const uniqueTerritories = [...new Set(territories)];
  return uniqueTerritories.filter(territory => territory !== null);
}
validateMobile(){
  let phone=this.customerForm.get('mobileNumber').value;
  if(phone!==""){
    this.customerForm.get('landLineNumber').clearValidators();
    this.customerForm.get('landLineNumber').updateValueAndValidity();

  }else if(phone==""){
    this.customerForm.get('landLineNumber').setValidators([Validators.required,Validators.minLength(10)]);
    this.customerForm.get('landLineNumber').updateValueAndValidity();

  }
}
validatephone(){
  let phone=this.customerForm.get('landLineNumber').value;
  if(phone!==""){
    this.customerForm.get('mobileNumber').clearValidators();
    this.customerForm.get('mobileNumber').updateValueAndValidity();

  }else if(phone==""){
    this.customerForm.get('mobileNumber').setValidators([Validators.required,Validators.minLength(10)]);
    this.customerForm.get('mobileNumber').updateValueAndValidity();

  }
}
showError(){
  let phone=this.customerForm.get('landLineNumber').value;
  let mobile=this.customerForm.get('mobileNumber').value;
  if(phone==""&& mobile==""){
    this.showerror=true
  }
  
}
removeerror(){
  const phone=this.customerForm.get('mobileNumber')
  const mobile=this.customerForm.get('landLineNumber')
  if(phone.touched || mobile.touched){
    this.showerror=false

  }
}
onKeyPress(event: KeyboardEvent) {
  const input = event.key;
  const isAllowed = /^\d+$| |-+$/.test(input);

  if (!isAllowed) {
    event.preventDefault();
  }
}

}
