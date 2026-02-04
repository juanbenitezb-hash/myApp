import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
    this.iniciar();
  }

  async iniciar() {
    const storage = await this.storage.create();
    this._storage = storage;
  }

  async guardar(llave: string, valor: any) {
    return await this._storage?.set(llave, valor);
  }

  async obtener(llave: string) {
    return await this._storage?.get(llave);
  }

  async eliminar(llave: string) {
    await this._storage?.remove(llave);
  }
}