import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { Renderer2, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { JsonUserService } from '../../service/user/json-user.service';
import { UtilsService } from '../../service/utils/utils.service';

/**
 * Componente de inicio de sesión.
 * @implements {AfterViewInit}
 */
@Component({
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [JsonUserService,UtilsService]
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  /**
   * Constructor del componente.
   * @param {UserService} userService - Servicio de usuario para manejar el inicio de sesión.
   * @param {Renderer2} renderer - Servicio para manipulación del DOM.
   * @param {ElementRef} el - Referencia al elemento nativo del componente.
   * @param {Router} router - Servicio de enrutamiento de Angular.
   * @param {Object} platformId - Identificador de la plataforma.
   */
  constructor(
    private userService: JsonUserService,
    private utilsService: UtilsService,
    private renderer: Renderer2,
    private el: ElementRef,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

    submitLoginForm(){
    this.userService.authenticate(this.username, this.password)
      .then(user => {
        this.utilsService.mostrarAlerta('Usuario registrado exitosamente.', 'success');
        this.router.navigate(['/dashboard']);
        // Aquí puedes redirigir al usuario a otra página, almacenar el usuario en el estado de la aplicación, etc.
      })
      .catch(error => {
        this.utilsService.mostrarAlerta('Usuario o contraseña incorrecto.', 'danger');
      });
  }
}
