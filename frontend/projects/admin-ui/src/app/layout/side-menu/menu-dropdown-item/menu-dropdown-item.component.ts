import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MenuLinkItemComponent } from '../menu-link-item/menu-link-item.component';
import { MatDivider, MatDividerModule } from '@angular/material/divider';
import { MenuItem, MenuItemType } from '../side-menu.service';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule,
    MenuLinkItemComponent,
    MatDividerModule,
  ],
  selector: 'app-menu-dropdown-item',
  templateUrl: 'menu-dropdown-item.component.html',
  styleUrls: ['menu-dropdown-item.component.scss'],
})
export class MenuDropdownItemComponent implements OnInit {
  @Input() item: MenuItem;

  MenuItemType = MenuItemType;

  public expanded = false;
  ngOnInit() {}
}
