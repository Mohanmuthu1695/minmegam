import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/providers/api.service';
import { Location } from '@angular/common';

import { configService } from 'src/app/providers/config/config';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-region-view',
  templateUrl: './region-view.component.html',
  styleUrls: ['./region-view.component.scss'],
})
export class RegionViewComponent implements OnInit {
  regionID: any;
  config: any;
  respData: any = [];
  territoryData: any;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private api: ApiService,
    private configService: configService,
    private location: Location,
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
    this.location.back();
  }
  getData() {
    this.activatedRoute.paramMap.subscribe((params) => {
      this.regionID = parseInt(params.get('id'));
      this.api
        .get(this.config.routes.regionList + '/' + this.regionID)
        .subscribe((resp: any) => {
          this.respData = resp.data;
          this.territoryData = resp.territory;
          console.log('data', this.respData);
        });

      console.log('id', this.regionID);
    });
  }
}
