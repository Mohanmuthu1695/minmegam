import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl,FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/providers/api.service';
import { configService } from 'src/app/providers/config/config';
import { NgxSpinnerService } from 'ngx-spinner';
// import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';
interface Data{
  customerName:string;
 
  actStatus:string;
  lastActDate:Date;
  nextActDate:Date;
  companyName:string;
  activityID:number;
  actNotes:string;
  customerID:any;
  isCopied: boolean; // added isCopied flag


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
  selector: 'app-weekly-plan',
  templateUrl: './weekly-plan.component.html',
  styleUrls: ['./weekly-plan.component.scss']
})
export class WeeklyPlanComponent implements OnInit {
  statusOptions: string[] = Object.values(status);
 
  // 
  currentWeekStart: string;
  currentWeekEnd: string;
  table=false;
  searchCus=true;
  paginator=true;
  public payngFor:any[]=[];
 paginator1:boolean=false
 pageIndex1: number = 1;
  count1: number = 0;
  limit1: number =5;
    ind1: number=1;
    allCount1: number;
    // paginator 2
    paginator2:boolean=false
   
// paginator3
paginator3:boolean=false
  
// paginator4
paginator4:boolean=false
  allCount: number;
  currentPage: number = 1; // current page number
  itemsPerPage: number = 10; // number of items per page
  totalPages: number;
  totalItems: number;

  pageIndex: number = 1;
  count: number = 0;
  limit: number =5;
    ind: number=1;
    endDate: Date;
    startDate: Date;

  // weekForm: FormGroup;
 //pagination 
 p: number = 1;
 // 
 //pagination2 
 p2: number = 1;
 // 
 //pagination3
 p3: number = 1;
 // 
  //pagination4
  p4: number = 1;
  // 
  // no data to show
  noDataFound = false;
  pipe: DatePipe;
  config: any;
  // 
  // new array for filter duplicates
 
 IType:string[]=[];

 company:string[]=[];
 selectedRegion: string = '';
// 

  
//  radio box

  selectedForm: string = 'form1';
  selectedTable: string = 'table2';
// 
 
 
 
 
  // 
  filteredIndusrtyList:any[]=[];
  filteredCompanyList:any[]=[];
searchText: string = '';
searchText1: string = '';
  selectedRows: any[] = [];
  customerList: any=[];
  customerList1: any=[];
  customerList2: any[];
  cmyName1: any=[];
  cmyName2: any=[];
  getindustry: any=[];
  getstatus: any=[];
  uniqueTerritoriesList: any=[];
 
  

  // 

  constructor( private api: ApiService,  private spinner: NgxSpinnerService,
    private configService: configService, private http : HttpClient,private datePipe: DatePipe,private router: Router) { 
    const options:any = {  year: 'numeric', month: 'short', day: 'numeric' };
    // const currentWeekDates = this.getCurrentWeekDates();
    // this.currentWeekStart = currentWeekDates.start.toLocaleDateString().substring(0, 10);
    // this.currentWeekEnd = currentWeekDates.end.toLocaleDateString().substring(0, 10);
    this.config = configService.config;    
  }
  
  
 
  public filter1:FormGroup;
  public filter2:FormGroup;
  public filter3:FormGroup;
  public filter4:FormGroup;
  public weekDate:FormGroup;
 
  submitted1 = false;
  submitted2 = false;
  submitted3 = false;
  submitted4 = false;
  recommendPlan: any[] =[];
 
  respData: any;

  regionTerritoryList: any=[];
 
