import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { IonicModule, MenuController, ModalController } from '@ionic/angular';
import { StorageService } from '../services/storage';
import { AuthService } from '../services/auth.service';
import { SongsModalPage } from '../songs-modal/songs-modal.page';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule]
})
export class MenuPage {
  constructor(
    private router: Router,
    private storage: StorageService,
    private authService: AuthService,
    private menuCtrl: MenuController,
    private modalCtrl: ModalController
  ) {}

  async irAFavoritos() {
    this.menuCtrl.close();
    const favoritos = await this.storage.obtener('mis_favoritos');
    
    if (!favoritos || favoritos.length === 0) {
      alert('Aún no tienes favoritos marcados.');
      return;
    }

    const modal = await this.modalCtrl.create({
      component: SongsModalPage,
      componentProps: { 
        album: { name: 'Mis Favoritos', image: 'https://cdn-icons-png.flaticon.com/512/833/833472.png' },
        canciones: favoritos 
      }
    });
    return await modal.present();
  }

  verIntro() {
    this.menuCtrl.close();
    this.router.navigateByUrl('/intro');
  }

  async cerrarSesion() {
    // Usar AuthService para cerrar sesión correctamente
    await this.authService.cerrarSesion();
    this.menuCtrl.close();
    console.log('Sesión cerrada, redirigiendo a login');
    this.router.navigateByUrl('/login');
  }
}