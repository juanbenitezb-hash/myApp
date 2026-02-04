import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { StorageService } from '../services/storage';

@Injectable({
  providedIn: 'root'
})
export class IntroGuard implements CanActivate {

  constructor(
    private almacenamiento: StorageService,
    private rutas: Router
  ) {}

  async canActivate() {
    const introVista = await this.almacenamiento.obtener('intro_visto');

    // Si ya vio la intro, permitir acceso
    if (introVista) {
      console.log('Intro ya fue vista, acceso permitido');
      return true;
    } else {
      // Si no ha visto la intro, redirigir
      console.log('Intro no vista, redirigiendo a intro');
      this.rutas.navigateByUrl('/intro');
      return false;
    }
  }
}