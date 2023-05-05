import { HttpClient } from '@angular/common/http';
import { Component, OnInit,AfterViewInit, ViewChild} from '@angular/core';
import { FormControl,FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ApiService } from 'src/app/providers/api.service';
import { configService } from 'src/app/providers/config/config';
import { NgxSpinnerService } from 'ngx-spinner';


interface Data{
  customerName:string;
  industryType:string;
  region:string;
  territory:string;
  status:string;
  ActivityDate:Date;
 
  nextActionDate:Date;
  companyName:string;

}
enum status {
  Appointment = 'appointment',
  CallNextWeek = 'Call Next Week',
  CallBack = 'Call Back',
  Demo = 'Demo',
  FollowUp = 'FollowUp',
  Meeting = 'Meeting',
  NotNeeded = 'Not Needed',
  VisitNextWeek='Visit Next Week',
  Trail='Trail'

}

@Component({
  selector: 'app-weekly-activity',
  templateUrl: './sales-activity.component.html',
  styleUrls: ['./sales-activity.component.scss'],
  // providers: [ DistinctPipe ]
})
export class SalesActivityComponent implements OnInit {

  statusOptions: string[] = Object.values(status);
  // 
  table=false;
  //pagination 
  
  showTerritoryDropdown: boolean = false;
  // 
  limit2:string="ALL"
  // no data to show
  noDataFound = false;
  pipe: DatePipe;
  regionTerritoryList: any=[];
selected;
  // 
  filteredIndusrtyList:any[]=[];
  filteredCompanyList:any[]=[];

searchText1: string = '';
  selectedRegion: string = '';
  // new array for filter duplicates
 
 

 
//  paginator1
paginator1:boolean=false
 pageIndex: number = 1;
  count: number = 0;
  limit: number =10;
    ind: number=1;
    allCount: number;
    // paginator 2
    paginator2:boolean=false
   
// paginator3
paginator3:boolean=false
  
// paginator4
paginator4:boolean=false
  
    // 
 IType:string[]=[];
 Region:string[]=[];
 Territories:string[]=[];
 Status:string[]=[];
 company:string[]=[];
 uniqueTerritoriesList:any=[]
selectedDateRange: any;

  
//  radio box

  selectedForm: string = 'form1';
// 
 
 
 
 
  public filteredData=[];

  // 

  
  
 
  public filter1:FormGroup;
  public filter2:FormGroup;
  public filter3:FormGroup;
  public filter4:FormGroup;
  submitted1 = false;
  submitted2 = false;
  submitted3 = false;
  submitted4 = false;
  respData: any;
  config: any;
  regionList: any=[];
 
  territoryList: any=[];
  territoryList1: any=[];
  customerList: any=[];
  territoriesList: any=[];
  getindustry: any=[];
  getstatus: any=[];
 
  


  onSubmit(){
    this.spinner.show();
          setTimeout(() => {
            this.spinner.hide();
          }, 400);
    const industryType=this.filter1.get("industryType").value;
    const region=this.filter1.get("region").value;
    const territory=this.filter1.get("territory").value;
   

   
   
    this.api
      .get(
        this.config.routes.salesActivityDetails+
        '?searchType=1' +
          '&industry=' +
          industryType +
          '&region=' +
          region +
          '&territory=' +
          territory
          +
          '&page='+
          this.pageIndex +
          '&limit=' +
          this.limit
      )
      .subscribe((resp: any) => {
      
        this.respData = resp.data;
        this.allCount=resp.allCount
        this.noDataFound = this.respData?.length === 0;
        this.table = false;
        this.paginator1=true;
        this.paginator2=false;
        this.paginator3=false;
        this.paginator4=false;
        
       
        
      });
    
  }
  pageChange(event: number){
    this.pageIndex = event || 1;
    this.ind = (this.pageIndex - 1) * this.limit + 1;
    
  
const industryType=this.filter1.get("industryType").value;
const region=this.filter1.get("region").value;
const territory=this.filter1.get("territory").value;




this.api
  .get(
    this.config.routes.salesActivityDetails+
    '?searchType=1' +
      '&industry=' +
      industryType +
      '&region=' +
      region +
      '&territory=' +
      territory
      +
      '&page='+
      this.pageIndex +
      '&limit=' +
      this.limit
  )
  .subscribe((resp: any) => {
  
    this.respData = resp.data;
    this.allCount=resp.allCount
  })

  }
  
