import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common'; 
import { MusicService } from '../services/music.service';
import { StorageService } from '../services/storage';

@Component({
  selector: 'app-songs-modal',
  templateUrl: './songs-modal.page.html',
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class SongsModalPage implements OnInit {
  @Input() album: any;
  @Input() canciones: any[] = [];
  favoritos: any[] = [];

  constructor(
    private modalCtrl: ModalController,
    private musicService: MusicService,
    private storage: StorageService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    await this.storage.iniciar();
    
    if (!this.canciones || this.canciones.length === 0) {
      if (this.album && this.album.id) {
        this.canciones = await this.musicService.obtenerCancionesPorAlbum(this.album.id);
      }
    }
    const guardados = await this.storage.obtener('mis_favoritos');
    this.favoritos = guardados || [];
    this.cdr.markForCheck();
  }

  async alternarFavorito(cancion: any) {
    const index = this.favoritos.findIndex(f => f.id === cancion.id);
    if (index > -1) {
      this.favoritos.splice(index, 1);
    } else {
      this.favoritos.push(cancion);
    }
    await this.storage.guardar('mis_favoritos', this.favoritos);
    this.favoritos = [...this.favoritos];
    this.cdr.markForCheck();
  }

  esFavorito(cancion: any): boolean {
    return this.favoritos.some(f => f.id === cancion.id);
  }

  seleccionarCancion(cancion: any) {
    console.log('Tocaste:', cancion.name);
  }

  cerrar() {
    this.modalCtrl.dismiss();
  }
}