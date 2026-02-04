import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, NavController, AlertController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule]
})
export class LoginPage {
  formAcceso: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private navCtrl: NavController,
    private alertaCtrl: AlertController
  ) {
    this.formAcceso = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  async entrar() {
    try {
      await this.authService.validarAcceso(this.formAcceso.value);
      this.navCtrl.navigateRoot('/menu/home');
    } catch (error) {
      this.mostrarError('Acceso Denegado', 'El correo o la contraseña no son correctos.');
    }
  }

  irAlRegistro() {
    this.navCtrl.navigateForward('/register');
  }

  async mostrarError(titulo: string, mensaje: string) {
    const alerta = await this.alertaCtrl.create({
      header: titulo,
      message: mensaje,
      buttons: ['Entendido']
    });
    await alerta.present();
  }
}
