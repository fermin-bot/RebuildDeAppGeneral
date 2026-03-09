import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { CardModule } from 'primeng/card';
import { PanelModule } from 'primeng/panel';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CardModule, PanelModule, DividerModule],
  template: `
    <div class="grid">
      <div class="col-12">
        <p-panel header="Resumen del Dashboard">
          <div class="flex flex-column md:flex-row md:align-items-center md:justify-content-between">
            <div>
              <h2 class="m-0 font-bold">¡Hola, {{ currentUser?.firstName }} {{ currentUser?.lastName }}!</h2>
              <p class="text-600 mt-2 mb-0">Rol asignado: <span class="font-semibold text-primary uppercase">{{ currentUser?.role }}</span></p>
            </div>
            <div class="mt-3 md:mt-0">
                <span class="text-500 text-sm">Última conexión: {{ today | date:'dd/MM/yyyy HH:mm' }}</span>
            </div>
          </div>
          
          <p-divider></p-divider>
          
          <div class="grid mt-4">
            <div class="col-12 md:col-6 lg:col-3">
              <p-card styleClass="h-full border-round-xl surface-card shadow-1">
                <div class="flex align-items-center justify-content-between mb-3">
                  <span class="text-500 font-medium">Ventas</span>
                  <div class="flex align-items-center justify-content-center bg-blue-100 border-round" style="width:2.5rem;height:2.5rem">
                    <i class="pi pi-shopping-cart text-blue-500 text-xl"></i>
                  </div>
                </div>
                <div class="text-900 font-medium text-xl">152</div>
                <span class="text-green-500 font-medium">24 nuevos </span>
                <span class="text-500">desde ayer</span>
              </p-card>
            </div>
            
            <div class="col-12 md:col-6 lg:col-3">
              <p-card styleClass="h-full border-round-xl surface-card shadow-1">
                <div class="flex align-items-center justify-content-between mb-3">
                  <span class="text-500 font-medium">Clientes</span>
                  <div class="flex align-items-center justify-content-center bg-orange-100 border-round" style="width:2.5rem;height:2.5rem">
                    <i class="pi pi-users text-orange-500 text-xl"></i>
                  </div>
                </div>
                <div class="text-900 font-medium text-xl">2,100</div>
                <span class="text-green-500 font-medium">%52+ </span>
                <span class="text-500">este mes</span>
              </p-card>
            </div>
            
            <div class="col-12 md:col-6 lg:col-3">
              <p-card styleClass="h-full border-round-xl surface-card shadow-1">
                <div class="flex align-items-center justify-content-between mb-3">
                  <span class="text-500 font-medium">Notificaciones</span>
                  <div class="flex align-items-center justify-content-center bg-purple-100 border-round" style="width:2.5rem;height:2.5rem">
                    <i class="pi pi-bell text-purple-500 text-xl"></i>
                  </div>
                </div>
                <div class="text-900 font-medium text-xl">12</div>
                <span class="text-orange-500 font-medium">3 pendientes </span>
                <span class="text-500">revisión</span>
              </p-card>
            </div>
            
            <div class="col-12 md:col-6 lg:col-3">
              <p-card styleClass="h-full border-round-xl surface-card shadow-1">
                <div class="flex align-items-center justify-content-between mb-3">
                  <span class="text-500 font-medium">Tareas</span>
                  <div class="flex align-items-center justify-content-center bg-cyan-100 border-round" style="width:2.5rem;height:2.5rem">
                    <i class="pi pi-check-square text-cyan-500 text-xl"></i>
                  </div>
                </div>
                <div class="text-900 font-medium text-xl">85%</div>
                <span class="text-green-500 font-medium">10+ </span>
                <span class="text-500">completadas hoy</span>
              </p-card>
            </div>
          </div>
        </p-panel>
      </div>
    </div>
  `,
  styles: [`
    :host ::ng-deep .p-panel-header {
      background-color: var(--surface-section);
    }
  `]
})
export class DashboardComponent implements OnInit {
  private authService = inject(AuthService);
  currentUser = this.authService.currentUserValue;
  today = new Date();

  ngOnInit() {}
}
