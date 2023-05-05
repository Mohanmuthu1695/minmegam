import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from 'src/app/providers/api.service';
import { configService } from 'src/app/providers/config/config';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-people-list',
  templateUrl: './people-list.component.html',
  styleUrls: ['./people-list.component.scss'],
})
export class PeopleListComponent implements OnInit {
  config: any;
  respData: any = [];
  pageIndex: number = 1;
  count: number = 0;
  limit: number = 10;
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
 
  applyFilter(event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filterVal = filterValue;
    console.log(this.filterVal);
    this.pageIndex = 1; // reset the page index when searching
    this.ind = 1; // reset the index when searching
  
    if (this.filterVal === '') {
      this.getData();
    } else {
      this.api
        .get(
          this.config.routes.people +
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
      this.api
        .get(
          this.config.routes.people +
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
  
  peopleView(id) {
    console.log('id', id);
    this.router.navigate(['people-view/' + id]);
  }
  peopleEdit(id) {
    console.log('id', id);
    this.router.navigate(['people-edit/' + id]);
  }
  
  getData() {
    console.log('api called');
    if (this.filterVal == '') {
      this.api
        .get(
          this.config.routes.people + '?page=' + this.pageIndex + '&limit=' + 10
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
      this.api
        .get(
          this.config.routes.people +
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
      text: 'Do you want to delete this people',
      icon: 'success',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes!',
      allowOutsideClick: false,
      allowEscapeKey: false,
    }).then((result) => {
      if (result.isConfirmed) {
        this.peopleDelete(data);
      } else {
        // Swal.fire("Fail to Back");
      }
    });
  }
  peopleDelete(id) {
    console.log('idd', id);
    this.api.delete(this.config.routes.people + '/' + id).subscribe(
      (resp: any) => {
        Swal.fire({
          // title: 'Are you sure?',
          text: 'People is deleted',
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
