import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Inject, PLATFORM_ID, Renderer2, ViewEncapsulation } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
// import { UserService } from './user.service';


interface Carrito {
  id: number;
  cant: number;
}
@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.component.html',
  styleUrl: '../dashboard/dashboard.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class CartComponent implements AfterViewInit {
  private carrito: Carrito[] = [];
  constructor(
    // private userService: UserService,
    private renderer: Renderer2,
    private el: ElementRef,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngAfterViewInit(): void {
    if (this.isLocalStorageAvailable()) {
      const carrito = localStorage.getItem('carrito');
      this.carrito = carrito ? JSON.parse(carrito) : [];
    }

    var tabla = this.el.nativeElement.querySelector('#table-carrito tbody');
    var totalfinal = this.el.nativeElement.querySelector('#totalfinal');
    const fetchedData = fetch('../assets/data/productos.json');
    
    fetchedData
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      var productos = data;
      console.log(this.carrito);
      var productoscarrito = this.carrito;
      var totalproductos = 0;
      for (const producto of productoscarrito) {
        let existeproducto = productos.filter((prdto: { id: number; }) => prdto.id === producto.id);
        let productoexistente = existeproducto[0];
        console.log(productoexistente);
        totalproductos += (productoexistente.precio * producto.cant);
        tabla.insertAdjacentHTML('beforeend',`<tr>
          <td>`+productoexistente.id+`</td>
          <td>`+productoexistente.nombre+`</td>
          <td>`+productoexistente.precio+`</td>
          <td>`+producto.cant+`</td>
          <td style="align: right;">`+(productoexistente.precio * producto.cant)+`</td>
          <td><button type="button" class="btn btn-primary hemera-button" (click)="deletefromcart(`+productoexistente.id+`)" >Eliminar del carrito</button></td>
        </tr>`);
      }
      totalfinal.insertAdjacentHTML('beforeend','$'+totalproductos);
    });
  }

  private isLocalStorageAvailable(): boolean {
    try {
    const test = '__test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
    } catch (e) {
    return false;
    }
}
}
