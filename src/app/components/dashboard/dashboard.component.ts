import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Renderer2, ElementRef, ViewEncapsulation } from '@angular/core';
import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { UserService } from '../login/user.service';
import { RouterModule } from '@angular/router';
import { JsonProductsService } from '../../service/json-products.service'
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

/**
 * Componente de dashboard.
 * @implements {OnInit}
 */
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  encapsulation: ViewEncapsulation.None,
  providers: [JsonProductsService]
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
    private jsonProductsService: JsonProductsService
  ) {}


  /**
   * Método que se llama al inicializar el componente.
   * Si está en el navegador, intenta cargar productos dinámicamente.
   * @returns {void}
   */
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.jsonProductsService.getJsonData().subscribe(data => {
          this.productos = data;
          console.log(this.productos);
      });
    }
  }
  
  /**
   * Agrega un producto al carrito.
   * @param {number} id - Identificador del producto.
   * @param {number} cant - Cantidad del producto a agregar.
   * @returns {void}
   */
  public addToCart(id: number, cant: number): void {
    const agregado = this.userService.addtocart(id, cant);
    if (agregado) {
      console.log("Producto agregado correctamente", agregado);
    }
  }
}
