import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { WorkshopService } from '../../services/workshop.service';
import { Vehicle, VehicleNote, VehicleMaintenance } from '../../models/workshop.model';

import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TabViewModule } from 'primeng/tabview';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { TagModule } from 'primeng/tag';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-vehicle-detail',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    ButtonModule,
    TabViewModule,
    TableModule,
    DialogModule,
    InputTextModule,
    InputNumberModule,
    InputTextareaModule,
    CalendarModule,
    DropdownModule,
    ToastModule,
    TagModule
  ],
  providers: [MessageService],
  template: `
    <div class="card" *ngIf="vehicle">
        <p-toast></p-toast>
        
        <!-- Header -->
        <div class="flex justify-content-between align-items-center mb-4">
            <div class="flex align-items-center gap-3">
                <button pButton icon="pi pi-arrow-left" class="p-button-text" (click)="goBack()"></button>
                <h2 class="m-0">{{ vehicle.name }} <span class="text-500 text-xl ml-2">({{ vehicle.licensePlate }})</span></h2>
                <p-tag [value]="vehicle.status" [severity]="getSeverity(vehicle.status)"></p-tag>
            </div>
            <div class="flex gap-2">
                <button pButton label="Editar" icon="pi pi-pencil" class="p-button-warning" (click)="editVehicle()"></button>
                <button pButton label="Deshabilitar" icon="pi pi-ban" class="p-button-danger p-button-outlined"></button>
            </div>
        </div>

        <div class="grid">
            <!-- Vehicle Info -->
            <div class="col-12 md:col-4">
                <p-card header="Detalles del Vehículo">
                    <div class="flex flex-column gap-3">
                        <img [src]="vehicle.imageUrl || 'https://primefaces.org/cdn/primeng/images/demo/product/bamboo-watch.jpg'" alt="Vehicle Image" class="w-full border-round mb-3 shadow-2" />
                        
                        <div class="flex justify-content-between">
                            <span class="font-bold">Alias:</span>
                            <span>{{ vehicle.alias || '-' }}</span>
                        </div>
                        <div class="flex justify-content-between">
                            <span class="font-bold">Kilómetros:</span>
                            <span>{{ vehicle.kilometers | number }} km</span>
                        </div>
                        <div class="flex justify-content-between">
                            <span class="font-bold">Horas de uso:</span>
                            <span>{{ vehicle.hours | number }} h</span>
                        </div>
                        <div class="flex justify-content-between">
                            <span class="font-bold">ID Sistema:</span>
                            <span class="text-500">{{ vehicle.id }}</span>
                        </div>
                    </div>
                </p-card>
            </div>

            <!-- Tabs: Notes & Maintenance -->
            <div class="col-12 md:col-8">
                <p-tabView>
                    <!-- Notes Tab -->
                    <p-tabPanel header="Historial de Notas">
                        <div class="flex justify-content-end mb-3">
                            <button pButton label="Nueva Nota" icon="pi pi-plus" (click)="openNoteDialog()"></button>
                        </div>
                        
                        <p-table [value]="notes" [rows]="5" [paginator]="true" responsiveLayout="scroll">
                            <ng-template pTemplate="header">
                                <tr>
                                    <th>Fecha</th>
                                    <th>Descripción</th>
                                    <th>Mecánico</th>
                                    <th>Coste</th>
                                    <th>Horas</th>
                                </tr>
                            </ng-template>
                            <ng-template pTemplate="body" let-note>
                                <tr>
                                    <td>{{ note.date | date:'dd/MM/yyyy' }}</td>
                                    <td>{{ note.description }}</td>
                                    <td>{{ note.mechanicName }}</td>
                                    <td>{{ note.cost | currency:'EUR' }}</td>
                                    <td>{{ note.hours }} h</td>
                                </tr>
                            </ng-template>
                            <ng-template pTemplate="emptymessage">
                                <tr>
                                    <td colspan="5" class="text-center">No hay notas registradas.</td>
                                </tr>
                            </ng-template>
                        </p-table>
                    </p-tabPanel>

                    <!-- Maintenance Tab -->
                    <p-tabPanel header="Mantenimientos Periódicos">
                         <div class="flex justify-content-end mb-3">
                            <button pButton label="Configurar Mantenimiento" icon="pi pi-cog" class="p-button-secondary"></button>
                        </div>

                        <p-table [value]="maintenances" responsiveLayout="scroll">
                            <ng-template pTemplate="header">
                                <tr>
                                    <th>Nombre</th>
                                    <th>Límite Km</th>
                                    <th>Límite Fecha</th>
                                    <th>Último</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </ng-template>
                            <ng-template pTemplate="body" let-maint>
                                <tr>
                                    <td>{{ maint.name }}</td>
                                    <td>{{ maint.kmLimit ? (maint.kmLimit | number) + ' km' : '-' }}</td>
                                    <td>{{ maint.dateLimit ? (maint.dateLimit | date:'dd/MM/yyyy') : '-' }}</td>
                                    <td>
                                        <div *ngIf="maint.lastPerformedKm">{{ maint.lastPerformedKm | number }} km</div>
                                        <div *ngIf="maint.lastPerformedDate" class="text-sm text-500">{{ maint.lastPerformedDate | date:'dd/MM/yyyy' }}</div>
                                    </td>
                                    <td>
                                        <p-tag [value]="maint.status" [severity]="maint.status === 'active' ? 'success' : 'warning'"></p-tag>
                                    </td>
                                    <td>
                                        <button pButton icon="pi pi-check" class="p-button-rounded p-button-text p-button-success" pTooltip="Renovar"></button>
                                        <button pButton icon="pi pi-pencil" class="p-button-rounded p-button-text"></button>
                                    </td>
                                </tr>
                            </ng-template>
                             <ng-template pTemplate="emptymessage">
                                <tr>
                                    <td colspan="6" class="text-center">No hay mantenimientos configurados.</td>
                                </tr>
                            </ng-template>
                        </p-table>
                    </p-tabPanel>
                </p-tabView>
            </div>
        </div>

        <!-- Note Dialog -->
        <p-dialog [(visible)]="noteDialog" [style]="{width: '450px'}" header="Añadir Nota / Reparación" [modal]="true" styleClass="p-fluid">
            <ng-template pTemplate="content">
                <form [formGroup]="noteForm">
                    <div class="field">
                        <label for="date">Fecha</label>
                        <p-calendar id="date" formControlName="date" dateFormat="dd/mm/yy" [showIcon]="true" appendTo="body"></p-calendar>
                    </div>
                    <div class="formgrid grid">
                        <div class="field col">
                            <label for="cost">Coste (€)</label>
                            <p-inputNumber id="cost" formControlName="cost" mode="currency" currency="EUR" locale="es-ES"></p-inputNumber>
                        </div>
                        <div class="field col">
                            <label for="hours">Horas Trabajo</label>
                            <p-inputNumber id="hours" formControlName="hours" [minFractionDigits]="1"></p-inputNumber>
                        </div>
                    </div>
                    <div class="field">
                        <label for="mechanic">Mecánico / Usuario</label>
                        <p-dropdown id="mechanic" [options]="users" formControlName="mechanicId" optionLabel="name" optionValue="id" placeholder="Seleccionar..."></p-dropdown>
                    </div>
                    <div class="field">
                        <label for="description">Descripción / Nota</label>
                        <textarea id="description" pInputTextarea formControlName="description" rows="3" autoResize="autoResize"></textarea>
                    </div>
                </form>
            </ng-template>
            <ng-template pTemplate="footer">
                <button pButton label="Cancelar" icon="pi pi-times" class="p-button-text" (click)="hideDialog()"></button>
                <button pButton label="Guardar" icon="pi pi-check" class="p-button-text" (click)="saveNote()" [disabled]="noteForm.invalid"></button>
            </ng-template>
        </p-dialog>
    </div>
  `
})
export class VehicleDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private workshopService = inject(WorkshopService);
  private messageService = inject(MessageService);
  private fb = inject(FormBuilder);

  vehicle: Vehicle | undefined;
  notes: VehicleNote[] = [];
  maintenances: VehicleMaintenance[] = [];
  
  noteDialog: boolean = false;
  noteForm!: FormGroup;

  // Mock users for dropdown
  users = [
    { id: 'u1', name: 'Juan Mecánico' },
    { id: 'u2', name: 'Ana Taller' },
    { id: 'u3', name: 'Admin' }
  ];

  ngOnInit() {
    this.initForm();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
        this.loadData(id);
    } else {
        this.goBack();
    }
  }

  initForm() {
      this.noteForm = this.fb.group({
          date: [new Date(), Validators.required],
          cost: [0, [Validators.required, Validators.min(0)]],
          hours: [0, [Validators.required, Validators.min(0)]],
          mechanicId: ['', Validators.required],
          description: ['', Validators.required]
      });
  }

  loadData(id: string) {
      this.workshopService.getVehicleById(id).subscribe(v => {
          if (v) {
              this.vehicle = v;
              // If vehicle has embedded maintenances
              this.maintenances = v.maintenances || [];
          }
      });

      this.workshopService.getNotesByVehicle(id).subscribe(n => {
          this.notes = n;
      });
  }

  getSeverity(status: string) {
      switch (status) {
          case 'active': return 'success';
          case 'maintenance': return 'warning';
          case 'inactive': return 'danger';
          default: return undefined;
      }
  }

  openNoteDialog() {
      this.noteForm.reset({
          date: new Date(),
          cost: 0,
          hours: 0,
          mechanicId: '',
          description: ''
      });
      this.noteDialog = true;
  }

  hideDialog() {
      this.noteDialog = false;
  }

  saveNote() {
      if (this.noteForm.invalid || !this.vehicle) return;

      const formValue = this.noteForm.value;
      const mechanic = this.users.find(u => u.id === formValue.mechanicId);

      const newNote: Omit<VehicleNote, 'id'> = {
          vehicleId: this.vehicle.id,
          date: formValue.date,
          cost: formValue.cost,
          hours: formValue.hours,
          mechanicId: formValue.mechanicId,
          mechanicName: mechanic ? mechanic.name : 'Unknown',
          description: formValue.description
      };

      this.workshopService.addNote(newNote).subscribe({
          next: (note) => {
              this.notes = [note, ...this.notes];
              this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Nota añadida correctamente' });
              this.hideDialog();
          },
          error: () => {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo guardar la nota' });
          }
      });
  }

  editVehicle() {
      this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Funcionalidad de edición en desarrollo' });
  }

  goBack() {
      this.router.navigate(['/workshop']);
  }
}