  regionList: any=[];
  regionList1: any=[];
  territoryList: any=[];
  territoryList1: any=[];
  companyName1:any[] =[];
  companyName2: any[] =[];

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
          this.pageIndex1 +
          '&limit=' +
          this.limit1
      )
      .subscribe((resp: any) => {
      
        this.respData = resp.data;
        this.allCount1=resp.allCount
          this.customerTable();
          
         
          this.noDataFound = this.respData.length === 0 
          
          
          this.table=false;
          this.searchCus=true;
          
          this.paginator=this.respData.length ===0
          this.paginator1=true;
        this.paginator2=false;
        this.paginator3=false;
        this.paginator4=false;
    });
   
  }
    pageChange1(event: number){
    this.pageIndex1 = event || 1;
    this.ind1 = (this.pageIndex1 - 1) * this.limit1 + 1;
    
  
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
      this.pageIndex1 +
      '&limit=' +
      this.limit1
  )
  .subscribe((resp: any) => {
  
    this.respData = resp.data;
    this.allCount1=resp.allCount
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
    //     .get('http://192.168.1.4:3002/salesActivityDetails?searchType=2'+'&fromDate='+ fromDate+'&toDate='+ toDate+  '&status='+ status +'&territory='+ territory )
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
          this.pageIndex1 +
          '&limit=' +
          this.limit1
      )
      .subscribe((resp: any) => {
        this.respData = resp.data;
        this.allCount1=resp.allCount
          this.customerTable();
          
         
          this.noDataFound = this.respData.length === 0 
          
          
          this.table=false;
          this.searchCus=true;
          
          this.paginator=this.respData.length===0
          this.paginator2=true
        this.paginator3=false
        this.paginator4=false;
        this.paginator1=false;
    }) ;
   
  }
  
 pageChange2(event: number){
    this.pageIndex1 = event || 1;
    this.ind= (this.pageIndex1 - 1) * this.limit1 + 1;
    // console.log("date"+this.startDate+" "+this.endDate)
    const fromDateString = this.filter2.value.range[0];
    const toDateString = this.filter2.value.range[1];
    
    const status=this.filter2.get("status").value;
    const territory=this.filter2.get("territory").value;
    const fromDate = this.datePipe.transform(fromDateString, 'yyyy-MM-dd');
    const toDate = this.datePipe.transform(toDateString, 'yyyy-MM-dd');

    // this.http
    //   .get(
    //     'http://192.168.1.4:3002/salesActivityDetails?searchType=2'
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
          this.pageIndex1 +
          '&limit=' +
          this.limit1
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
    // .get('http://192.168.1.4:3002/salesActiv?ityDetails?searchType=3'+'&fromDate='+ fromDate+'&toDate='+ toDate+ '&status='+ status  )
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
          this.pageIndex1 +
          '&limit=' +
          this.limit1
      )
      .subscribe((resp: any) => {
        this.respData = resp.data;
        this.allCount1=resp.allCount
      this.customerTable();
          
         
      this.noDataFound = this.respData.length === 0 
      
      
      this.table=false;
      this.searchCus=true;
      
      this.paginator=this.respData.length===0
      this.paginator3=true
      this.paginator4=false;
      this.paginator1=false;
      this.paginator2=false;
    });
     
          
  
    }
    pageChange3(event: number){
      this.pageIndex1 = event || 1;
      this.ind1 = (this.pageIndex1 - 1) * this.limit1 + 1;
      // console.log("date"+this.startDate+" "+this.endDate)
      const fromDateString = this.filter3.value.range[0];
      const toDateString = this.filter3.value.range[1];
      const status=this.filter3.get("status").value;
      const fromDate = this.datePipe.transform(fromDateString, 'yyyy-MM-dd');
        const toDate = this.datePipe.transform(toDateString, 'yyyy-MM-dd');
     
  
  
      // this.http
      //   .get(
      //     'http://192.168.1.4:3002/salesActivityDetails?searchType=3'
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
            this.pageIndex1+
            '&limit=' +
            this.limit1
        )
        .subscribe((resp: any) => {
          this.respData = resp.data;
          this.allCount1=resp.allCount
        })
  
    }
  
  onSubmit4(){
   
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 400);
   
    const companyName=this.filter4.get("companyName").value;
    // this.filteredData=this.data.filter(customer=>{
    //   return customer.companyName===companyName;
    // });
   
    // this.http
    //     .get('http://192.168.1.4:3002/salesActivityDetails?searchType=4'+'&companyName='+ companyName )
    this.api
      .get(
        this.config.routes.salesActivityDetails +
          '?searchType=4' +
          '&companyName=' +
          companyName +
          '&page='+
          this.pageIndex1 +
          '&limit=' +
          this.limit1
      )
      .subscribe((resp: any) => {
        this.respData = resp.data;
        this.allCount1=resp.allCount
          
          this.customerTable();
    
    
          this.noDataFound = this.respData.length === 0 
          
          
          this.table=false;
          this.searchCus=true;
          
          this.paginator=this.respData.length===0
          this.paginator4=true;
          this.paginator1=false;
          this.paginator2=false;
          this.paginator3=false;
    });  
  }
  pageChange4(event: number){
    this.pageIndex1= event || 1;
    this.ind1= (this.pageIndex1- 1) * this.limit1 + 1;
    // console.log("date"+this.startDate+" "+this.endDate)
  
    const companyName = this.filter4.get('companyName').value;
    
    this.api
      .get(
        this.config.routes.salesActivityDetails +
          '?searchType=4' +
          '&companyName=' +
          companyName +
          '&page='+
          this.pageIndex1 +
          '&limit=' +
          this.limit1
      )
      .subscribe((resp: any) => {
        this.respData = resp.data;
        this.allCount1=resp.allCount
      })
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
  getrecommendPlan(startDate,endDate){
   
  
   
    this.api
    .get(
      this.config.routes.recommendPlan +
        '?fromDate=' +
        startDate +
        '&toDate=' +
        endDate +
        '&page='+
        this.pageIndex +
        '&limit=' +
        this.limit


    )
    .subscribe((resp: any) => {
      this.recommendPlan = resp.data;
      this.allCount=resp.count
    
    //   for(let i=0;i<this.recommendPlan?.length;i++){
    //     let data=this.recommendPlan[i].companyName
       
    //     this.companyName1.push(data)
    //   }
    //  this.companyName2=  [...new Set(this.companyName1)];
 
      
    });
   
   
  }

  getDateRange(){
   
    this.api
      .get(
        this.config.routes.dateRange )
    .subscribe((resp: any) => {
     
      this.startDate = resp.startDate;
      this.endDate = resp.endDate;
    
      this.getrecommendPlan(this.startDate,this.endDate)
       // Format the dates to dd MMM yyyy format
    const formattedStartDate = this.datePipe.transform(this.startDate, 'dd MMM yyyy');
    const formattedEndDate = this.datePipe.transform(this.endDate, 'dd MMM yyyy');

    // Patch the formatted dates to the form controls
    this.weekDate.controls['currentWeekStart'].setValue(formattedStartDate);
    this.weekDate.controls['currentWeekEnd'].setValue(formattedEndDate);
    });
    
    console.log('data',this.recommendPlan)
  }
  pageChange(event: number,startDate, endDate){
    this.pageIndex = event || 1;
    this.ind = (this.pageIndex - 1) * this.limit + 1;
    console.log("date"+this.startDate+" "+this.endDate)
  
    this.api
      .get(
        this.config.routes.recommendPlan +
          '?page=' +
          this.pageIndex +
          '&limit=' +this.limit+
           '&fromDate=' +
          this.startDate +
          '&toDate=' +
          this.endDate 
      ).subscribe((resp:any)=>{
        this.recommendPlan = resp.data;
        this.allCount = resp.count;

      })

  }

  
  getCustomerList(){
    this.api
    .get(
      this.config.routes.customer +'?limit=ALL').subscribe((resp:any)=>{
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


filterCompany() {
  const uniqueCompanyTypes = new Set();
  this.customerList.forEach(customer => {
    const companyName = customer.companyName.toLowerCase();
  
    if (companyName.includes(this.searchText.toLowerCase())) {
  
      uniqueCompanyTypes.add(companyName);
    }
  });
  
  
  this.filteredCompanyList = Array.from(uniqueCompanyTypes).sort().slice(0, 4);
}
  
 
      ngOnInit() {
        this.loginBuildForm()
        this.searchC();
        this.getDateRange();
        // this.getrecommendPlan(this.startDate,this.endDate);
       this.getRegionTerritoryList();
       this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 500);
    this. getCustomerList();
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
      this.searchCus=false;
      this.paginator=true;
      
    
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
      this.searchCus=false;
      this.paginator=true;
    
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
      this.searchCus=false;
      this.paginator=true;
    
    };
    resetForm4()
    {
      this.spinner.show();
      setTimeout(() => {
        this.spinner.hide();
      }, 200);
      this.searchText1 = '';
  this.filteredCompanyList = [];
      this.filter4.reset();
      this.noDataFound = false;
      this.table=true;
      this.searchCus=false;
      this.paginator=true;
      
      
      
    
      
    }
    // 
    // remove row
    // removeRow(row) {
    //   const index = this.filteredData.indexOf(row);
    //   this.filteredData.splice(index,1);
    // }
    
    
  
    loginBuildForm(){
      this.filter1 = new FormGroup({
        "industryType":new FormControl(null,[Validators.required]),
        "region":new FormControl(null,[Validators.required]),
        "territory":new FormControl('',[Validators.required]),
      }),
      this.filter2=new FormGroup({
       
        "range":new FormControl(null,[Validators.required]),
        "status":new FormControl(null,[Validators.required]),
        "territory":new FormControl(null,[Validators.required])
    
      }),
      this.filter3=new FormGroup({
        
        "range":new FormControl(null,[Validators.required]),
        "status":new FormControl(null,[Validators.required])
      }),
    this.filter4=new FormGroup({
      "companyName":new FormControl(null,[Validators.required])
    }),
    this.weekDate=new FormGroup({
      "currentWeekStart":new FormControl(),
      "currentWeekEnd":new FormControl()


     

    })
      // this.weekDate.patchValue({
      //   currentWeekStart:this.startDate,
      //   currentWeekEnd:this.endDate
      // })
    }
    
    
     

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
    


  //   // 
  //   selectRow(rowData: any) {
      
  //   this.selectedRows.push(rowData);
  // }
  selectRow(Data: Data, tableType: string) {
    if (this.selectedRows.findIndex((c:any) => c.activityID === Data.activityID) !== -1) {

      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Activity already added !',
        showCancelButton: false,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        timer: 4000,
    
        
       
      })
        
     
      return;
    }
    
   
    
    this.selectedRows.push(Data);
    if (tableType === 'customerList') {
      (this.respData.indexOf(Data), 1);
    } else if (tableType === 'recommendations') {
    (this.recommendPlan.indexOf(Data), 1);
 
    }
    console.log('select',this.selectedRows)
    Data.isCopied=true;
  
}


   
  // remove row
removeRow(Data:Data) {
  const index = this.selectedRows.indexOf(Data);
  this.selectedRows.splice(index,1);
  Data.isCopied=false
  
}


getButtonLabel(Data: Data): string {
  if (Data.isCopied) {
    return 'Added';
  } else {
    return 'Add to Plan';
  }
}

// removeAll(){
//   setTimeout(()=>{                           // <<<---using ()=> syntax
//     this.selectedRows = [];
 
    
// }, 2000);
  
// }
// removeAll() {
//   setTimeout(() => {
//     this.selectedRows.forEach(row => {
//       row.isCopied = false;
//     });
//     this.selectedRows = [];
//   }, 2000);
// }
// getCurrentWeekDates() {
//   const currentDate = new Date();
//   const currentDay = currentDate.getDay();
//   const diff = currentDate.getDate() - currentDay + (currentDay === 0 ? -6 : 1); // adjust when day is sunday
//   const weekStartDate = new Date(currentDate.setDate(diff)) ;
//   const weekEndDate = new Date(currentDate.setDate(diff + 5));
//   return {
//     start: weekStartDate,
//     end: weekEndDate
//   };
// }
// getCurrentWeekDates() {
//   const currentDate = new Date();
//   const currentDay = currentDate.getDay();

//   // if today is Sunday, show previous week start and end dates
//   if (currentDay === 0) {
//     currentDate.setDate(currentDate.getDate() - 7);
//   }

//   const diff = currentDate.getDate() - currentDay + (currentDay === 0 ? -6 : 1); // adjust when day is Sunday
//   const weekStartDate = new Date(currentDate.setDate(diff));
//   const weekEndDate = new Date(currentDate.setDate(diff + 5));
 
//   return {
//     start: weekStartDate,
//     end: weekEndDate
//   };
// }

conformSave() {
  Swal.fire({
    title: 'Are you sure?',
    text: 'Do you confirm to add plan',
    icon: 'success',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes!',
    allowOutsideClick: false,
    allowEscapeKey: false,
  }).then((result) => {
    if (result.isConfirmed) {
      this.saveCopiedData();
    } else {
      // Swal.fire("Fail to Back");
    }
  });
}

saveCopiedData(){
  
  // const url = 'http://192.168.1.4:3002/weeklyPlan';

  const customerData = this.selectedRows.map(row => {
    return {
      customerID: row.customerID,
      activityID: row.activityID
      
    };
  });

  const savedData = {
        startDate: this.datePipe.transform(this.weekDate.value.currentWeekStart,'yyyy-MM-dd'),
        endDate: this.datePipe.transform(this.weekDate.value.currentWeekEnd,'yyyy-MM-dd'),
        data: customerData
  };
  
  console.log('select',savedData)
  // this.http
  //       .post('http://192.168.1.5:3002/weeklyPlan',savedData )
     
  this.api.post(this.config.routes.weeklyPlanCreate, savedData)
  .subscribe((resp:any) => {
    console.log(resp);
       
    if(resp.status==true){
      this.spinner.show();
      Swal.fire({
        icon: 'success',
        title: 'sucess',
        text: 'Your work has been saved',
        showCancelButton: false,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        // timer: 4000,
      })
      this.spinner.hide();
      this.router.navigate(['/week-plan-list']);
      
    }else {
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



customerTable(){
  this.table=false
}
searchC(){
  this.searchCus=false;
}
paginate(){
  this.paginator=false
}
customerView(customerId) {
  // this.router.navigate(['customer-view/' + customerId]);
  window.open("/customer-view/"+customerId, "_blank");
}
clearform(){
  this.filter1.reset();
}
onInputClick() {
 
  
  const myFieldControl = this.filter4.get('companyName');
  myFieldControl.setValue('');
  myFieldControl.markAsUntouched();
  
}

}
