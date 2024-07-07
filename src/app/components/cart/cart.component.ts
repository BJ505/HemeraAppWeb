import { CommonModule } from '@angular/common';
import { Component, ElementRef, Inject, OnInit, PLATFORM_ID, Renderer2, ViewEncapsulation } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { JsonProductsService } from '../../service/product/json-products.service';
import { JsonCartService } from '../../service/cart/json-cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.component.html',
  styleUrl: '../dashboard/dashboard.component.scss',
  encapsulation: ViewEncapsulation.None,
  providers: [JsonProductsService, JsonCartService]
})
export class CartComponent implements OnInit {
  carrito: any[] = [];
  total=0; 

  constructor(
    // private userService: UserService,
    private renderer: Renderer2,
    private el: ElementRef,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
    private productService: JsonProductsService,
    private cartService: JsonCartService
  ) {}

  ngOnInit(): void {
    this.cartService.getCart().subscribe(data => {
      this.carrito = data;

      //Obtener total del carrito
      for(let j=0;j<this.carrito.length;j++){   
        this.total+= (this.carrito[j].precio  * this.carrito[j].quantity);
      }  
    });  
  }

  public deleteProductCart(id: number): void {
    this.cartService.deleteProductCart(id)
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
