import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { StorageService } from '../services/storage'; 

@Component({
  selector: 'app-intro',
  templateUrl: './intro.page.html',
  standalone: true,
  imports: [IonicModule]
})
export class IntroPage {
  constructor(private router: Router, private storage: StorageService) {}

  async finalizarIntro() {
    await this.storage.guardar('vistoIntro', 'si');
    this.router.navigateByUrl('/home');
  }
}