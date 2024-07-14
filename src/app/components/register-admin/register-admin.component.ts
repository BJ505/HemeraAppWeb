import { Component} from '@angular/core';
import { Renderer2, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { JsonUserService } from '../../service/user/json-user.service'
import { UtilsService } from '../../service/utils/utils.service';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule,ReactiveFormsModule, FormsModule],
  selector: 'app-register-admin',
  templateUrl: './register-admin.component.html',
  styleUrls: ['../login/login.component.scss'],
  providers: [JsonUserService,UtilsService]
})
export class RegisterAdminComponent{

  adminForm !: FormGroup
  user: any = {};
  users: any[] = [];

  constructor(
    // private userService: UserService,
    private userService: JsonUserService,
    private utilsService: UtilsService,
    private renderer: Renderer2,
    private el: ElementRef,
    private fb: FormBuilder,
  ) {
    this.adminForm = this.fb.group({
      user: this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        nombre: ['', [Validators.required]],
        username: ['', [Validators.required]],
        password: ['', [Validators.required]],
        usertype: ['admin', [Validators.required]]
      })
    });
  }

  submitAdminForm(){
    if(this.adminForm.valid) {
      const password = (this.el.nativeElement.querySelector('#password') as HTMLInputElement).value;
      const repeatpassword = (this.el.nativeElement.querySelector('#repeat-password') as HTMLInputElement).value;
      
      if (password !== repeatpassword) {
        alert('Las contraseñas no coinciden.');
        console.log('Las contraseñas no coinciden.');
        return;
      }
      this.user = this.adminForm.value.user;
      console.log(this.user);
      
      this.userService.createUser(this.user)
      .then(success => {
        if (success) {
          this.utilsService.mostrarAlerta('Usuario registrado exitosamente.', 'success');
          this.adminForm.reset();
        } else {
          this.utilsService.mostrarAlerta('Error al crear el usuario, favor intente nuevamente.', 'danger');
          this.adminForm.reset();
        }
      })
      .catch(error => {
        this.utilsService.mostrarAlerta('Error al crear el usuario, favor intente nuevamente.', 'danger');
        this.adminForm.reset();
        console.log(error.message);
      });
    }
  }
}