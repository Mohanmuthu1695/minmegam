import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from 'src/app/providers/api.service';
import { configService } from 'src/app/providers/config/config';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-region-list',
  templateUrl: './region-list.component.html',
  styleUrls: ['./region-list.component.scss'],
})
export class RegionListComponent implements OnInit {
  config: any;
  limit: number = 10;
  respData: any;
  p: number = 1;
   count: number = 0;
  pageIndex: number = 1;
  resultCount: number;
  ind: number;
  filterVal: string;
  constructor(
    private configService: configService,
    private api: ApiService,
    private router: Router,
    private spinner: NgxSpinnerService
  ) {
    this.config = this.configService.config;
  }

  ngOnInit(): void {
    this.filterVal=''
    this.getData();
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 500);
  }
  pageChange(event: number) {
    this.pageIndex = event;
    console.log('this.pageIndex', this.pageIndex);
    this.ind = (this.pageIndex - 1) * this.limit + 1;

    console.log('search', event);
       if (this.filterVal === '') {
      this.getData();
    } else {
      this.api
        .get(
          this.config.routes.regionList +
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
            this.resultCount = resp.count;
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
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    // this.dataSource.filter = filterValue.trim().toLowerCase();
    this.filterVal = filterValue;
    console.log(this.filterVal);
    this.ind = 1;
     this.pageIndex = 1;
      if (this.filterVal === '') {
      this.getData();
    } else {
    this.api
      .get(
        this.config.routes.regionList +
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
            this.resultCount = resp.count;
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

  getData() {
    // console.log('pageIndex', this.pageIndex);
     if (this.filterVal == '') {
    this.api
      .get(
        this.config.routes.regionList +
          '?page=' +
          this.pageIndex +
          '&limit=' +
          this.limit
      )
      .subscribe(
        (resp: any) => {
          try {
            this.respData = resp.data;
            this.resultCount = resp.count;
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
     }else{
      this.api
      .get(
        this.config.routes.regionList +
          '?page=' +
          this.pageIndex +
          '&limit=' +
          10 +
          '&search=' +
          this.filterVal
      ).subscribe(
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
  regionView(id) {
    this.router.navigate(['region-view/' + id]);
  }
  regionAddTerritory(id) {
    this.router.navigate(['region-create/' + id]);
  }
  getDelete(data) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this region',
      icon: 'success',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes!',
      allowOutsideClick: false,
      allowEscapeKey: false,
    }).then((result) => {
      if (result.isConfirmed) {
        this.regionDelete(data);
      } else {
        // Swal.fire("Fail to Back");
      }
    });
  }
  regionDelete(id) {
    this.api.delete(this.config.routes.regionList + '/' + id).subscribe(
      (resp: any) => {
        Swal.fire({
          // title: 'Are you sure?',
          text: 'Region is deleted',
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
}
