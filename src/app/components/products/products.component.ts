import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { JsonProductsService } from '../../service/product/json-products.service';
import { Database, ref, set, update, remove, query, orderByChild, equalTo, get, push } from '@angular/fire/database';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NavBarComponent],
  templateUrl: './products.component.html',
  styleUrl: '../dashboard/dashboard.component.scss',
  providers: [JsonProductsService]
})
export class ProductsComponent implements OnInit {
  products: any[] = [];
  newProduct = {
    nombre: '',
    precio: 0,
    imagen: ''
  };
  private dbPath = '/products';
  originalProducts: any[] = []; // Para almacenar el estado original de los productos

  constructor(
    private db: Database,
    private productService: JsonProductsService
  ) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe(data => {
      this.products = data;
      this.originalProducts = JSON.parse(JSON.stringify(data)); // Copia profunda para restaurar en cancelación
    });
  }

  async addProduct(): Promise<void> {
    const productsRef = ref(this.db, this.dbPath);
    const snapshot = await get(productsRef);

    let newId = 1;
    if (snapshot.exists()) {
      const products = snapshot.val();
      const maxId = Math.max(...Object.values(products).map((product: any) => product.id));
      newId = maxId + 1;
    }

    const newProduct = {
      id: newId,
      nombre: this.newProduct.nombre,
      precio: this.newProduct.precio,
      imagen: this.newProduct.imagen
    };

    const newProductRef = push(productsRef);
    await set(newProductRef, newProduct);

    this.newProduct = { nombre: '', precio: 0, imagen: '' }; // Limpiar el formulario
  }

  editProduct(index: number): void {
    this.products[index].editing = true;
  }

  saveProduct(product: any): void {
    const updates = {
      id: product.id,
      nombre: product.nombre,
      precio: product.precio,
      imagen: product.imagen
    };
    this.updateProduct(product.id, updates).then(() => {
      product.editing = false;
    });
  }

  cancelEdit(product: any, index: number): void {
    product.nombre = this.originalProducts[index].nombre;
    product.precio = this.originalProducts[index].precio;
    product.imagen = this.originalProducts[index].imagen;
    product.editing = false;
  }

  async updateProduct(productId: number, updates: any): Promise<void> {
    const productsRef = ref(this.db, this.dbPath);
    const productQuery = query(productsRef, orderByChild('id'), equalTo(productId));
    const snapshot = await get(productQuery);

    if (snapshot.exists()) {
      const productKey = Object.keys(snapshot.val())[0];
      const itemRef = ref(this.db, `${this.dbPath}/${productKey}`);
      await set(itemRef, updates);  // Aquí usamos set para sobrescribir el producto existente
    } else {
      console.error('Product not found');
    }
  }

  async deleteProduct(productId: number): Promise<void> {
    const productsRef = ref(this.db, this.dbPath);
    const productQuery = query(productsRef, orderByChild('id'), equalTo(productId));
    const snapshot = await get(productQuery);

    if (snapshot.exists()) {
      const productKey = Object.keys(snapshot.val())[0];
      const itemRef = ref(this.db, `${this.dbPath}/${productKey}`);
      await remove(itemRef);
    } else {
      console.error('Product not found');
    }
  }
}
