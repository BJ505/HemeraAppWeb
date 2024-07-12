import { CommonModule } from '@angular/common';
import { ViewEncapsulation } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { JsonProductsService } from '../../service/product/json-products.service';
import { JsonCartService } from '../../service/cart/json-cart.service';
import { JsonUserService } from '../../service/user/json-user.service';
import { UtilsService } from '../../service/utils/utils.service';

/**
 * Componente de dashboard.
 * @implements {OnInit}
 */
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, NavBarComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  encapsulation: ViewEncapsulation.None,
  providers: [JsonProductsService, JsonCartService, JsonUserService, UtilsService]
})

export class DashboardComponent implements OnInit {
  productos: any[] = [];

  constructor(
    private userService: JsonUserService,
    private productService: JsonProductsService,
    private cartService: JsonCartService,
    private utilsService: UtilsService
  ) {}

  /**
   * Método que se llama al inicializar el componente.
   * Si está en el navegador, intenta cargar productos dinámicamente.
   * @returns {void}
   */
  ngOnInit(): void {
    this.productService.getProducts().subscribe(data => {
      this.productos = data;
    });    
  }
  
  /**
   * Agrega un producto al carrito.
   * @param {number} id - Identificador del producto.
   * @param {number} cant - Cantidad del producto a agregar.
   * @returns {void}
   */
  public addToCart(id: number, cant: number): void {
    // console.log(id, cant);
    const sessionUser = this.userService.getCurrentUser();
    if (!sessionUser) {
      this.utilsService.mostrarAlerta('Usuario no autenticado, porfavor primero inicie sesión.','warning')
      return;
    }
    this.cartService.addProductCart(id, cant, sessionUser.username)
    .then(() => {
      console.log('Producto agregado correctamente al carrito!');
      // Puedes realizar más acciones después de agregar el item
    })
    .catch(error => {
      console.error('Error agregando producto al carrito:', error);
      // Manejar el error adecuadamente
    });
  }
}
