import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/providers/api.service';
import { configService } from 'src/app/providers/config/config';
@Component({
  selector: 'app-reccomendation',
  templateUrl: './reccomendation.component.html',
  styleUrls: ['./reccomendation.component.scss'],
})
export class ReccomendationComponent implements OnInit {
  currentPage: number = 1; // current page number
  itemsPerPage: number = 10; // number of items per page
  totalPages: number;
  totalItems: number;

  pageIndex: number = 1;
  count: number = 0;
  limit: number =10;
    ind: number=1;
  config: any;
  recommendPlan: any = [];
  endDate: any;
  startDate: any;
  allCount: number;
  constructor(private api: ApiService, private configService: configService) {
    this.config = configService.config;
  }

  getrecommendPlan(startDate, endDate) {
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
        console.log("allCount",this.allCount)
      });
  }
  pageChange(event: number,startDate, endDate){
    this.pageIndex = event || 1;
    this.ind = (this.pageIndex - 1) * this.limit + 1;
    // console.log("date"+this.startDate+" "+this.endDate)
  
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

  getDateRange() {
    this.api.get(this.config.routes.dateRange).subscribe((resp: any) => {
      this.startDate = resp.startDate;
      this.endDate = resp.endDate;

      this.getrecommendPlan(this.startDate, this.endDate);
    });

    console.log('data', this.recommendPlan);
  }

  ngOnInit(): void {
    this.getDateRange();
    // this.getrecommendPlan(this.startDate,this.endDate);
  }
  customerView(customerId) {
    // this.router.navigate(['customer-view/' + customerId]);
    window.open('/customer-view/' + customerId, '_blank');
  }
}
