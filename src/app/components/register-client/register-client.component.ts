import { Component } from '@angular/core';
import { Renderer2, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { JsonUserService } from '../../service/user/json-user.service';
import { UtilsService } from '../../service/utils/utils.service';

@Component({
  selector: 'app-register-client',
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  standalone: true,
  templateUrl: './register-client.component.html',
  styleUrls: ['../login/login.component.scss'],
  providers: [JsonUserService, UtilsService]
})
export class RegisterClientComponent {
  clientForm: FormGroup;

  constructor(
    private userService: JsonUserService,
    private utilsService: UtilsService,
    private renderer: Renderer2,
    private el: ElementRef,
    private fb: FormBuilder
  ) {
    this.clientForm = this.fb.group({
      user: this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        nombre: ['', [Validators.required]],
        username: ['', [Validators.required]],
        password: ['', [Validators.required]],
        usertype: ['client', [Validators.required]]
      })
    });
  }

  submitClientForm() {
    if (this.clientForm.valid) {
      const password = (this.el.nativeElement.querySelector('#password') as HTMLInputElement).value;
      const repeatpassword = (this.el.nativeElement.querySelector('#repeat-password') as HTMLInputElement).value;

      if (password !== repeatpassword) {
        alert('Las contraseñas no coinciden.');
        console.log('Las contraseñas no coinciden.');
        return;
      }

      const user = this.clientForm.value.user;
      console.log(user);

      this.userService.createUser(user)
        .then(success => {
          if (success) {
            this.utilsService.mostrarAlerta('Usuario registrado exitosamente.', 'success');
            this.clientForm.reset();
          } else {
            this.utilsService.mostrarAlerta('Error al crear el usuario, favor intente nuevamente.', 'danger');
            this.clientForm.reset();
          }
        })
        .catch(error => {
          this.utilsService.mostrarAlerta('Error al crear el usuario, favor intente nuevamente.', 'danger');
          this.clientForm.reset();
          console.log(error.message);
        });
    }
  }
}
