import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  c: any;
  constructor() {}

  ngOnInit(): void {
    this.c = JSON.parse(localStorage.getItem('currentUser'));
  }
}
