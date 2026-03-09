import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
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
                                    <th>Mecánicos</th>
                                    <th>Coste</th>
                                    <th>Total Horas</th>
                                </tr>
                            </ng-template>
                            <ng-template pTemplate="body" let-note>
                                <tr>
                                    <td>{{ note.date | date:'dd/MM/yyyy' }}</td>
                                    <td>{{ note.description }}</td>
                                    <td>
                                        <div *ngFor="let labor of note.labor">
                                            {{ labor.mechanicName }}: <strong>{{ labor.hours }}h</strong>
                                        </div>
                                    </td>
                                    <td>{{ note.cost | currency:'EUR' }}</td>
                                    <td>{{ note.totalHours }} h</td>
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

        <!-- Vehicle Edit Dialog -->
        <p-dialog [(visible)]="vehicleDialog" [style]="{width: '450px'}" header="Editar Vehículo" [modal]="true" styleClass="p-fluid">
            <ng-template pTemplate="content">
                <form [formGroup]="vehicleForm">
                    <div class="field">
                        <label for="v-name">Nombre</label>
                        <input type="text" pInputText id="v-name" formControlName="name" required autofocus />
                        <small class="p-error" *ngIf="vehicleForm.get('name')?.invalid && vehicleForm.get('name')?.dirty">Nombre es requerido.</small>
                    </div>
                    <div class="field">
                        <label for="v-licensePlate">Matrícula</label>
                        <input type="text" pInputText id="v-licensePlate" formControlName="licensePlate" required />
                        <small class="p-error" *ngIf="vehicleForm.get('licensePlate')?.invalid && vehicleForm.get('licensePlate')?.dirty">Matrícula es requerida.</small>
                    </div>
                    <div class="field">
                        <label for="v-alias">Alias (Opcional)</label>
                        <input type="text" pInputText id="v-alias" formControlName="alias" />
                    </div>
                     <div class="formgrid grid">
                        <div class="field col">
                            <label for="v-kilometers">Kilómetros</label>
                            <p-inputNumber id="v-kilometers" formControlName="kilometers" mode="decimal" [min]="0"></p-inputNumber>
                        </div>
                        <div class="field col">
                            <label for="v-hours">Horas de Uso</label>
                            <p-inputNumber id="v-hours" formControlName="hours" mode="decimal" [min]="0" [minFractionDigits]="1"></p-inputNumber>
                        </div>
                    </div>
                    <div class="field">
                        <label for="v-status">Estado</label>
                        <p-dropdown id="v-status" [options]="statusOptions" formControlName="status" optionLabel="label" optionValue="value" appendTo="body"></p-dropdown>
                    </div>
                    <div class="field">
                        <label for="v-image">URL Imagen (Opcional)</label>
                        <input type="text" pInputText id="v-image" formControlName="imageUrl" />
                    </div>
                </form>
            </ng-template>
            <ng-template pTemplate="footer">
                <button pButton label="Cancelar" icon="pi pi-times" class="p-button-text" (click)="hideVehicleDialog()"></button>
                <button pButton label="Guardar" icon="pi pi-check" class="p-button-text" (click)="saveVehicle()" [disabled]="vehicleForm.invalid"></button>
            </ng-template>
        </p-dialog>

        <!-- Note Dialog -->
        <p-dialog [(visible)]="noteDialog" [style]="{width: '450px'}" header="Añadir Nota / Reparación" [modal]="true" styleClass="p-fluid">
            <ng-template pTemplate="content">
                <form [formGroup]="noteForm">
                    <div class="field">
                        <label for="date">Fecha</label>
                        <p-calendar id="date" formControlName="date" dateFormat="dd/mm/yy" [showIcon]="true" appendTo="body"></p-calendar>
                    </div>

                    <div class="field">
                        <label for="description">Descripción / Nota</label>
                        <textarea id="description" pInputTextarea formControlName="description" rows="3" autoResize="autoResize"></textarea>
                    </div>

                    <div class="field">
                        <label class="block font-bold mb-2">Mecánicos y Horas</label>
                        
                        <div formArrayName="labor">
                            <div *ngFor="let labor of laborControls.controls; let i=index" [formGroupName]="i" class="formgrid grid align-items-end mb-2">
                                <div class="field col-7">
                                    <label *ngIf="i===0">Mecánico</label>
                                    <p-dropdown 
                                        [options]="users" 
                                        formControlName="mechanicId" 
                                        optionLabel="name" 
                                        optionValue="id" 
                                        placeholder="Seleccionar..."
                                        [filter]="true"
                                        filterBy="name"
                                        appendTo="body"
                                        styleClass="w-full">
                                    </p-dropdown>
                                </div>
                                <div class="field col-3">
                                    <label *ngIf="i===0">Horas</label>
                                    <p-inputNumber 
                                        formControlName="hours" 
                                        [minFractionDigits]="1" 
                                        [showButtons]="false"
                                        suffix=" h"
                                        inputStyleClass="w-full">
                                    </p-inputNumber>
                                </div>
                                <div class="field col-2">
                                    <button pButton icon="pi pi-trash" class="p-button-danger p-button-outlined" (click)="removeLabor(i)" [disabled]="laborControls.length === 1"></button>
                                </div>
                            </div>
                        </div>

                        <button pButton type="button" label="Añadir Mecánico" icon="pi pi-plus" class="p-button-secondary p-button-sm mt-2" (click)="addLabor()"></button>
                    </div>

                    <div class="field mt-3">
                        <label for="cost">Coste (€) (Opcional)</label>
                        <p-inputNumber id="cost" formControlName="cost" mode="currency" currency="EUR" locale="es-ES"></p-inputNumber>
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

  vehicleDialog: boolean = false;
  vehicleForm!: FormGroup;

  statusOptions = [
      { label: 'Activo', value: 'active' },
      { label: 'Inactivo', value: 'inactive' },
      { label: 'Mantenimiento', value: 'maintenance' }
  ];

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
          cost: [0], // Optional
          description: ['', Validators.required],
          labor: this.fb.array([])
      });

      this.addLabor(); // Add initial row

      this.vehicleForm = this.fb.group({
          name: ['', Validators.required],
          licensePlate: ['', Validators.required],
          alias: [''],
          kilometers: [0, [Validators.required, Validators.min(0)]],
          hours: [0, [Validators.required, Validators.min(0)]],
          status: ['active', Validators.required],
          imageUrl: ['']
      });
  }

  get laborControls() {
      return this.noteForm.get('labor') as FormArray;
  }

  addLabor() {
      const laborGroup = this.fb.group({
          mechanicId: ['', Validators.required],
          hours: [1, [Validators.required, Validators.min(0.1)]]
      });
      this.laborControls.push(laborGroup);
  }

  removeLabor(index: number) {
      if (this.laborControls.length > 1) {
          this.laborControls.removeAt(index);
      }
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
          description: ''
      });
      this.laborControls.clear();
      this.addLabor();
      this.noteDialog = true;
  }

  hideDialog() {
      this.noteDialog = false;
  }

  saveNote() {
      if (this.noteForm.invalid || !this.vehicle) return;

      const formValue = this.noteForm.value;
      
      // Map labor array to include mechanic names
      const laborData = formValue.labor.map((item: any) => {
          const mechanic = this.users.find(u => u.id === item.mechanicId);
          return {
              mechanicId: item.mechanicId,
              mechanicName: mechanic ? mechanic.name : 'Unknown',
              hours: item.hours
          };
      });

      // Calculate total hours
      const totalHours = laborData.reduce((acc: number, curr: any) => acc + curr.hours, 0);

      const newNote: Omit<VehicleNote, 'id'> = {
          vehicleId: this.vehicle.id,
          date: formValue.date,
          cost: formValue.cost,
          totalHours: totalHours,
          labor: laborData,
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
      if (!this.vehicle) return;
      this.vehicleForm.patchValue({
          name: this.vehicle.name,
          licensePlate: this.vehicle.licensePlate,
          alias: this.vehicle.alias,
          kilometers: this.vehicle.kilometers,
          hours: this.vehicle.hours,
          status: this.vehicle.status,
          imageUrl: this.vehicle.imageUrl
      });
      this.vehicleDialog = true;
  }

  saveVehicle() {
      if (this.vehicleForm.invalid || !this.vehicle) return;

      const updatedData = this.vehicleForm.value;
      
      this.workshopService.updateVehicle(this.vehicle.id, updatedData).subscribe({
          next: (updatedVehicle) => {
              this.vehicle = updatedVehicle;
              this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Vehículo actualizado correctamente' });
              this.hideVehicleDialog();
          },
          error: () => {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar el vehículo' });
          }
      });
  }

  hideVehicleDialog() {
      this.vehicleDialog = false;
  }

  goBack() {
      this.router.navigate(['/workshop']);
  }
}
