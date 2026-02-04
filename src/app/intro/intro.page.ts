import { Component, CUSTOM_ELEMENTS_SCHEMA, ViewChild, AfterViewInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { StorageService } from '../services/storage';
import { CommonModule } from '@angular/common';
import { register } from 'swiper/element/bundle';

register();

@Component({
  selector: 'app-intro',
  templateUrl: './intro.page.html',
  styleUrls: ['./intro.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class IntroPage implements AfterViewInit {
  @ViewChild('swiperElement') swiperElement: any;

  currentSlide = 0;
  totalSlides = 4;
  private swiperInstance: any = null;

  slides = [
    {
      title: '🎵 Bienvenido a MusicApp',
      subtitle: 'Descubre el mundo de la música clásica',
      image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop',
      color: '#FF6B6B'
    },
    {
      title: '🎼 Explora Albumes',
      subtitle: 'Accede a una amplia colección de obras maestras',
      image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=400&fit=crop',
      color: '#4ECDC4'
    },
    {
      title: '👨‍🎤 Descubre Artistas',
      subtitle: 'Conoce a los compositores y músicos más destacados',
      image: 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=400&h=400&fit=crop',
      color: '#45B7D1'
    },
    {
      title: '❤️ Tu Biblioteca Personal',
      subtitle: 'Guarda tus canciones favoritas y disfruta en cualquier momento',
      image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop',
      color: '#F7DC6F'
    }
  ];

  constructor(private router: Router, private storage: StorageService) {}

  ngAfterViewInit() {
    // Inicializar Swiper después de que el template esté listo
    setTimeout(() => {
      if (this.swiperElement?.nativeElement) {
        this.swiperInstance = this.swiperElement.nativeElement.swiper;
        console.log('Swiper inicializado correctamente');
      }
    }, 500);
  }

  onSlideChange(event: any) {
    if (event && event.detail && event.detail[0]) {
      this.currentSlide = event.detail[0].activeIndex || 0;
      console.log('Slide cambiado a:', this.currentSlide);
    }
  }

  goToSlide(index: number) {
    if (this.swiperInstance) {
      this.swiperInstance.slideTo(index, 500, false);
      this.currentSlide = index;
    } else {
      console.warn('Swiper aún no está disponible');
    }
  }

  async finalizarIntro() {
    await this.storage.guardar('intro_visto', true);
    console.log('Intro completado, yendo a login');
    this.router.navigateByUrl('/login');
  }
}