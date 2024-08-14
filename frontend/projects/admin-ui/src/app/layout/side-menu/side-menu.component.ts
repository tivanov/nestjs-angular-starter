import { Component, inject } from '@angular/core';
import { BaseComponent } from '../../../../../common-ui/base/base.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule, MatNavList } from '@angular/material/list';
import { AuthSignal } from '../../../../../common-ui/auth/auth.signal';
import { MenuLinkItemComponent } from './menu-link-item/menu-link-item.component';
import { MenuDropdownItemComponent } from './menu-dropdown-item/menu-dropdown-item.component';
import { MenuItemType, SideMenuService } from './side-menu.service';

@Component({
  standalone: true,
  selector: 'app-side-menu',
  templateUrl: 'side-menu.component.html',
  styleUrls: ['side-menu.component.scss'],
  imports: [
    FontAwesomeModule,
    MatMenuModule,
    MatButtonModule,
    CommonModule,
    RouterModule,
    MatDividerModule,
    MatNavList,
    MatListModule,
    MenuLinkItemComponent,
    MenuDropdownItemComponent,
  ],
})
export class SideMenuComponent extends BaseComponent {
  MenuItemType = MenuItemType;

  public readonly menuService = inject(SideMenuService);

  items = this.menuService.getItems(AuthSignal().user?.role);
}
