import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CompanyService, Company } from '../../core/services/company.service';
import { MenubarModule } from 'primeng/menubar';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, MenubarModule, DropdownModule, ButtonModule, FormsModule],
  template: `
    <p-menubar [model]="items">
      <ng-template pTemplate="start">
        <div class="flex align-items-center gap-2 mr-4">
          <i class="pi pi-briefcase text-xl text-primary"></i>
          <span class="font-bold text-xl text-primary">FrontendApp</span>
        </div>
      </ng-template>
      
      <ng-template pTemplate="end">
        <div class="flex align-items-center gap-2">
          <p-dropdown 
            [options]="companies" 
            [(ngModel)]="selectedCompany" 
            optionLabel="name" 
            placeholder="Seleccionar Empresa"
            class="mr-2"
            [style]="{'width':'200px'}"
            (onChange)="onCompanyChange($event)">
          </p-dropdown>
          
          <p-button 
            label="Logout" 
            icon="pi pi-power-off" 
            styleClass="p-button-danger p-button-text" 
            (onClick)="logout()">
          </p-button>
        </div>
      </ng-template>
    </p-menubar>
  `,
  styles: [`
    :host ::ng-deep .p-menubar {
      border-radius: 0;
      border: none;
      border-bottom: 1px solid var(--surface-border);
    }
  `]
})
export class NavbarComponent implements OnInit {
  private authService = inject(AuthService);
  private companyService = inject(CompanyService);
  private router = inject(Router);

  items: MenuItem[] = [];
  companies: Company[] = [];
  selectedCompany: Company | undefined;

  ngOnInit() {
    this.loadMenu();
    this.loadCompanies();
  }

  loadMenu() {
    this.items = [
      {
        label: 'Dashboard',
        icon: 'pi pi-home',
        routerLink: '/dashboard'
      },
      {
        label: 'Taller',
        icon: 'pi pi-wrench',
        routerLink: '/workshop'
      },
      {
        label: 'Gestión',
        icon: 'pi pi-cog',
        visible: this.authService.hasRole('admin'),
        items: [
            {
                label: 'Usuarios',
                icon: 'pi pi-users',
                routerLink: '/users' // Placeholder
            },
            {
                label: 'Configuración',
                icon: 'pi pi-wrench',
                routerLink: '/settings' // Placeholder
            }
        ]
      }
    ];
  }

  loadCompanies() {
    this.companyService.getCompanies().subscribe((companies: Company[]) => {
      this.companies = companies;
      if (companies.length > 0) {
        this.selectedCompany = companies[0]; // Default selection
      }
    });
  }

  onCompanyChange(event: any) {
    console.log('Empresa seleccionada:', event.value);
    // TODO: Update global state or trigger action
  }

  logout() {
    this.authService.logout();
  }
}
