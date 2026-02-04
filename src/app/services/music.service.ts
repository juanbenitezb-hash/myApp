import { Injectable } from '@angular/core';
import * as datosArtistasLocales from './artistas.json'; 

@Injectable({
  providedIn: 'root',
})
export class MusicService {

  private urlServidor = 'https://music.fly.dev';

  constructor() {}

  obtenerCanciones() {
    return fetch(`${this.urlServidor}/tracks`).then(res => res.json());
  }

  obtenerAlbumes() {
    return fetch(`${this.urlServidor}/albums`).then(res => res.json());
  }

  obtenerArtistas() {
    return fetch(`${this.urlServidor}/artists`).then(res => res.json());
  }

  obtenerCancionesPorAlbum(idAlbum: string) {
    return fetch(`${this.urlServidor}/tracks/album/${idAlbum}`).then(res => res.json());
  }

  obtenerCancionesPorArtista(idArtista: string) {
    return fetch(`${this.urlServidor}/tracks/artist/${idArtista}`).then(res => res.json());
  }

  obtenerArtistasLocales() {
    return datosArtistasLocales;
  }
}
