import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { JsonUserService } from '../../service/user/json-user.service';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss',
  providers: [JsonUserService]
})
export class NavBarComponent implements OnInit{
  currentUser: any = null;
  constructor(
    private userService: JsonUserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.userService.getCurrentUser();
    console.log(this.currentUser);
  }

  logout(): void {
    this.userService.logout();
    console.log("cerrando sesión");
  }

}
