import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { StorageService } from '../services/storage'; 

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomePage implements OnInit {
  colorFondo: string = '#ffffff';
  colorTexto: string = '#000000';

  genres = [
    {
      title: 'Música Clásica',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTw2t6iEqMKVlwNdUZ8byXlDn5pJB8ZxDmDg&s',
      description: 'La música clásica es la corriente musical basada en las tradiciones de la música litúrgica y secular de Occidente.'
    },
    {
      title: 'Instrumentos Utilizados',
      image: 'https://i.pinimg.com/736x/2c/c5/35/2cc5355f302e6f2f6e6ec94c5f82eb6c.jpg',
      description: 'Se agrupan en familias: cuerdas, viento madera, viento metal, percusión y tecla, siendo el violín y el piano icónicos.'
    },
    {
      title: 'Grandes Artistas',
      image: 'https://edicion.pijamasurf.com:8082/imagen_nota/quienes_son_los_10_mas_grandes_compositores_de_musica_clasica_10.jpg',
      description: 'Incluyen a los pilares del clasicismo y romanticismo como Bach, Mozart, Beethoven, Chopin y Tchaikovsky.'
    }
  ];

  constructor(private router: Router, private storage: StorageService) {}

  async ngOnInit() {
    const colorGuardado = await this.storage.obtener('mitema');
    if (colorGuardado) {
      this.colorFondo = colorGuardado;
      this.colorTexto = this.colorFondo === '#ffffff' ? '#000000' : '#ffffff';
    }
  }

  async alternarTema() {
    if (this.colorFondo === '#ffffff') {
      this.colorFondo = '#121212';
      this.colorTexto = '#ffffff';
    } else {
      this.colorFondo = '#ffffff';
      this.colorTexto = '#000000';
    }
    await this.storage.guardar('mitema', this.colorFondo);
  }

  regresarAIntro() {
    this.router.navigateByUrl('/intro');
  }
}