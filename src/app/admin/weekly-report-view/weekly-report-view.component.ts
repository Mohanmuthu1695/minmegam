import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute} from '@angular/router';
import { ApiService } from 'src/app/providers/api.service';
import { configService } from 'src/app/providers/config/config';

@Component({
  selector: 'app-weekly-report-view',
  templateUrl: './weekly-report-view.component.html',
  styleUrls: ['./weekly-report-view.component.scss'],
})
export class WeeklyReportViewComponent implements OnInit {
  userIsAdmin:boolean=true
  admin: boolean = false;
  it: boolean = false;
  sales: boolean = false;
  planId: any;
  config: any;
  fromTo:FormGroup
  weeklyReportView: any=[];
  constructor(private router: Router,private activatedRoute: ActivatedRoute,private api: ApiService, private configService: configService,) {
    this.config = configService.config;
    this.comment=new FormGroup({
      "saveComment":new FormControl()
    });
   
    this.fromTo=new FormGroup({
      reportStartDate:new FormControl(),
      reportEndDate:new FormControl()
    })
  
  }
  comment:FormGroup

  ngOnInit(): void {
    this.getweeklyReportView();
    let c = JSON.parse(localStorage.getItem('currentUser'));
    if (c.type == 'ADMIN') {
      this.userIsAdmin= true;
    } else if (c.type == 'IT') {
      this.userIsAdmin= false;
    ;
    } else if (c.type == 'SALES') {
      this.userIsAdmin= false;
  
    }
  
  
  }
  onBack() {
    this.router.navigate(['/week-report-list']);
   
  }
  getweeklyReportView(){
    this.activatedRoute.paramMap.subscribe((params) => {
      this.planId = params.get('id');
      console.log("id",this.planId)
    this.api
    .get(
      this.config.routes.weeklyReportView +'?wrID='+this.planId)
    .subscribe((resp: any) => {
      this.weeklyReportView = resp.data;
      console.log(this.weeklyReportView)
     
      this.fromTo.patchValue({
        reportStartDate: this.weeklyReportView[0]?.reportStartDate,
        reportEndDate:this.weeklyReportView[0]?.reportEndDate
      })
      })
   
   
  }
    )}
    customerView(customerId) {
      // this.router.navigate(['customer-view/' + customerId]);
      // const url=this.router.navigate(['customer-view/' + customerId]);
      
      
      window.open("/customer-view/"+customerId, "_blank");
    }
//     /weekly-report?value=comments&id=98
// BODY DATA ={"comments":"comments saved"}
    savecomment() {
      let data={
        comment:this.comment.value.saveComment,
        // id:this.planId
      }
    
      this.api.post(this.config.routes.weeklyReport +'?value=comments'+'&id='+this.planId ,data).subscribe((resp: any) => {
        console.log(resp);
        
      });
    }
}
