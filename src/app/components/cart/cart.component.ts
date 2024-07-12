import { CommonModule } from '@angular/common';
import { Component, ElementRef, Inject, OnInit, PLATFORM_ID, Renderer2, ViewEncapsulation } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { JsonCartService } from '../../service/cart/json-cart.service';
import { JsonUserService } from '../../service/user/json-user.service';
import { UtilsService } from '../../service/utils/utils.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.component.html',
  styleUrl: '../dashboard/dashboard.component.scss',
  encapsulation: ViewEncapsulation.None,
  providers: [JsonCartService, JsonUserService, UtilsService]
})
export class CartComponent implements OnInit {
  carrito: any[] = [];
  total=0; 

  constructor(
    private userService: JsonUserService,
    private cartService: JsonCartService,
    private utilsService: UtilsService

  ) {}

  ngOnInit(): void {
    const sessionUser = this.userService.getCurrentUser();
    this.cartService.getCart(sessionUser.username).subscribe(data => {
      this.carrito = data;

      //Obtener total del carrito
      for(let j=0;j<this.carrito.length;j++){   
        this.total+= (this.carrito[j].precio  * this.carrito[j].quantity);
      }  
    });  
  }

  public deleteProductCart(id: number): void {
    const sessionUser = this.userService.getCurrentUser();
    this.cartService.deleteProductCart(id, sessionUser.username)
    .then(() => {
      this.utilsService.mostrarAlerta("Producto agregado con éxito!", 'success');
    })
    .catch(error => {
      this.utilsService.mostrarAlerta("No se pudo agregar el producto", 'danger');
      console.error('Error agregando producto al carrito:', error);
      // Manejar el error adecuadamente
    });
  }
}
