import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { JsonUserService } from '../../service/user/json-user.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NavBarComponent],
  templateUrl: './users.component.html',
  styleUrl: '../dashboard/dashboard.component.scss',
  providers: [JsonUserService]
})
export class UsersComponent implements OnInit {

  users: any[] = [];
  originalUsers: any[] = []; // Para almacenar el estado original de los productos
  

  constructor(
    private userService: JsonUserService
  ) {}

  ngOnInit(): void {
    this.userService.getAllUsers().then(users => {
      this.users = users;
      this.originalUsers = JSON.parse(JSON.stringify(users)); // Copia profunda para restaurar en cancelación
    }).catch(error => {
      console.error('Error al obtener usuarios:', error);
    });
  }

  editUser(index: number): void {
    this.users[index].editing = true;
  }

  saveUser(user: any): void {
    const updates = {
      email: user.email,
      name: user.name,
      username: user.username,
      usertype: user.usertype,
      password: user.password
    };
    this.userService.updateUser(user.username, updates).then(() => {
      user.editing = false;
    });
  }

  cancelEdit(user: any, index: number): void {
    user.email = this.originalUsers[index].email;
    user.nombre = this.originalUsers[index].nombre;
    user.username = this.originalUsers[index].username;
    user.usertype = this.originalUsers[index].usertype;
    user.password = this.originalUsers[index].password;
    user.editing = false;
  }

  deleteUser(username: string): void {
    this.userService.deleteUser(username).then(() => {
      this.users = this.users.filter(user => user.username !== username);
    });
  }

}
