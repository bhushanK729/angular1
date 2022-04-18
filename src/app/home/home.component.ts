import { Component, OnInit } from '@angular/core';
import { User, UserResp } from '@app/models/user';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  user: UserResp;
  company = []

  constructor() { }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem("user")) as UserResp;

    this.company = this.user.data.company.split(",")
  }

  show(name: any){
    alert(name)
  }
}
