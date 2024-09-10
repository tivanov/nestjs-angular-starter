import { Component, inject, OnInit } from '@angular/core';
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
import { EnvironmentService } from '../../../../../common-ui/services/environment.service';

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
export class SideMenuComponent extends BaseComponent implements OnInit {
  MenuItemType = MenuItemType;

  public readonly menuService = inject(SideMenuService);

  public env = inject(EnvironmentService);

  items = this.menuService.getItems(AuthSignal().user?.role);

  imageUrl = '';

  ngOnInit(): void {
    if (AuthSignal().user?.avatar) {
      if (!AuthSignal().user?.avatar.startsWith('http')) {
        this.imageUrl = `${this.env.apiUrl}${AuthSignal().user.avatar}`;
      } else {
        this.imageUrl = AuthSignal().user.avatar;
      }
    } else {
      this.imageUrl = 'assets/images/no-avatar.png';
    }
  }
}
