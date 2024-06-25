import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterAdminComponent } from './register-admin.component';
import { UserService } from '../login/user.service';
import { Renderer2, ElementRef } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { of } from 'rxjs';

describe('RegisterAdminComponent', () => {
  let component: RegisterAdminComponent;
  let fixture: ComponentFixture<RegisterAdminComponent>;
  let mockUserService: jasmine.SpyObj<UserService>;
  let mockRenderer: jasmine.SpyObj<Renderer2>;
  let mockElementRef: ElementRef;

  beforeEach(async () => {
    mockUserService = jasmine.createSpyObj('UserService', ['registrarUsuario']);
    mockRenderer = jasmine.createSpyObj('Renderer2', ['selectRootElement']);
    mockElementRef = new ElementRef(document.createElement('div'));

    await TestBed.configureTestingModule({
      imports: [CommonModule, RouterModule, ReactiveFormsModule],
      declarations: [RegisterAdminComponent],
      providers: [
        FormBuilder,
        { provide: UserService, useValue: mockUserService },
        { provide: Renderer2, useValue: mockRenderer },
        { provide: ElementRef, useValue: mockElementRef }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a form with controls', () => {
    expect(component.adminForm.contains('email')).toBeTruthy();
    expect(component.adminForm.contains('nombre')).toBeTruthy();
    expect(component.adminForm.contains('username')).toBeTruthy();
    expect(component.adminForm.contains('password')).toBeTruthy();
  });

  it('should make the email control required', () => {
    const control = component.adminForm.get('email');
    control?.setValue('');
    expect(control?.valid).toBeFalsy();
  });

  it('should make the name control required', () => {
    const control = component.adminForm.get('nombre');
    control?.setValue('');
    expect(control?.valid).toBeFalsy();
  });

  it('should make the username control required', () => {
    const control = component.adminForm.get('username');
    control?.setValue('');
    expect(control?.valid).toBeFalsy();
  });

  it('should make the password control required', () => {
    const control = component.adminForm.get('password');
    control?.setValue('');
    expect(control?.valid).toBeFalsy();
  });

  describe('submitAdminForm', () => {
    beforeEach(() => {
      spyOn(window, 'alert');
    });

    it('should not submit if the form is invalid', () => {
      component.adminForm.setValue({ email: '', nombre: '', username: '', password: '' });
      component.submitAdminForm();
      expect(mockUserService.registrarUsuario).not.toHaveBeenCalled();
    });

    it('should show an alert if passwords do not match', () => {
      component.adminForm.setValue({ email: 'test@test.com', nombre: 'Test', username: 'testuser', password: 'password' });
      mockElementRef.nativeElement.querySelector = jasmine.createSpy().and.callFake((selector: string) => {
        return {
          value: selector === '#repeat-password' ? 'differentpassword' : 'password'
        };
      });

      component.submitAdminForm();
      expect(window.alert).toHaveBeenCalledWith('Las contraseñas no coinciden.');
      expect(mockUserService.registrarUsuario).not.toHaveBeenCalled();
    });

    it('should submit if the form is valid and passwords match', () => {
      component.adminForm.setValue({ email: 'test@test.com', nombre: 'Test', username: 'testuser', password: 'password' });
      mockElementRef.nativeElement.querySelector = jasmine.createSpy().and.callFake((selector: string) => {
        return {
          value: 'password'
        };
      });

      mockUserService.registrarUsuario.and.returnValue(true);

      component.submitAdminForm();
      expect(mockUserService.registrarUsuario).toHaveBeenCalledWith('test@test.com', 'Test', 'password', 'testuser', 'admin');
      expect(component.adminForm.valid).toBeTrue();
    });

    it('should reset the form if registration is successful', () => {
      component.adminForm.setValue({ email: 'test@test.com', nombre: 'Test', username: 'testuser', password: 'password' });
      mockElementRef.nativeElement.querySelector = jasmine.createSpy().and.callFake((selector: string) => {
        return {
          value: 'password'
        };
      });

      mockUserService.registrarUsuario.and.returnValue(true);

      component.submitAdminForm();
      expect(component.adminForm.valid).toBeTrue();
      expect(component.adminForm.pristine).toBeTrue();
    });
  });
});