import { Component, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { UserService } from './user.service';
import { Renderer2, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

/**
 * Componente de inicio de sesión.
 * @implements {AfterViewInit}
 */
@Component({
  standalone: true,
  imports: [CommonModule, RouterModule],
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements AfterViewInit {
  
  /**
   * Constructor del componente.
   * @param {UserService} userService - Servicio de usuario para manejar el inicio de sesión.
   * @param {Renderer2} renderer - Servicio para manipulación del DOM.
   * @param {ElementRef} el - Referencia al elemento nativo del componente.
   * @param {Router} router - Servicio de enrutamiento de Angular.
   * @param {Object} platformId - Identificador de la plataforma.
   */
  constructor(
    private userService: UserService,
    private renderer: Renderer2,
    private el: ElementRef,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  /**
   * Método que se llama después de la inicialización de la vista del componente.
   * Maneja el evento de envío del formulario de inicio de sesión.
   * @returns {void}
   */
  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Manejar el formulario de inicio de sesión
      const formLogin = this.el.nativeElement.querySelector('#login-form') as HTMLFormElement;
      if (formLogin) {
        this.renderer.listen(formLogin, 'submit', (event: Event) => {
          event.preventDefault();
          event.stopPropagation();

          const emailOrUsername = (this.el.nativeElement.querySelector('#username') as HTMLInputElement).value;
          const password = (this.el.nativeElement.querySelector('#password') as HTMLInputElement).value;

          console.log('Formulario de inicio de sesión enviado:', { emailOrUsername, password });

          const loginExitoso = this.userService.iniciarSesion(emailOrUsername, password);
          if (loginExitoso) {
            console.log('Inicio de sesión exitoso:', { emailOrUsername });
            this.router.navigate(['/dashboard']);
          } else {
            console.log('Error en el inicio de sesión.');
          }
        });
      }
    }
  }
}
