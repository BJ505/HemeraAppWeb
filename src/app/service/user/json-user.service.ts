import { Injectable } from '@angular/core';
import { Database, ref, set, get, update, remove, child, onValue } from '@angular/fire/database';
import { equalTo, orderByChild, query } from 'firebase/database';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JsonUserService {

  private dbPath = '/users';
  private currentUser: any = null;

  constructor(private db: Database) {}

  // Crear un nuevo usuario
  createUser(user: any): Promise<boolean> {
    const newUserRef = ref(this.db, `${this.dbPath}/${user.username}`);
    return set(newUserRef, user)
      .then(() => true)
      .catch(error => {
        console.error('Error creating user:', error);
        return false;
      });
  }

  // Obtener un usuario por username
  getUser(username: string): Promise<any> {
    const userRef = ref(this.db, `${this.dbPath}/${username}`);
    return get(userRef).then(snapshot => {
      if (snapshot.exists()) {
        return snapshot.val();
      } else {
        throw new Error('Usuario no encontrado');
      }
    });
  }

  // Obtener todos los usuarios
  getAllUsers(): Promise<any[]> {
    const usersRef = ref(this.db, this.dbPath);
    return get(usersRef).then(snapshot => {
      if (snapshot.exists()) {
        return Object.values(snapshot.val());
      } else {
        return [];
      }
    });
  }

  // Actualizar un usuario por username
  updateUser(username: string, user: any): Promise<void> {
    const userRef = ref(this.db, `${this.dbPath}/${username}`);
    return update(userRef, user);
  }

  // Eliminar un usuario por username
  deleteUser(username: string): Promise<void> {
    const userRef = ref(this.db, `${this.dbPath}/${username}`);
    return remove(userRef);
  }

  // Autenticar usuario
  authenticate(username: string, password: string): Promise<any> {
    const usersRef = query(ref(this.db, this.dbPath), orderByChild('username'), equalTo(username));
    
    return get(usersRef).then(snapshot => {
      if (snapshot.exists()) {
        const userData = snapshot.val();
        const userId = Object.keys(userData)[0]; // Asumiendo que username es único
        const user = userData[userId];
        
        // Verificar la contraseña
        if (user.password === password) {
          this.setCurrentUser(user);
          return { ...user, id: userId }; // Retornar el usuario con su ID
        } else {
          throw new Error('Contraseña incorrecta');
        }
      } else {
        throw new Error('Usuario no encontrado');
      }
    }).catch(error => {
      console.error('Error authenticating user:', error);
      throw error;
    });
  }

  // Establecer el usuario actual y almacenar en localStorage
  private setCurrentUser(user: any): void {
    this.currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  // Obtener el usuario actual
  getCurrentUser(): any {
    if (!this.currentUser) {
      this.currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    }
    return this.currentUser;
  }

  // Cerrar sesión
  logout(): void {
    this.currentUser = null;
    localStorage.removeItem('currentUser');
  }
}
