import { Injectable } from '@angular/core';
import { Database, ref, set, get, update, remove, child, onValue } from '@angular/fire/database';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JsonProductsService {

  private dbPath = '/products';

  constructor(private db: Database) {}

  getProducts(): Observable<any[]> {
    const dbRef = ref(this.db, this.dbPath);
    return new Observable(observer => {
      onValue(dbRef, snapshot => {
        const data = snapshot.val();
        if (data) {
          const itemsArray = Object.keys(data).map(key => ({ key, ...data[key] }));
          observer.next(itemsArray);
        } else {
          observer.next([]);
        }
      });
    });
  }
}