  onSubmit2() {
   
   
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 400);
    
    // Filter data between start and end dates
   
    const fromDateString = this.filter2.value.range[0];
    const toDateString = this.filter2.value.range[1];
    
    const status=this.filter2.get("status").value;
    const territory=this.filter2.get("territory").value;
    const fromDate = this.datePipe.transform(fromDateString, 'yyyy-MM-dd');
    const toDate = this.datePipe.transform(toDateString, 'yyyy-MM-dd');

    // this.http
    //   .get(
    //     'http://192.168.1.69:3002/salesActivityDetails?searchType=2'+
    this.api
      .get(
        this.config.routes.salesActivityDetails +
          '?searchType=2' +
          '&fromDate=' +
          fromDate +
          '&toDate=' +
          toDate +
          '&status=' +
          status +
          '&territory=' +
          territory +
          '&page='+
          this.pageIndex +
          '&limit=' +
          this.limit
      )
      .subscribe((resp: any) => {
        this.respData = resp.data;
        this.allCount=resp.allCount
        this.noDataFound = this.respData.length === 0;
        this.table = false;
        this.paginator2=true
        this.paginator3=false
        this.paginator4=false;
        this.paginator1=false;
       
       
      });
    
  }
  pageChange2(event: number){
    this.pageIndex = event || 1;
    this.ind= (this.pageIndex - 1) * this.limit + 1;
    // console.log("date"+this.startDate+" "+this.endDate)
    const fromDateString = this.filter2.value.range[0];
    const toDateString = this.filter2.value.range[1];
    
    const status=this.filter2.get("status").value;
    const territory=this.filter2.get("territory").value;
    const fromDate = this.datePipe.transform(fromDateString, 'yyyy-MM-dd');
    const toDate = this.datePipe.transform(toDateString, 'yyyy-MM-dd');

    // this.http
      // .get(
      //   'http://192.168.1.5:3002/salesActivityDetails?searchType=2'+
    this.api
      .get(
        this.config.routes.salesActivityDetails +
          '?searchType=2' +
          '&fromDate=' +
          fromDate +
          '&toDate=' +
          toDate +
          '&status=' +
          status +
          '&territory=' +
          territory +
          '&page='+
          this.pageIndex +
          '&limit=' +
          this.limit
      )
      .subscribe((resp: any) => {
        this.respData = resp.data;
        this.allCount=resp.allCount
      })

  }

 
  onSubmit3(){
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 400);
    
    const fromDateString = this.filter3.value.range[0];
    const toDateString = this.filter3.value.range[1];
    const status=this.filter3.get("status").value;
    const fromDate = this.datePipe.transform(fromDateString, 'yyyy-MM-dd');
      const toDate = this.datePipe.transform(toDateString, 'yyyy-MM-dd');
   


    // this.http
    //   .get(
    //     'http://192.168.1.69:3002/salesActivityDetails?searchType=3'+
    this.api
      .get(
        this.config.routes.salesActivityDetails +
          '?searchType=3' +
          '&fromDate=' +
          fromDate +
          '&toDate=' +
          toDate +
          '&status=' +
          status +
          '&page='+
          this.pageIndex +
          '&limit=' +
          this.limit
      )
      .subscribe((resp: any) => {
        this.respData = resp.data;
        this.allCount=resp.allCount
        this.noDataFound = this.respData.length === 0;
        this.table = false;
       this.paginator3=true
       this.paginator4=false;
       this.paginator1=false;
       this.paginator2=false;
      
      });
      
  }
  pageChange3(event: number){
    this.pageIndex = event || 1;
    this.ind = (this.pageIndex - 1) * this.limit + 1;
    // console.log("date"+this.startDate+" "+this.endDate)
    const fromDateString = this.filter3.value.range[0];
    const toDateString = this.filter3.value.range[1];
    const status=this.filter3.get("status").value;
    const fromDate = this.datePipe.transform(fromDateString, 'yyyy-MM-dd');
      const toDate = this.datePipe.transform(toDateString, 'yyyy-MM-dd');
   


    // this.http
    //   .get(
    //     'http://192.168.1.5:3002/salesActivityDetails?searchType=3'+
    this.api
      .get(
        this.config.routes.salesActivityDetails +
          '?searchType=3' +
          '&fromDate=' +
          fromDate +
          '&toDate=' +
          toDate +
          '&status=' +
          status +
          '&page='+
          this.pageIndex+
          '&limit=' +
          this.limit
      )
      .subscribe((resp: any) => {
        this.respData = resp.data;
        this.allCount=resp.allCount
      })

  }

  onSubmit4() {
    this.spinner.show();
          setTimeout(() => {
            this.spinner.hide();
          }, 400);
   
    const companyName = this.filter4.get('companyName').value;
    // this.http
    //   .get(
    //     'http://192.168.1.5:3002/salesActivityDetails?searchType=4'+
    this.api
      .get(
        this.config.routes.salesActivityDetails +
          '?searchType=4' +
          '&companyName=' +
          companyName +
          '&page='+
          this.pageIndex +
          '&limit=' +
          this.limit
      )
      .subscribe((resp: any) => {
        this.respData = resp.data;
        this.allCount=resp.allCount
        this.noDataFound = this.respData.length === 0;

        this.table = false;
       
       this.paginator4=true;
       this.paginator1=false;
       this.paginator2=false;
       this.paginator3=false;
      }
    );
  
  }
  pageChange4(event: number){
    this.pageIndex= event || 1;
    this.ind= (this.pageIndex- 1) * this.limit + 1;
    // console.log("date"+this.startDate+" "+this.endDate)
  
    const companyName = this.filter4.get('companyName').value;
    // this.http
    //   .get(
    //     'http://192.168.1.5:3002/salesActivityDetails?searchType=4'+
    
    this.api
      .get(
        this.config.routes.salesActivityDetails +
          '?searchType=4' +
          '&companyName=' +
          companyName +
          '&page='+
          this.pageIndex +
          '&limit=' +
          this.limit
      )
      .subscribe((resp: any) => {
        this.respData = resp.data;
        this.allCount=resp.allCount
      })
  }
  // getData(){
  //   if(this.filter1.valid){
  //     this.onSubmit()
  //   }
  //   else if(this.filter2.valid){
  //     this.onSubmit2()
  //   }
  //   else if(this.filter3.valid){
  //     this.onSubmit3()
  //   }
  //   else{
  //     this.onSubmit4()
  //   }
  // }

  getCustomerList(){
  // this.http.get('http://192.168.1.69:3002/customer?limit=ALL' 
  // )
    this.api
    .get
    (
      this.config.routes.customer+'?limit=ALL' )
      .subscribe((resp:any)=>{
        this.customerList=resp.data;
        


    
      })
  }

  onRegionChange(region: string) {
    if (region) {
      this.territoryList = this.getTerritoriesForRegion(region);
    } else {
      this.territoryList = this.getUniqueTerritories();
    }
    this.filter1.get('territory').setValue(''); // reset the selected territory
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

getIndustry(){
  this.api.get(this.config.routes.industryType).subscribe((resp: any) => {
    this.getindustry = resp.data;
})
}
getStatus(){
  this.api.get(this.config.routes.activityStatus).subscribe((resp: any) => {
    this.getstatus = resp.data;
})
}


filterCompany() {
  const uniqueCompanyTypes = new Set();
  this.customerList.forEach(customer => {
    const companyName = customer.companyName.toLowerCase();
  
    if (companyName.includes(this.searchText1.toLowerCase())) {
  
      uniqueCompanyTypes.add(companyName);
    }
  });
  
  
  this.filteredCompanyList = Array.from(uniqueCompanyTypes).sort().slice(0, 4);
  // console.log(`Filtered industry list: ${this.filteredIndusrtyList}`);
}





  

  constructor(
    private datePipe: DatePipe,
    private http: HttpClient,
    private router: Router,
    private api: ApiService,
    private configService: configService,
    private spinner: NgxSpinnerService
  ) {
    this.config = configService.config;

// 
    // filter functionss
 this.filter1 = new FormGroup({
    "industryType":new FormControl(null,[Validators.required]),
    "region":new FormControl(null,[Validators.required]),
    "territory":new FormControl('',[Validators.required]),
  }),
  this.filter2=new FormGroup({
    // "fromDate":new FormControl(null,[Validators.required]),
    "range":new FormControl(null,[Validators.required]),
   
    "status":new FormControl(null,[Validators.required]),
    "territory":new FormControl(null,[Validators.required])

  }),
  this.filter3=new FormGroup({
    // "fromDate":new FormControl(null,[Validators.required]),
    "range":new FormControl(null,[Validators.required]),
    
    "status":new FormControl(null,[Validators.required])
  }),
this.filter4=new FormGroup({
  "companyName":new FormControl(null,[Validators.required])
})



  }
  // 
  // controls
  get filter1Control() {
    return this.filter1.controls;
  }
  get filter2Control() {
    return this.filter2.controls;
  }
  get filter3Control() {
    return this.filter3.controls;
  }
  get filter4Control() {
    return this.filter4.controls;
  }
  // 

  // reset forms
resetForm1()

{
  this.spinner.show();
  setTimeout(() => {
    this.spinner.hide();
  }, 200);
  this.filter1.reset();
const myfield=this.filter1.get('territory');

myfield.setValue('');
myfield.markAsUntouched();

  
  this.noDataFound = false;
  this.table=true;
  

};
resetForm2()
{
  this.spinner.show();
  setTimeout(() => {
    this.spinner.hide();
  }, 200);
  this.filter2.reset();
  this.noDataFound = false;
  this.table=true;
};
resetForm3()
{
  this.spinner.show();
      setTimeout(() => {
        this.spinner.hide();
      }, 200);
  this.filter3.reset();
  this.noDataFound = false;
  this.table=true;
};
resetForm4()
{

  this.filter4.reset();
  this.noDataFound = false;
  this.table=true;
  this.searchText1 = '';
  this.filteredCompanyList = [];
  this.spinner.show();
  setTimeout(() => {
    this.spinner.hide();
  }, 200);

}




  ngOnInit() {
    this.getRegionTerritoryList();
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 400);
    this.getCustomerList();
    if (this.filter1.controls['region'].value === null) {
     
      this.filter1.controls['territory'].disable();
      this.filter1.get('region').valueChanges.subscribe((value)=>{
        if (value) {
          this.filter1.get('territory').enable() ;
          
        } else {
          this.filter1.get('territory').disable();
        }
      })
      
      
    }
    
   
    this.getIndustry()
    
   
    this.getStatus();
 
   
  }



 
