import { Injectable } from '@angular/core';
import { UserRoleEnum } from '@app/contracts';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

export enum MenuItemType {
  Link = 'link',
  Dropdown = 'dropdown',
  Divider = 'divider',
}

export interface MenuItem {
  type?: MenuItemType;
  label?: string;
  link?: string;
  icon?: IconProp;
  roles?: UserRoleEnum[];
  children?: MenuItem[];
  expanded?: boolean;
}

@Injectable({ providedIn: 'root' })
export class SideMenuService {
  allMenuItems: MenuItem[] = [
    {
      label: 'Dashboard',
      link: '/dashboard',
      icon: 'chart-line',
      roles: [UserRoleEnum.Manager],
    },
    {
      label: 'Contact Requests',
      link: '/contact-requests/list',
      icon: 'envelope',
      roles: [UserRoleEnum.Admin],
    },
    {
      type: MenuItemType.Divider,
    },
    {
      label: 'Users',
      icon: 'user',
      type: MenuItemType.Dropdown,
      children: [
        {
          label: 'Create',
          link: '/users/create',
          icon: 'plus',
          roles: [UserRoleEnum.Admin],
        },
        {
          label: 'List',
          link: '/users/list',
          icon: 'list',
          roles: [UserRoleEnum.Admin],
        },
      ],
    },
    {
      type: MenuItemType.Divider,
    },
    {
      label: 'System',
      icon: 'gear',
      type: MenuItemType.Dropdown,
      children: [
        { label: 'Tasks', link: '/tasks/list', icon: 'gears' },
        { label: 'Settings', link: '/system-settings', icon: 'gears' },
        {
          label: 'Circuit Breakers',
          link: '/circuit-breakers/list',
          icon: 'bolt',
        },
      ],
    },
    // Add more menu items here as needed
  ];

  getItems(role: UserRoleEnum) {
    if (!role) {
      return [];
    }

    const copied = JSON.parse(JSON.stringify(this.allMenuItems));

    return copied.filter((item) => {
      if (role === UserRoleEnum.Admin) {
        return true;
      }
      if (!item.roles) {
        return false;
      }
      const isVisible = item.roles.includes(role);
      if (isVisible && item.children) {
        item.children = item.children.filter((child) =>
          child.roles.includes(role)
        );
      }
      return isVisible;
    });
  }
}
