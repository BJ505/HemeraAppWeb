import { Component, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { UserService } from '../login/user.service';
import { Renderer2, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule,ReactiveFormsModule],
  selector: 'app-register-admin',
  templateUrl: './register-admin.component.html',
  styleUrls: ['../login/login.component.scss']
})
export class RegisterAdminComponent{

  adminForm !: FormGroup

  constructor(
    private userService: UserService,
    private renderer: Renderer2,
    private el: ElementRef,
    private fb: FormBuilder
  ) {
    this.adminForm = this.fb.group({
      email:['', [Validators.required, Validators.email]],
      nombre:['', [Validators.required]],
      username:['', [Validators.required]],
      password:['', [Validators.required]]      
    });
  }

  submitAdminForm(){
    if(this.adminForm.valid) {
      const email = (this.el.nativeElement.querySelector('#email') as HTMLInputElement).value;
          const name = (this.el.nativeElement.querySelector('#name') as HTMLInputElement).value;
          const password = (this.el.nativeElement.querySelector('#password') as HTMLInputElement).value;
          const repeatpassword = (this.el.nativeElement.querySelector('#repeat-password') as HTMLInputElement).value;
          const username = (this.el.nativeElement.querySelector('#username') as HTMLInputElement).value;
          const usertype = "admin";

          console.log('Formulario de registro enviado:', { email, name, username, usertype });0
          if (password !== repeatpassword) {
            alert('Las contraseñas no coinciden.');
            console.log('Las contraseñas no coinciden.');
            return;
          }
          const registroExitoso = this.userService.registrarUsuario(email, name, password, username, usertype);
          if (registroExitoso) {
            console.log('Registro exitoso:', { email, name, username, usertype });
            this.adminForm.reset();
          } else {
            console.log('Error en el registro.');
          }
    }
  }
}