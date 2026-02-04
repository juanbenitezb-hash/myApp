import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA, OnDestroy } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { MusicService } from '../services/music.service';
import { StorageService } from '../services/storage';
import { SongsModalPage } from '../songs-modal/songs-modal.page';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomePage implements OnInit {
  albumes: any[] = [];
  artistas: any[] = [];
  
  modoTema: boolean = false;
  colorFondo: string = '#ffffff';
  colorTexto: string = '#000000';

  constructor(
    private musicService: MusicService,
    private storage: StorageService,
    private modalCtrl: ModalController
  ) {}

  // Reproductor
  audio: HTMLAudioElement | null = null;
  currentTrack: any = null;
  isPlaying: boolean = false;
  duration: number = 0; // segundos
  currentTime: number = 0; // segundos
  private _timer: any = null;

  async ngOnInit() {
    // Cargar tema guardado primero
    const temaSaved = await this.storage.obtener('modo_oscuro');
    if (temaSaved !== null && temaSaved !== undefined) {
      this.modoTema = temaSaved;
    }
    this.actualizarColores();

    // Cargar álbumes y artistas
    this.albumes = await this.musicService.obtenerAlbumes();
    this.artistas = await this.musicService.obtenerArtistas();
    
    console.log('Home inicializado - Tema cargado:', this.modoTema);
  }

  async cambiarTema() {
    this.modoTema = !this.modoTema;
    this.actualizarColores();
    await this.storage.guardar('modo_oscuro', this.modoTema);
  }

  actualizarColores() {
    if (this.modoTema) {
      this.colorFondo = '#121212';
      this.colorTexto = '#ffffff';
      document.body.classList.add('dark');
    } else {
      this.colorFondo = '#ffffff';
      this.colorTexto = '#000000';
      document.body.classList.remove('dark');
    }
  }

  async abrirAlbum(album: any) {
    const modal = await this.modalCtrl.create({
      component: SongsModalPage,
      componentProps: { album: album }
    });
    return await modal.present();
  }

  async abrirArtista(artista: any) {
    const modal = await this.modalCtrl.create({
      component: SongsModalPage,
      componentProps: { 
        album: { id: artista.id, name: 'Obras de ' + artista.name, image: artista.image } 
      }
    });
    return await modal.present();
  }

  async abrirFavoritos() {
    const favoritos = await this.storage.obtener('mis_favoritos');
    const modal = await this.modalCtrl.create({
      component: SongsModalPage,
      componentProps: { 
        album: { name: 'Mis Favoritos', image: 'https://cdn-icons-png.flaticon.com/512/833/833472.png' },
        canciones: favoritos || [] 
      }
    });
    return await modal.present();
  }

  async ngOnDestroy(): Promise<void> {
    if (this.audio) {
      this.audio.pause();
      this.audio.src = '';
      this.audio = null;
    }
    if (this._timer) {
      clearInterval(this._timer);
      this._timer = null;
    }
  }

  private async loadInitialTrack() {
    try {
      const tracks: any[] = await this.musicService.obtenerCanciones();
      if (tracks && tracks.length > 0) {
        const track = tracks.find(t => t.url || t.preview || t.audio || t.file) || tracks[0];
        this.setTrack(track);
      }
    } catch (err) {
      console.error('Error cargando pista inicial:', err);
    }
  }

  private setTrack(track: any) {
    if (!track) return;
    this.currentTrack = track;
    let src: any = track.url || track.preview || track.audio || track.file || track.stream || track.preview_url || track.audio_url || track.download_url || track.src || null;
    if (src && typeof src === 'object') {
      if (Array.isArray(src) && src.length) src = src[0];
      if (src && typeof src === 'object' && src.url) src = src.url;
    }
    if (!src) {
      console.warn('Track sin URL de audio:', track);
      return;
    }

    if (this.audio) {
      this.audio.pause();
      this.audio.src = '';
      this.audio = null;
    }

    console.log('setTrack -> using src:', src, 'track:', track);
    this.audio = new Audio(src);
    try { this.audio.crossOrigin = 'anonymous'; } catch(e) {}
    this.audio.preload = 'metadata';

    this.audio.addEventListener('loadedmetadata', () => {
      this.duration = Math.floor(this.audio?.duration || 0);
    });

    this.audio.addEventListener('timeupdate', () => {
      this.currentTime = Math.floor(this.audio?.currentTime || 0);
    });

    this.audio.addEventListener('ended', () => {
      this.isPlaying = false;
      this.currentTime = 0;
    });

    this.audio.addEventListener('error', (ev:any) => {
      console.error('Audio error event:', ev, 'audio.src=', this.audio?.src);
    });

    if (this._timer) clearInterval(this._timer);
    this._timer = setInterval(() => {
      if (this.audio && !isNaN(this.audio.currentTime)) {
        this.currentTime = Math.floor(this.audio.currentTime);
      }
    }, 500);
  }

  async togglePlayPause() {
    if (!this.audio) {
      await this.loadInitialTrack();
      if (!this.audio) return;
    }

    if (this.isPlaying) {
      this.audio?.pause();
      this.isPlaying = false;
    } else {
      try {
        const p = this.audio?.play();
        if (p instanceof Promise) await p;
        this.isPlaying = true;
      } catch (err) {
        console.error('Error reproduciendo:', err);
        this.isPlaying = false;
      }
    }
  }

  seekTo(seconds: number) {
    if (!this.audio) return;
    const s = Math.max(0, Math.min(seconds, this.duration || 0));
    this.audio.currentTime = s;
    this.currentTime = Math.floor(s);
  }

  formatTime(s: number) {
    if (!s || isNaN(s)) return '0:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec < 10 ? '0' + sec : sec}`;
  }

  async ngAfterViewInit() {
    await this.loadInitialTrack();
  }
}