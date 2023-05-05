import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root',
})
export class configService {
  config: any;
  //   baseUrl = environment.production
  //     ? 'http.devapi.minvarisai'
  //     : 'http://localhost:3000';
  constructor() {
    this.config = {
      routes: {
        regionList: 'region',
        territory: 'territory',
        checkUserName: 'check-userName',
        login: 'login',
        people: 'people',
        customer: 'customer',
        peopleRegionTerritory: 'regionTerritory',
        cusSalesActivity: 'cusSalesActivity',
        salesActivityDetails: 'salesActivityDetails',
        regionTerritoryList: 'regionTerritoryList',
        weeklyPlan: 'weekly-plan',
        weeklyReport: 'weekly-report',
        recommendPlan: 'recommendPlan',
        dateRange: 'dateRange',
        weeklyPlanCreate: 'weeklyPlan',
        weeklyReportView: 'weeklyReport',
        stateList: 'stateList',
        districtList: 'districtList',
        regiondropDownList: 'regiondropDownList',
        industryType:'industryType',
        activityStatus:'activityStatus',
        targetProduct:'targetProduct'
      },
    };
  }
}
