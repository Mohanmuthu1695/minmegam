import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from 'src/app/providers/api.service';
import { configService } from 'src/app/providers/config/config';

@Component({
  selector: 'app-people-view',
  templateUrl: './people-view.component.html',
  styleUrls: ['./people-view.component.scss'],
})
export class PeopleViewComponent implements OnInit {
  config: any;

  respData: any = [];

  peopleID: number;
  regionData: any = [];
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private api: ApiService,
    private configService: configService,
    private spinner: NgxSpinnerService
  ) {
    this.config = configService.config;
  }

  ngOnInit(): void {
    this.getData();
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 500);
  }
  onBack() {
    this.router.navigate(['/people-list']);
  }
  getData() {
    this.activatedRoute.paramMap.subscribe((params) => {
      this.peopleID = parseInt(params.get('id'));
      this.api
        .get(this.config.routes.people + '/' + this.peopleID)
        .subscribe((resp: any) => {
          this.respData = resp.peopleData;
          this.regionData = resp.regionData;

          console.log('data', this.respData);
        });

      console.log('id', this.peopleID);
    });
  }
}
