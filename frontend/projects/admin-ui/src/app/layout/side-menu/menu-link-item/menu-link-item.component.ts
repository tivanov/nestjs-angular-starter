import { Component, Input, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MenuItem } from '../side-menu.service';

@Component({
  standalone: true,
  imports: [RouterModule, CommonModule, FontAwesomeModule],
  selector: 'app-menu-link-item',
  templateUrl: 'menu-link-item.component.html',
  styleUrls: ['menu-link-item.component.scss'],
})
export class MenuLinkItemComponent implements OnInit {
  @Input() item: MenuItem;

  ngOnInit() {}
}