//get single data without duplicate 

// getCompany(){
//   const allCompany=this.data.map(c=>c.companyName);
//   this.company=Array.from(new Set(allCompany));
// }

// showing error message in string 
isInvalid(controlName: string) {
  if (window.innerWidth < 768) {
    return false;
  }
  else{
  const control = this.filter1.get(controlName);
  return control.invalid && (control.touched || control.dirty);
  }
}
isInvalid2(controlName: string) {
  if (window.innerWidth < 768) {
    return false;
  }
  else{
  const control = this.filter2.get(controlName);
  return control.invalid && (control.touched || control.dirty);
  }
}
isInvalid3(controlName: string) {
  if (window.innerWidth < 768) {
    return false;
  }
  else{

  
  const control = this.filter3.get(controlName);
  return control.invalid && (control.touched || control.dirty);
  }
}
isInvalid4(controlName: string) {
  if (window.innerWidth < 768) {
    return false;
  }
  else{

  const control = this.filter4.get(controlName);
  return control.invalid && (control.touched || control.dirty);
  }
}
customerView(customerId) {
  // this.router.navigate(['customer-view/' + customerId]);
  // const url=this.router.navigate(['customer-view/' + customerId]);
  
  
  window.open("/customer-view/"+customerId, "_blank");
}
onInputClick() {
 
  
  const myFieldControl = this.filter4.get('companyName');
  myFieldControl.setValue('');
  myFieldControl.markAsUntouched();
  
}

}
