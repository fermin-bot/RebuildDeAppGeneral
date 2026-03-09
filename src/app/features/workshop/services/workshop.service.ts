import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Vehicle, VehicleNote, VehicleMaintenance } from '../models/workshop.model';

@Injectable({
  providedIn: 'root'
})
export class WorkshopService {
  private http = inject(HttpClient);
  
  // TODO: Update with real API endpoints
  private readonly API_URL = 'https://api.placeholder.com/v1/workshop';

  // Mock Data
  private mockVehicles: Vehicle[] = [
    {
      id: '1',
      companyId: '1',
      name: 'Furgoneta Reparto 01',
      licensePlate: '1234-ABC',
      alias: 'La Veloz',
      kilometers: 150000,
      hours: 2500,
      status: 'active',
      imageUrl: 'https://primefaces.org/cdn/primeng/images/demo/product/bamboo-watch.jpg', // Placeholder
      maintenances: [
        {
          id: 'm1',
          vehicleId: '1',
          name: 'Cambio de Aceite',
          kmLimit: 15000,
          lastPerformedKm: 140000,
          status: 'active',
          isActive: true
        }
      ]
    },
    {
      id: '2',
      companyId: '1',
      name: 'Camión Ligero 02',
      licensePlate: '5678-DEF',
      kilometers: 280000,
      hours: 5000,
      status: 'maintenance'
    },
    {
      id: '3',
      companyId: '1',
      name: 'Coche Comercial 03',
      licensePlate: '9012-GHI',
      kilometers: 45000,
      hours: 800,
      status: 'active'
    }
  ];

  private mockNotes: VehicleNote[] = [
    {
      id: 'n1',
      vehicleId: '1',
      date: new Date(),
      cost: 150.50,
      totalHours: 2,
      labor: [
          { mechanicId: 'u1', mechanicName: 'Juan Mecánico', hours: 2 }
      ],
      description: 'Revisión de frenos y cambio de pastillas delanteras.'
    }
  ];

  // --- Vehicles ---

  getVehicles(companyId?: string): Observable<Vehicle[]> {
    // return this.http.get<Vehicle[]>(`${this.API_URL}/vehicles?companyId=${companyId}`);
    return of(this.mockVehicles).pipe(delay(800));
  }

  getVehicleById(id: string): Observable<Vehicle | undefined> {
    // return this.http.get<Vehicle>(`${this.API_URL}/vehicles/${id}`);
    const vehicle = this.mockVehicles.find(v => v.id === id);
    return of(vehicle).pipe(delay(500));
  }

  createVehicle(vehicle: Omit<Vehicle, 'id'>): Observable<Vehicle> {
    // return this.http.post<Vehicle>(`${this.API_URL}/vehicles`, vehicle);
    const newVehicle = { ...vehicle, id: Math.random().toString(36).substr(2, 9) } as Vehicle;
    this.mockVehicles.push(newVehicle);
    return of(newVehicle).pipe(delay(500));
  }

  updateVehicle(id: string, vehicle: Partial<Vehicle>): Observable<Vehicle> {
    // return this.http.put<Vehicle>(`${this.API_URL}/vehicles/${id}`, vehicle);
    const index = this.mockVehicles.findIndex(v => v.id === id);
    if (index !== -1) {
      this.mockVehicles[index] = { ...this.mockVehicles[index], ...vehicle };
      return of(this.mockVehicles[index]).pipe(delay(500));
    }
    throw new Error('Vehicle not found');
  }

  deleteVehicle(id: string): Observable<boolean> {
      // return this.http.delete<boolean>(`${this.API_URL}/vehicles/${id}`);
      this.mockVehicles = this.mockVehicles.filter(v => v.id !== id);
      return of(true).pipe(delay(500));
  }

  // --- Notes ---

  getNotesByVehicle(vehicleId: string): Observable<VehicleNote[]> {
    // return this.http.get<VehicleNote[]>(`${this.API_URL}/vehicles/${vehicleId}/notes`);
    const notes = this.mockNotes.filter(n => n.vehicleId === vehicleId);
    return of(notes).pipe(delay(600));
  }

  addNote(note: Omit<VehicleNote, 'id'>): Observable<VehicleNote> {
    // return this.http.post<VehicleNote>(`${this.API_URL}/notes`, note);
    const newNote = { ...note, id: Math.random().toString(36).substr(2, 9) } as VehicleNote;
    this.mockNotes.unshift(newNote); // Add to beginning
    return of(newNote).pipe(delay(400));
  }

  // --- Maintenances ---

  getMaintenancesByVehicle(vehicleId: string): Observable<VehicleMaintenance[]> {
      // In real API this might be a separate endpoint or included in vehicle details
      // returning mock from vehicle object for now if exists, or empty
      const vehicle = this.mockVehicles.find(v => v.id === vehicleId);
      return of(vehicle?.maintenances || []).pipe(delay(400));
  }

  saveMaintenance(vehicleId: string, maintenance: VehicleMaintenance): Observable<VehicleMaintenance> {
      // Mock update inside vehicle
      const vehicle = this.mockVehicles.find(v => v.id === vehicleId);
      if (vehicle) {
          if (!vehicle.maintenances) vehicle.maintenances = [];
          
          const index = vehicle.maintenances.findIndex(m => m.id === maintenance.id);
          if (index !== -1) {
              vehicle.maintenances[index] = maintenance;
          } else {
              maintenance.id = Math.random().toString(36).substr(2, 9);
              vehicle.maintenances.push(maintenance);
          }
      }
      return of(maintenance).pipe(delay(400));
  }
}
