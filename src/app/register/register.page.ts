import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule]
})
export class RegisterPage {
  formRegistro: FormGroup;

  constructor(
    private constructorFormulario: FormBuilder,
    private servicioAuth: AuthService,
    private navegacion: NavController
  ) {
    this.formRegistro = this.constructorFormulario.group({
      nombre: ['', [Validators.required]],
      correo: ['', [Validators.required, Validators.email]],
      clave: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  async registrarUsuario() {
    const datosParaGuardar = {
      nombre: this.formRegistro.value.nombre,
      correoE: this.formRegistro.value.correo, 
      contrasena: this.formRegistro.value.clave
    };

    try {
      await this.servicioAuth.crearUsuario(datosParaGuardar);
      console.log('Usuario guardado con éxito');
      this.navegacion.navigateBack('/login');
    } catch (error) {
      console.error('Error al registrar:', error);
    }
  }
}