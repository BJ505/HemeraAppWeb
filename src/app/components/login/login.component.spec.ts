import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { UserService } from './user.service';
import { Renderer2, ElementRef } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockUserService: jasmine.SpyObj<UserService>;
  let mockRenderer: jasmine.SpyObj<Renderer2>;
  let mockElementRef: ElementRef;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockUserService = jasmine.createSpyObj('UserService', ['iniciarSesion']);
    mockRenderer = jasmine.createSpyObj('Renderer2', ['listen']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockElementRef = new ElementRef(document.createElement('div'));

    await TestBed.configureTestingModule({
      imports: [CommonModule, RouterModule],
      declarations: [LoginComponent],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: Renderer2, useValue: mockRenderer },
        { provide: ElementRef, useValue: mockElementRef },
        { provide: Router, useValue: mockRouter },
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should listen to form submit event if platform is browser', () => {

    const formLogin = document.createElement('form');
    formLogin.id = 'login-form';
    mockElementRef.nativeElement.appendChild(formLogin);

    fixture.detectChanges();

    component.ngAfterViewInit();
    expect(mockRenderer.listen).toHaveBeenCalled();
  });

  it('should not listen to form submit event if platform is not browser', () => {
    component.ngAfterViewInit();
    expect(mockRenderer.listen).not.toHaveBeenCalled();
  });

  it('should handle form submit event and call iniciarSesion on UserService', () => {

    const formLogin = document.createElement('form');
    formLogin.id = 'login-form';
    const usernameInput = document.createElement('input');
    usernameInput.id = 'username';
    usernameInput.value = 'testuser';
    formLogin.appendChild(usernameInput);
    const passwordInput = document.createElement('input');
    passwordInput.id = 'password';
    passwordInput.value = 'password';
    formLogin.appendChild(passwordInput);
    mockElementRef.nativeElement.appendChild(formLogin);

    fixture.detectChanges();

    component.ngAfterViewInit();

    const submitEvent = new Event('submit');
    formLogin.dispatchEvent(submitEvent);

    expect(mockUserService.iniciarSesion).toHaveBeenCalledWith('testuser', 'password');
  });

  it('should navigate to /dashboard if login is successful', () => {
    mockUserService.iniciarSesion.and.returnValue(true);

    const formLogin = document.createElement('form');
    formLogin.id = 'login-form';
    const usernameInput = document.createElement('input');
    usernameInput.id = 'username';
    usernameInput.value = 'testuser';
    formLogin.appendChild(usernameInput);
    const passwordInput = document.createElement('input');
    passwordInput.id = 'password';
    passwordInput.value = 'password';
    formLogin.appendChild(passwordInput);
    mockElementRef.nativeElement.appendChild(formLogin);

    fixture.detectChanges();

    component.ngAfterViewInit();

    const submitEvent = new Event('submit');
    formLogin.dispatchEvent(submitEvent);

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should log error message if login is not successful', () => {
    mockUserService.iniciarSesion.and.returnValue(false);
    spyOn(console, 'log');

    const formLogin = document.createElement('form');
    formLogin.id = 'login-form';
    const usernameInput = document.createElement('input');
    usernameInput.id = 'username';
    usernameInput.value = 'testuser';
    formLogin.appendChild(usernameInput);
    const passwordInput = document.createElement('input');
    passwordInput.id = 'password';
    passwordInput.value = 'password';
    formLogin.appendChild(passwordInput);
    mockElementRef.nativeElement.appendChild(formLogin);

    fixture.detectChanges();

    component.ngAfterViewInit();

    const submitEvent = new Event('submit');
    formLogin.dispatchEvent(submitEvent);

    expect(console.log).toHaveBeenCalledWith('Error en el inicio de sesión.');
  });
});
