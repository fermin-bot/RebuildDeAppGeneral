import { Routes } from '@angular/router';
import { VehicleListComponent } from './pages/vehicle-list/vehicle-list.component';
import { VehicleDetailComponent } from './pages/vehicle-detail/vehicle-detail.component';

export const WORKSHOP_ROUTES: Routes = [
    {
        path: '',
        component: VehicleListComponent
    },
    {
        path: 'vehicle/:id',
        component: VehicleDetailComponent
    }
];
