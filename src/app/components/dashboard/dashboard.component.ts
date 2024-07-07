import { CommonModule } from '@angular/common';
import { Renderer2, ElementRef, ViewEncapsulation } from '@angular/core';
import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { UserService } from '../login/user.service';
import { RouterModule } from '@angular/router';
import { JsonProductsService } from '../../service/product/json-products.service';
import { JsonCartService } from '../../service/cart/json-cart.service';

/**
 * Componente de dashboard.
 * @implements {OnInit}
 */
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  encapsulation: ViewEncapsulation.None,
  providers: [JsonProductsService, JsonCartService]
})

export class DashboardComponent implements OnInit {
  productos: any[] = [];
  /**
   * Constructor del componente de dashboard.
   * @param {UserService} userService - Servicio de usuario para manejar el carrito.
   * @param {Renderer2} renderer - Servicio para manipulación del DOM.
   * @param {ElementRef} el - Referencia al elemento nativo del componente.
   * @param {Object} platformId - Identificador de la plataforma.
   */
  constructor(
    private userService: UserService,
    private renderer: Renderer2,
    private el: ElementRef,
    @Inject(PLATFORM_ID) private platformId: Object,
    private productService: JsonProductsService,
    private cartService: JsonCartService
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
    console.log(id, cant);
    this.cartService.addProductCart(id, cant)
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
