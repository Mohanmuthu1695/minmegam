import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgModel, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { configService } from 'src/app/providers/config/config';
import { NgxSpinnerService } from 'ngx-spinner';

import { ApiService } from 'src/app/providers/api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-customer-edit',
  templateUrl: './customer-edit.component.html',
  styleUrls: ['./customer-edit.component.scss'],
})
export class CustomerEditComponent implements OnInit {
  config: any;
  respData: any = [];
  cusID: any;
  inputBoxDis: boolean = true;
  dropDown: boolean = false;
  cRegion: NgModel = this.respData.cusRegion;
  territoryList: any = [];
  regionTerritoryList: any = [];
  c: any = [];
  inputBox: boolean = false;
  dropdown = false;
  parseBool: boolean = false;
  districtList: any;
  stateList: any;
  showdropdown:boolean=false;
  showdropdown1:boolean=false;
  getindustry: any=[];
  gettargetProduct: any=[];
  uniqueTerritoriesList: any=[];
  regionList: any=[];
  showerror= false;
 
 
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private api: ApiService,
    private configService: configService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService
  ) {
    this.config = configService.config;
  }
  customerForm: FormGroup;
  submit: boolean = false;
  ngOnInit(): void {
   
   
    this.customerBuildForm();
    this.getData();
    this.getRegionTerritoryList();
    // this.getStateList();
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 500);
    let c = JSON.parse(localStorage.getItem('currentUser'));
    if (c.type == 'ADMIN') {
      this.customerForm.get('companyRegion').enable();
      this.customerForm.get('companyTerritory').enable();
    } else if (c.type == 'IT') {
      this.customerForm.get('companyRegion').enable();
      this.customerForm.get('companyTerritory').enable();
      // this.router.navigate(['/customer-list']);
    } else if (c.type == 'SALES') {
      this.customerForm.get('companyRegion').disable();
      this.customerForm.get('companyTerritory').disable();
      // this.router.navigate(['/customer-list']);
    }
    this.getIndustry();
    this.getTargetProduct();
    
    
  }
  open(content) {
    this.modalService.open(content, {
      size: 'lg',
      backdrop: 'static',
      backdropClass: 'light-blue-backdrop',
      keyboard: false,
    });
  }
  get f() {
    return this.customerForm.controls;
  }
  customerBuildForm() {
    this.customerForm = this.fb.group({
      companyName: ['', Validators.required],
      industryType: ['', Validators.required],
      targetProduct: ['', Validators.required],
      customerName: ['', Validators.required],
      customerDesignation: ['', Validators.required],
      mobileNumber: [''],
      landLineNumber: [''],
      cusEmail: [''],
      additionalContact: [''],
      companyRegion: [''],
      companyTerritory: [{value:'',disabled:true}],
      // companyState: [''],
      // companyDistrict: [''],
      companyAddress: [''],
    });
  }

  onBack() {
    this.router.navigate(['/customer-list']);
  }
  getData() {
    this.activatedRoute.paramMap.subscribe((params) => {
      this.cusID = params.get('id');
      this.api
        .get(this.config.routes.customer + '/' + this.cusID)
        .subscribe((resp: any) => {
          this.respData = resp.data;
          this.customerForm.patchValue({
            companyName: this.respData.companyName,
            industryType: this.respData.industryType,
            targetProduct: this.respData.targetProduct,
            customerName: this.respData.cusName,
            customerDesignation: this.respData.cusDesignation,
            mobileNumber: this.respData.cusPhoneNo,
            landLineNumber: this.respData.landLineNumber,
            cusEmail: this.respData.cusEmail,
            additionalContact: this.respData.cusAddContact,
            companyRegion: this.respData.cusRegion,
            companyTerritory: this.respData.cusTerritory,
            // companyState: this.respData.cusState,
            // companyDistrict: this.respData.cusDistrict,
            companyAddress: this.respData.cusAddress,
          });
          // var selectElement = document.getElementById('st');
          console.log('respdata', this.respData.cusRegion);
          // this.customerForm.controls['companyTerritory'].setValue(
          //   this.respData.cusTerritory
          // );

          // this.customerForm.controls['companyRegion'].setValue(
          //   this.respData.cusRegion
          // );
          // this.customerForm
          //   .get('companyDistrict')
          //   .setValue(this.respData.cusDistrict);
          // this.customerForm
          //   .get('companyTerritory')
          //   .setValue(this.respData.cusTerritory);

          // this.customerForm
          //   .get('companyTerritory')
          //   .setValue(this.respData.cusTerritory);
          // this.customerForm
          //   .get('companyRegion')
          //   .setValue(this.respData.cusRegion);
          // console.log('data', this.respData);
        });

      console.log('id', this.cusID);
    });
  }
  onSubmit() {
    this.validateMobile();
    this.validatephone();
    this.showError()
    this.submit = true;
    console.log('value', this.customerForm.value);
    if (this.customerForm.invalid) return;
    this.spinner.show();
    if (this.parseBool) {
      console.log('if');
      var regionValue = JSON.parse(this.customerForm.value.companyRegion);
      var territoryValue = JSON.parse(this.customerForm.value.companyTerritory);
      console.log('region', regionValue);
      console.log('region', regionValue.regName);
      console.log('territory', territoryValue);
      console.log('territory', territoryValue.terName);
    } else {
      console.log('else');
      var regionValue = this.customerForm.value.companyRegion;
      var territoryValue = this.customerForm.value.companyTerritory;
      console.log('regionValue', regionValue);
      console.log('territoryValue', territoryValue);
    }

    let data = {
      companyName: this.customerForm.value?.companyName,
      industryType: this.customerForm.value?.industryType,
      targetProduct: this.customerForm.value?.targetProduct,
      cusName: this.customerForm.value?.customerName,
      cusDesignation: this.customerForm.value?.customerDesignation,
      cusPhoneNo: this.customerForm.value?.mobileNumber,
      cusEmail: this.customerForm.value?.cusEmail,
      cusAddContact: this.customerForm.value?.additionalContact,
      cusRegion: regionValue,
      landLineNumber: this.customerForm.value?.landLineNumber,
      cusTerritory: territoryValue,
      // cusState: this.customerForm.value.companyState,
      // cusDistrict: this.customerForm.value.companyDistrict,
      cusAddress: this.customerForm.value?.companyAddress,
    };
    this.api
      .put(this.config.routes.customer + '/' + this.cusID, data)
      .subscribe(
        (resp: any) => {
          console.log(resp);
          try {
            if (resp.status == true) {
              Swal.fire({
                title: '  Success',
                text: 'Successfully customer details updated',
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

    console.log('value', data);
  }
  getIndustry(){
    this.api.get(this.config.routes.industryType).subscribe((resp: any) => {
      this.getindustry = resp.data;
  })
  }
  getTargetProduct(){
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
// setnull(){
//   this.customerForm.get('companyTerritory').setValue('');
//   this.dropdown=true

// }
onDropdownChange() {
  const dropdownValue = this.customerForm.get('companyRegion').value;
  
  if (dropdownValue) {
    this.customerForm.get('companyTerritory').enable();
   this.dropdown=true
  } else {
    this.customerForm.get('companyTerritory').disable();
  }
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
