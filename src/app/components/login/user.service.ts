import { Injectable } from '@angular/core';

/**
 * Interfaz que representa un usuario.
 */
interface Usuario {
    email: string;
    name: string;
    username: string;
    password: string;  
    usertype: string;
}

/**
 * Interfaz que representa un ítem en el carrito.
 */
interface Carrito {
    id: number;
    cant: number;
}

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private usuarios: Usuario[] = [];
    private carrito: Carrito[] = [];

    /**
     * Constructor del servicio de usuario.
     * Inicializa los usuarios y el carrito desde el almacenamiento local si está disponible.
     */
    constructor() {
        if (this.isLocalStorageAvailable()) {
            const usuariosGuardados = localStorage.getItem('usuarios');
            this.usuarios = usuariosGuardados ? JSON.parse(usuariosGuardados) : [];

            const carrito = localStorage.getItem('carrito');
            this.carrito = carrito ? JSON.parse(carrito) : [];
        } else {
            this.usuarios = [];
            this.carrito = [];
        }
    }

    /**
     * Registra un nuevo usuario.
     * @param {string} email - Correo electrónico del usuario.
     * @param {string} name - Nombre del usuario.
     * @param {string} password - Contraseña del usuario.
     * @param {string} username - Nombre de usuario.
     * @param {string} usertype - Tipo de usuario.
     * @returns {boolean} - Indica si el registro fue exitoso.
     */
    registrarUsuario(email: string, name: string, password: string, username: string, usertype: string): boolean {
        console.log('Intentando registrar usuario:', { email, name, username });
        const usuarioExistente = this.usuarios.find(user => user.email === email || user.username === username);
        if (usuarioExistente) {
            this.mostrarAlerta('El usuario ya existe.', 'danger');
            console.log('El usuario ya existe.');
            return false;
        }

        const nuevoUsuario: Usuario = { email, name, password, username, usertype };
        this.usuarios.push(nuevoUsuario);
        if (this.isLocalStorageAvailable()) {
            localStorage.setItem('usuarios', JSON.stringify(this.usuarios));
        }
        this.mostrarAlerta('Usuario registrado exitosamente.', 'success');
        console.log('Usuario registrado exitosamente:', nuevoUsuario);
        return true;
    }

    /**
     * Inicia sesión de un usuario.
     * @param {string} emailOrUsername - Correo electrónico o nombre de usuario.
     * @param {string} password - Contraseña del usuario.
     * @returns {boolean} - Indica si el inicio de sesión fue exitoso.
     */
    iniciarSesion(emailOrUsername: string, password: string): boolean {
        console.log('Intentando iniciar sesión:', { emailOrUsername, password });
        const usuario = this.usuarios.find(user => (user.email === emailOrUsername || user.username === emailOrUsername) && user.password === password);
        if (usuario) {
            this.mostrarAlerta('Inicio de sesión exitoso.', 'success');
            console.log('Inicio de sesión exitoso:', usuario);
            return true;
        } else {
            this.mostrarAlerta('Email/Usuario o contraseña incorrectos.', 'danger');
            console.log('Email/Usuario o contraseña incorrectos.');
            return false;
        }
    }

    /**
     * Agrega un ítem al carrito.
     * @param {number} id - Identificador del ítem.
     * @param {number} cant - Cantidad del ítem.
     * @returns {boolean} - Indica si la adición fue exitosa.
     */
    addtocart(id: number , cant: number ): boolean {
        const anadirnuevo: Carrito = { id, cant };
        this.carrito.push(anadirnuevo);
        if (this.isLocalStorageAvailable()) {
            localStorage.setItem('carrito', JSON.stringify(this.carrito));
        }
        this.mostrarAlerta('Producto agregado exitosamente.', 'success');
        console.log('Producto agregado exitosamente:', anadirnuevo);
        return true;
    }

    /**
     * Elimina un ítem del carrito.
     * @param {number} id - Identificador del ítem a eliminar.
     */
    deletefromcart(id: number): void {
        let newList = this.carrito;
        console.log(newList);
        let index = newList.findIndex(item => item.id === id);
        console.log(index);
        newList.splice(index, 1);
        console.log(newList);
        localStorage.setItem('carrito', JSON.stringify(newList));
    }

    /**
     * Muestra una alerta en la interfaz de usuario.
     * @param {string} mensaje - Mensaje de la alerta.
     * @param {string} tipo - Tipo de alerta (por ejemplo, 'success', 'danger').
     * @private
     */
    private mostrarAlerta(mensaje: string, tipo: string): void {
        const alertaDiv = document.createElement('div');
        alertaDiv.className = `alert alert-${tipo}`;
        alertaDiv.appendChild(document.createTextNode(mensaje));
        const container = document.querySelector('.container');
        if (container) {
            const firstChild = container.firstChild;
            if (firstChild) {
                container.insertBefore(alertaDiv, firstChild);
            } else {
                container.appendChild(alertaDiv);
            }

            setTimeout(() => {
                const alerta = document.querySelector('.alert');
                if (alerta) {
                    alerta.remove();
                }
            }, 6000);
        }
    }

    /**
     * Verifica si el almacenamiento local está disponible.
     * @returns {boolean} - Indica si el almacenamiento local está disponible.
     * @private
     */
    private isLocalStorageAvailable(): boolean {
        try {
            const test = '__test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            return false;
        }
    }
}
