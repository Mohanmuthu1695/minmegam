import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/providers/api.service';
import { configService } from 'src/app/providers/config/config';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss'],
})
export class CustomerListComponent implements OnInit {
  config: any;
  respData: any = [];
  pageIndex: number = 1;
  count: number = 0;
  limit: number = 10;
  ind: number;
  filterVal: string;
  admin: boolean = false;
  it: boolean;
  sales: boolean;
  filteredData: any[];
  firstname:any
  constructor(
    private configService: configService,
    private api: ApiService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private http: HttpClient,
  ) {
    this.config = this.configService.config;
  }

  ngOnInit(): void {
    this.filterVal=''
    this.getData();
    let c = JSON.parse(localStorage.getItem('currentUser'));
    if (c.type == 'ADMIN') {
      this.admin = true;
      this.it = true;
      // this.sales = false;
    }
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 500);
    
    
    // this.api.getAllData().subscribe((res) => {
    //   console.log(res.data, 'res=>');
    // this.userData = res.data;
    // });
  }
  applyFilter(event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filterVal = filterValue;
    console.log(this.filterVal);
    this.pageIndex = 1; // reset the page index when searching
    this.ind = 1; // reset the index when searching
  
    if (this.filterVal === '') {
      this.getData();
    } else {
      // this.http
      // .get(
      //   'http://192.168.1.69:3002/customer'+
      this.api
        .get(
          this.config.routes.customer +
            '?page=' +
            this.pageIndex +
            '&limit=' +
            10 +
            '&search=' +
            this.filterVal
        )
        .subscribe(
          (resp: any) => {
            try {
              this.respData = resp.data;
              this.count = resp.allCount;
              console.log(this.respData);
              console.log('api called');
            } catch (err) {
              console.log(err);
            }
          },
          (err) => {
            console.error(err);
          },
          () => console.log('hi')
        );
    }
  }
  pageChange(event: number) {
    this.pageIndex = event || 1;
    this.ind = (this.pageIndex - 1) * this.limit + 1;
  
    console.log('search', event);
    if (this.filterVal === '') {
      this.getData();
    } else {
      // this.http
      // .get(
      //   'http://192.168.1.69:3002/customer'+
      this.api
        .get(
          this.config.routes.customer +
            '?page=' +
            this.pageIndex +
            '&limit=' +
            this.limit +
            '&search=' +
            this.filterVal
        )
        .subscribe(
          (resp: any) => {
            try {
              this.respData = resp.data;
              this.count = resp.allCount;
              console.log(this.respData);
              console.log('this.count', this.count);
              console.log('api called');
            } catch (err) {
              console.log(err);
            }
          },
          (err) => {
            console.error(err);
          },
          () => {
            console.log('hi');
            // this.ngOnInit();
          }
        );
    }
  }


  

  customerView(id) {
    // this.router.navigate(['customer-view/' + id]);
    window.open("/customer-view/"+id, "_blank");
  }
  // customerView(customerId) {
  //   // this.router.navigate(['customer-view/' + customerId]);
  //   window.open("/customer-view/"+customerId, "_blank");
  // }
  customerEdit(id) {
    this.router.navigate(['customer-edit/' + id]);
  }

getData() {
  console.log('api called');
  if (this.filterVal == '') {
      //  this.http
      // .get(
      //   'http://192.168.1.69:3002/customer'
    this.api
      .get(
        this.config.routes.customer 
        + '?page=' + this.pageIndex + '&limit=' + 10
      )
      .subscribe(
        (resp: any) => {
          try {
            this.respData = resp.data;
            this.count = resp.allCount;
            console.log('count', this.count);

            console.log(this.respData);
          } catch (err) {
            console.log(err);
          }
        },
        (err) => {
          console.error(err);
        },
        () => {
          console.log('hi');
        }
      );
  } else {
    // this.http
    // .get(
    //   'http://192.168.1.69:3002/customer'+
    this.api
      .get(
        this.config.routes.customer +
          '?page=' +
          this.pageIndex +
          '&limit=' +
          10 +
          '&search=' +
          this.filterVal
      )
      .subscribe(
        (resp: any) => {
          try {
            this.respData = resp.data;
            this.count = resp.allCount;
            console.log('count', this.count);

            console.log(this.respData);
          } catch (err) {
            console.log(err);
          }
        },
        (err) => {
          console.error(err);
        },
        () => {
          console.log('hi');
        }
      );
  }
}
  getDelete(data) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this customer',
      icon: 'success',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes!',
      allowOutsideClick: false,
      allowEscapeKey: false,
    }).then((result) => {
      if (result.isConfirmed) {
        this.customerDelete(data);
      } else {
        // Swal.fire("Fail to Back");
      }
    });
  }
  customerDelete(id) {
    console.log('idd', id);
    this.api.delete(this.config.routes.customer + '/' + id).subscribe(
      (resp: any) => {
        Swal.fire({
          // title: 'Are you sure?',
          text: 'Customer is deleted',
          // icon: 'success',
          // showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'OK',
        });
      },
      (err) => {},
      () => {
        this.ngOnInit();
      }
    );
  }
  search(){
    if(this.firstname  !=""){
      
      
      this.respData=this.respData.filter(res=>{
        return res.companyName.toLocaleLowerCase().match(this.firstname.toLocaleLowerCase());
  
      });
    }
    else if(this.firstname == ""){
this.ngOnInit()
    }
    
  }
}
