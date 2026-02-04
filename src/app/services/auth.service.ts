import { Injectable } from '@angular/core';
import { StorageService } from './storage'; 

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private almacenamiento: StorageService) { }

  async validarAcceso(credenciales: any) {
    const usuario = await this.almacenamiento.obtener('perfil_usuario');
    
    if (usuario && usuario.correoE === credenciales.email && usuario.contrasena === credenciales.password) {
      // Guardar que el usuario está logueado
      await this.almacenamiento.guardar('usuario_logeado', true);
      // Guardar los datos del usuario actual (para persistencia)
      await this.almacenamiento.guardar('usuario_actual', {
        email: credenciales.email,
        nombre: usuario.nombre
      });
      console.log('Usuario logueado exitosamente:', credenciales.email);
      return Promise.resolve();
    } else {
      return Promise.reject('Acceso denegado');
    }
  }

  async crearUsuario(datos: any) {
    return await this.almacenamiento.guardar('perfil_usuario', datos);
  }

  async cerrarSesion() {
    // Limpiar datos de sesión pero mantener intro_visto y tema
    await this.almacenamiento.eliminar('usuario_logeado');
    await this.almacenamiento.eliminar('usuario_actual');
    console.log('Sesión cerrada');
  }

  async obtenerUsuarioActual() {
    return await this.almacenamiento.obtener('usuario_actual');
  }

  async estaLogeado() {
    const usuarioLogeado = await this.almacenamiento.obtener('usuario_logeado');
    return !!usuarioLogeado;
  }
}