import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }

  /**
     * Muestra una alerta en la interfaz de usuario.
     * @param {string} mensaje - Mensaje de la alerta.
     * @param {string} tipo - Tipo de alerta (por ejemplo, 'success', 'danger').
     * @private
     */
  mostrarAlerta(mensaje: string, tipo: string): void {
    const alertaDiv = document.createElement('div');
    alertaDiv.className = `alert alert-${tipo}`;
    alertaDiv.appendChild(document.createTextNode(mensaje));
    const container = document.querySelector('.container');
    if (container) {
        const firstChild = container.firstChild;
        if (firstChild) {
            container.insertBefore(alertaDiv, firstChild);
        } else {
            container.appendChild(alertaDiv);
        }

        setTimeout(() => {
            const alerta = document.querySelector('.alert');
            if (alerta) {
                alerta.remove();
            }
        }, 6000);
    }
}
}
