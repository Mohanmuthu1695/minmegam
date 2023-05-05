import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/providers/api.service';
import { configService } from 'src/app/providers/config/config';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit {
  admin: boolean = false;
  it: boolean = false;
  sales: boolean = false;
  config: any;
  recommendPlan: any = [];
  endDate: any;
  startDate: any;
  allCount:number;

  constructor(private router: Router,private api: ApiService, private configService: configService) {
    this.config = configService.config;
  }

  ngOnInit(): void {
    let c = JSON.parse(localStorage.getItem('currentUser'));
    if (c.type == 'ADMIN') {
      this.admin = true;
      this.it = false;
      this.sales = false;
    } else if (c.type == 'IT') {
      this.admin = false;
      this.it = true;
      this.sales = false;
      // this.router.navigate(['/customer-list']);
    } else if (c.type == 'SALES') {
      this.admin = false;
      this.it = false;
      this.sales = true;
      // this.router.navigate(['/customer-list']);
    }
    this.getDateRange();
  }

  logout() {
    let current = JSON.parse(localStorage.getItem('currentUser'));
    console.log('current', current);
    let data = JSON.parse(
      localStorage.getItem('currentUser' + current.type + current.uid)
    );

    localStorage.removeItem('currentUser' + current.type + current.uid);

    localStorage.clear();
    window.location.reload();
    this.router.navigate(['/']);
  }
  getDateRange() {
    this.api.get(this.config.routes.dateRange).subscribe((resp: any) => {
      this.startDate = resp.startDate;
      this.endDate = resp.endDate;

      this.getrecommendPlan(this.startDate, this.endDate);
    });

    console.log('data', this.recommendPlan);
  }
  getrecommendPlan(startDate, endDate) {
    this.api
      .get(
        this.config.routes.recommendPlan +
          '?fromDate=' +
          startDate +
          '&toDate=' +
          endDate 
         

      )
      .subscribe((resp: any) => {
        
        this.recommendPlan = resp.data;
        this.allCount = resp.count;
        
      });
  }
}
