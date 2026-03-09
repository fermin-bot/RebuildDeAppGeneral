export interface Vehicle {
    id: string;
    companyId: string;
    name: string;
    licensePlate: string;
    alias?: string;
    kilometers: number;
    hours: number;
    status: 'active' | 'inactive' | 'maintenance';
    imageUrl?: string;
    notes?: VehicleNote[];
    maintenances?: VehicleMaintenance[];
    createdAt?: Date;
    updatedAt?: Date;
}

export interface VehicleNote {
    id: string;
    vehicleId: string;
    date: Date;
    cost: number;
    hours: number; // Labor hours
    mechanicId: string;
    mechanicName?: string; // For display
    description: string;
    createdAt?: Date;
}

export interface VehicleMaintenance {
    id: string;
    vehicleId: string;
    name: string;
    kmLimit?: number;
    hoursLimit?: number;
    dateLimit?: Date;
    lastPerformedKm?: number;
    lastPerformedHours?: number;
    lastPerformedDate?: Date;
    status: 'active' | 'inactive' | 'expired' | 'warning';
    isActive: boolean; // For toggle
}

export interface WorkshopStats {
    totalVehicles: number;
    activeVehicles: number;
    maintenanceVehicles: number;
    totalCostThisMonth: number;
}
