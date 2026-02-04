import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { StorageService } from '../services/storage';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private almacenamiento: StorageService,
    private rutas: Router
  ) {}

  async canActivate() {
    // Verificar si el usuario ya está logeado
    const usuarioLogeado = await this.almacenamiento.obtener('usuario_logeado');
    const perfilUsuario = await this.almacenamiento.obtener('perfil_usuario');

    if (usuarioLogeado && perfilUsuario) {
      console.log('Usuario autenticado, acceso permitido a home');
      return true;
    } else {
      console.log('Usuario no autenticado, redirigiendo a login');
      this.rutas.navigateByUrl('/login');
      return false;
    }
  }
}