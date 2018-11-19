import { Component, OnInit } from '@angular/core';
import {UserService} from '../services/user.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit {

  constructor(    private userService:UserService) { }

  ngOnInit() {
  }
/*
  printusers(){
    this.userService.getUsers().subscribe(res=>{
  this.users=res;
  console.log(this.users);
    });
  }

  getUser(id:string){
      this.userService.getuser(id).subscribe(res=>{
        this.user = res
        console.log(this.user);
      });
  }
*/ 
}
