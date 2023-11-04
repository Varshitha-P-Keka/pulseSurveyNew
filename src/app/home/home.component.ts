import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Router,RouterLink } from '@angular/router';

import { LeftNavComponent } from '../navbar/left-nav/left-nav.component';
import { TopNavComponent } from '../navbar/top-nav/top-nav.component';
import { UserDataService } from '../services/user-data.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule,LeftNavComponent,TopNavComponent,RouterOutlet,RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  userDetails:any;

  constructor(private udService:UserDataService, public router:Router){}

  ngOnInit(){
    this.udService.getCredentials().subscribe((next:any)=>{
      if(JSON.stringify(next)!='{}'){
        this.userDetails = next;
        localStorage.setItem('currentUser',JSON.stringify(this.userDetails));
      }
    })
    this.router.navigate(['pulseSurvey/home/openSurveys']);
  }
}