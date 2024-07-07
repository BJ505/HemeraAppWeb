import { Injectable } from '@angular/core';
import { Database, ref, set, get, update, remove, child, onValue } from '@angular/fire/database';
import { equalTo, orderByChild, query } from 'firebase/database';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JsonCartService {

  private dbPath = '/cart';

  constructor(private db: Database) {}

  getCart(): Observable<any[]> {
    const cartRef = ref(this.db, 'cart');

    return new Observable(observer => {
      onValue(cartRef, async snapshot => {
        const cartData = snapshot.val();
        if (cartData) {
          const productKeys = Object.keys(cartData);
          const productsArray: any[] = [];

          for (const productId of productKeys) {
            try {
              const productQuery = query(ref(this.db, `products`),orderByChild('id'), equalTo(parseInt(productId)));
              const productSnapshot = await get(productQuery);
              const productData = productSnapshot.val();

              if (productData) {
                const productKey = Object.keys(productData)[0];
                productsArray.push({
                  id: productId,
                  ...productData[productKey],
                  ...cartData[productId]
                });
              }else{
                console.log("not found.")
              }
            } catch (error) {
              console.error('Error fetching product data:', error);
            }
          }
          observer.next(productsArray);
        } else {
          observer.next([]);
        }
      });
    });
  }

  addProductCart(id: number, quantity: number): Promise<void> {

    const cartRef = ref(this.db, `${this.dbPath}/${id}`);

    return get(cartRef).then(cartSnapshot => {
      const existingProduct = cartSnapshot.val();
      if (existingProduct) {
        // El producto ya existe en el carrito, actualiza la cantidad
        const newQuantity = existingProduct.quantity + quantity;
        return update(cartRef, { quantity: newQuantity });
      } else {
        // El producto no existe en el carrito, agrega el nuevo producto
        const newItem = {
          id: id,
          quantity: quantity
        };
        return set(cartRef, newItem);
      }
    }).catch(error => {
      console.error('Error adding product to cart:', error);
      throw error;
    });
  }

  updateProductCart(id: number, updates: any): void {
    const itemRef = ref(this.db, `${this.dbPath}/${id}`);
    update(itemRef, updates);
  }

  deleteProductCart(id: number): Promise<void> {
    const itemRef = ref(this.db, `${this.dbPath}/${id}`);
    return remove(itemRef);
  }
}
