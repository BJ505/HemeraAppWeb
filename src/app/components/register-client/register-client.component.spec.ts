import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterClientComponent } from './register-client.component';
import { UserService } from '../login/user.service';
import { Renderer2, ElementRef } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router'; // Importar ActivatedRoute
import { of } from 'rxjs';

describe('RegisterClientComponent', () => {
  let component: RegisterClientComponent;
  let fixture: ComponentFixture<RegisterClientComponent>;
  let mockUserService: jasmine.SpyObj<UserService>;
  let mockRenderer: jasmine.SpyObj<Renderer2>;
  let mockElementRef: ElementRef;

  // Mock de ActivatedRoute
  const mockActivatedRoute = {
    snapshot: {
      params: of({}) // Puedes definir aquí los parámetros que esperas recibir
    }
  };

  beforeEach(async () => {
    mockUserService = jasmine.createSpyObj('UserService', ['registrarUsuario']);
    mockRenderer = jasmine.createSpyObj('Renderer2', ['selectRootElement']);
    mockElementRef = new ElementRef(document.createElement('div'));

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        RouterModule,
        ReactiveFormsModule,
        RegisterClientComponent  // Importa el componente standalone aquí
      ],
      providers: [
        FormBuilder,
        { provide: UserService, useValue: mockUserService },
        { provide: Renderer2, useValue: mockRenderer },
        { provide: ElementRef, useValue: mockElementRef },
        { provide: ActivatedRoute, useValue: mockActivatedRoute } // Proveedor de ActivatedRoute
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a form with controls', () => {
    expect(component.clientForm.contains('email')).toBeTruthy();
    expect(component.clientForm.contains('nombre')).toBeTruthy();
    expect(component.clientForm.contains('username')).toBeTruthy();
    expect(component.clientForm.contains('password')).toBeTruthy();
  });

  it('should make the email control required', () => {
    const control = component.clientForm.get('email');
    control?.setValue('');
    expect(control?.valid).toBeFalsy();
  });

  it('should make the name control required', () => {
    const control = component.clientForm.get('nombre');
    control?.setValue('');
    expect(control?.valid).toBeFalsy();
  });

  it('should make the username control required', () => {
    const control = component.clientForm.get('username');
    control?.setValue('');
    expect(control?.valid).toBeFalsy();
  });

  it('should make the password control required', () => {
    const control = component.clientForm.get('password');
    control?.setValue('');
    expect(control?.valid).toBeFalsy();
  });

  describe('submitClientForm', () => {
    beforeEach(() => {
      spyOn(window, 'alert');
    });

    it('should not submit if the form is invalid', () => {
      component.clientForm.setValue({ email: '', nombre: '', username: '', password: '' });
      component.submitClientForm();
      expect(mockUserService.registrarUsuario).not.toHaveBeenCalled();
    });

    it('should show an alert if passwords do not match', () => {
      component.clientForm.setValue({ email: 'test@test.com', nombre: 'Test', username: 'testuser', password: 'password' });
      mockElementRef.nativeElement.querySelector = jasmine.createSpy().and.callFake((selector: string) => {
        return {
          value: selector === '#repeat-password' ? 'differentpassword' : 'password'
        };
      });

      component.submitClientForm();
      expect(window.alert).toHaveBeenCalledWith('Las contraseñas no coinciden.');
      expect(mockUserService.registrarUsuario).not.toHaveBeenCalled();
    });

    it('should reset the form if registration is successful', () => {
      component.clientForm.setValue({ email: 'test@test.com', nombre: 'Test', username: 'testuser', password: 'password' });
      mockElementRef.nativeElement.querySelector = jasmine.createSpy().and.callFake((selector: string) => {
        return {
          value: 'password'
        };
      });

      mockUserService.registrarUsuario.and.returnValue(true);

      component.submitClientForm();
      expect(component.clientForm.valid).toBeTrue();
      expect(component.clientForm.pristine).toBeTrue();
    });
  });
});
