import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Renderer2, ElementRef, ViewEncapsulation } from '@angular/core';
import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { UserService } from '../login/user.service';
import { RouterModule } from '@angular/router';

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
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit {

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
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  /**
   * Método que se llama al inicializar el componente.
   * Si está en el navegador, intenta cargar productos dinámicamente.
   * @returns {void}
   */
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      /*
       * Aún no puedo solucionar el tema de agregar botones dinámicamente y que funcione el evento click
       * Consultar al profesor, por ahora solo agregaré en el HTML los productos.
       */
      // var grilla = this.el.nativeElement.querySelector('.grid-productos');
      // const fetchedData = fetch('./assets/data/productos.json');
      // fetchedData
      // .then((response) => response.json())
      // .then((data) => {
      //   console.log(data);
      //   var productos = data;
      //   for (const producto of productos) {
      //       // Llenar grilla
      //       grilla.insertAdjacentHTML('beforeend',`
      //         <div class="product">
      //           <div class="card">
      //             <div class="ccc">
      //               <p class="text-center"><img src="`+producto.imagen+`" class="imw"></p>
      //             </div>
      //             <div class="card-body">
      //               <h5 class="text-center">`+producto.nombre+`</h5> 
      //               <p class="text-center">Precio: $`+producto.precio+`</p>
      //               <p class="text-center"><input type="button" value="Agregar al carrito" (click)="addToCart(`+producto.id+`, 1)" class="add-to-cart cc1"></p>
      //             </div>
      //           </div>
      //         </div>`);   
      //   }
      // });
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
