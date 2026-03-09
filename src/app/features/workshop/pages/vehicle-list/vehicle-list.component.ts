import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { WorkshopService } from '../../services/workshop.service';
import { Vehicle } from '../../models/workshop.model';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { ToolbarModule } from 'primeng/toolbar';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-vehicle-list',
  standalone: true,
  imports: [
    CommonModule, 
    TableModule, 
    ButtonModule, 
    InputTextModule, 
    TagModule, 
    CardModule,
    ToolbarModule,
    ToastModule
  ],
  providers: [MessageService],
  template: `
    <div class="card">
        <p-toast></p-toast>
        <p-toolbar styleClass="mb-4 gap-2">
            <ng-template pTemplate="left">
                <button pButton pRipple label="Nuevo Vehículo" icon="pi pi-plus" class="p-button-success mr-2" (click)="openNew()"></button>
            </ng-template>

            <ng-template pTemplate="right">
                <button pButton pRipple label="Exportar" icon="pi pi-upload" class="p-button-help"></button>
            </ng-template>
        </p-toolbar>

        <p-table 
            #dt 
            [value]="vehicles" 
            [rows]="10" 
            [paginator]="true" 
            [globalFilterFields]="['name', 'licensePlate', 'alias']"
            [tableStyle]="{'min-width': '75rem'}"
            [rowHover]="true"
            dataKey="id"
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} vehículos"
            [showCurrentPageReport]="true"
            [loading]="loading">
            
            <ng-template pTemplate="caption">
                <div class="flex align-items-center justify-content-between">
                    <h3 class="m-0">Gestión de Taller - Vehículos</h3>
                    <span class="p-input-icon-left">
                        <i class="pi pi-search"></i>
                        <input pInputText type="text" (input)="dt.filterGlobal($any($event.target).value, 'contains')" placeholder="Buscar..." />
                    </span>
                </div>
            </ng-template>

            <ng-template pTemplate="header">
                <tr>
                    <th style="width: 5rem"></th>
                    <th pSortableColumn="name" style="min-width:15rem">Nombre <p-sortIcon field="name"></p-sortIcon></th>
                    <th pSortableColumn="licensePlate">Matrícula <p-sortIcon field="licensePlate"></p-sortIcon></th>
                    <th pSortableColumn="alias">Alias <p-sortIcon field="alias"></p-sortIcon></th>
                    <th pSortableColumn="kilometers">Kilómetros <p-sortIcon field="kilometers"></p-sortIcon></th>
                    <th pSortableColumn="hours">Horas <p-sortIcon field="hours"></p-sortIcon></th>
                    <th pSortableColumn="status">Estado <p-sortIcon field="status"></p-sortIcon></th>
                    <th>Acciones</th>
                </tr>
            </ng-template>

            <ng-template pTemplate="body" let-vehicle>
                <tr>
                    <td>
                        <img [src]="vehicle.imageUrl || 'https://primefaces.org/cdn/primeng/images/demo/product/bamboo-watch.jpg'" [alt]="vehicle.name" width="50" class="shadow-4" />
                    </td>
                    <td>{{vehicle.name}}</td>
                    <td><span class="font-bold">{{vehicle.licensePlate}}</span></td>
                    <td>{{vehicle.alias || '-'}}</td>
                    <td>{{vehicle.kilometers | number}} km</td>
                    <td>{{vehicle.hours | number}} h</td>
                    <td>
                        <p-tag [value]="vehicle.status" [severity]="getSeverity(vehicle.status)"></p-tag>
                    </td>
                    <td>
                        <button pButton pRipple icon="pi pi-eye" class="p-button-rounded p-button-info mr-2" (click)="viewVehicle(vehicle)"></button>
                        <button pButton pRipple icon="pi pi-pencil" class="p-button-rounded p-button-warning mr-2"></button>
                        <button pButton pRipple icon="pi pi-trash" class="p-button-rounded p-button-danger"></button>
                    </td>
                </tr>
            </ng-template>
        </p-table>
    </div>
  `
})
export class VehicleListComponent implements OnInit {
  private workshopService = inject(WorkshopService);
  private router = inject(Router);
  private messageService = inject(MessageService);

  vehicles: Vehicle[] = [];
  loading: boolean = true;

  ngOnInit() {
    this.loadVehicles();
  }

  loadVehicles() {
    this.loading = true;
    this.workshopService.getVehicles().subscribe({
      next: (data) => {
        this.vehicles = data;
        this.loading = false;
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los vehículos' });
        this.loading = false;
      }
    });
  }

  getSeverity(status: string): 'success' | 'secondary' | 'info' | 'warning' | 'danger' | 'contrast' | undefined {
    switch (status) {
      case 'active':
        return 'success';
      case 'maintenance':
        return 'warning';
      case 'inactive':
        return 'danger';
      default:
        return undefined;
    }
  }

  viewVehicle(vehicle: Vehicle) {
    this.router.navigate(['/workshop/vehicle', vehicle.id]);
  }

  openNew() {
      // TODO: Implement Create Dialog or Navigate to Create Page
      this.messageService.add({ severity: 'info', summary: 'Próximamente', detail: 'Formulario de creación en desarrollo' });
  }
}
