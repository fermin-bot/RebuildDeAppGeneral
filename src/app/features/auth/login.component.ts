import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CustomValidators } from '../../shared/validators/custom-validators';

import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { CardModule } from 'primeng/card';
import { MessagesModule } from 'primeng/messages';
import { Message, MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    InputTextModule, 
    PasswordModule, 
    ButtonModule, 
    CheckboxModule, 
    CardModule, 
    MessagesModule,
    RouterLink
  ],
  providers: [MessageService],
  template: `
    <div class="flex align-items-center justify-content-center min-h-screen surface-ground">
      <div class="surface-card p-4 shadow-2 border-round w-full lg:w-4">
        <div class="text-center mb-5">
          <div class="text-900 text-3xl font-medium mb-3">Bienvenido</div>
          <span class="text-600 font-medium line-height-3">Inicia sesión para continuar</span>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <p-messages [(value)]="messages" [enableService]="false" [closable]="true"></p-messages>

          <div class="mb-3">
            <label for="email" class="block text-900 font-medium mb-2">Email</label>
            <input 
              id="email" 
              type="text" 
              pInputText 
              formControlName="email" 
              class="w-full mb-3" 
              [ngClass]="{'ng-invalid ng-dirty': isFieldInvalid('email')}"
              placeholder="admin@example.com"
            >
            <small *ngIf="isFieldInvalid('email')" class="p-error block">
              Email es requerido y debe ser válido.
            </small>
          </div>

          <div class="mb-3">
            <label for="password" class="block text-900 font-medium mb-2">Contraseña</label>
            <p-password 
              id="password" 
              formControlName="password" 
              [toggleMask]="true" 
              styleClass="w-full" 
              inputStyleClass="w-full"
              [feedback]="false"
              placeholder="********"
            ></p-password>
            <small *ngIf="isFieldInvalid('password')" class="p-error block">
              Contraseña es requerida.
            </small>
          </div>

          <div class="flex align-items-center justify-content-between mb-5 gap-5">
            <div class="flex align-items-center">
              <p-checkbox formControlName="rememberMe" [binary]="true" inputId="rememberMe" styleClass="mr-2"></p-checkbox>
              <label for="rememberMe">Recordarme</label>
            </div>
            <a class="font-medium no-underline ml-2 text-blue-500 text-right cursor-pointer">¿Olvidaste tu contraseña?</a>
          </div>

          <button 
            pButton 
            pRipple 
            label="Iniciar Sesión" 
            icon="pi pi-user" 
            class="w-full"
            [loading]="loading"
            type="submit"
            [disabled]="loginForm.invalid || loading"
          ></button>
          
          <div class="mt-3 text-center">
            <small class="text-600">
              Admin: admin&#64;example.com / User: user&#64;example.com
            </small>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    :host ::ng-deep .p-password input {
      width: 100%;
      padding: 1rem;
    }
  `]
})
export class LoginComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm!: FormGroup;
  loading = false;
  messages: Message[] = [];

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email, CustomValidators.noSpaces()]],
      password: ['', [Validators.required]],
      rememberMe: [false]
    });
  }

  isFieldInvalid(field: string): boolean {
    const control = this.loginForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.messages = [];
    const { email, password } = this.loginForm.value;

    this.authService.login({ email, password }).subscribe({
      next: (response) => {
        this.loading = false;
        // Navigation is handled in AuthService or here?
        // AuthService usually just returns Observable.
        // But my AuthService mock navigates on logout, but not on login success?
        // Let's check AuthService implementation.
        // It saves session.
        // So I should navigate here.
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.loading = false;
        this.messages = [
          { severity: 'error', summary: 'Error', detail: error.message || 'Credenciales inválidas' }
        ];
      }
    });
  }
}
