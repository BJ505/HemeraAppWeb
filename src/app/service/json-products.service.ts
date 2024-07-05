import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JsonProductsService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer 897f9a27-a9fe-474b-9eb9-6b0da9b42354'
    })
  }

  private jsonUrl = 'https://firebasestorage.googleapis.com/v0/b/hemera-bf2cd.appspot.com/o/productos.json?alt=media&token=897f9a27-a9fe-474b-9eb9-6b0da9b42354';

  private lista:any;

  constructor(private http: HttpClient) {}

  getJsonData(): Observable<any> {
    return this.http.get(this.jsonUrl);

  }

  MetodoProductos(listaProductos:any) {
    console.log(listaProductos);
    this.http.post(this.jsonUrl,listaProductos,this.httpOptions).subscribe(
      response => {
        console.log('Archivo JSON sobrescrito con exito', response);
      },
      error => {
        console.error('Error al sobrescribir el archivo JSON', error);
      })
  }
}
