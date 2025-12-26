import { Breakpoints } from '@angular/cdk/layout';

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Title } from '@angular/platform-browser';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterModule,
} from '@angular/router';
import { filter, map, takeUntil } from 'rxjs/operators';
import { AuthSignal, logOut } from '../../../../common-ui/auth/auth.signal';
import { BaseComponent } from '../../../../common-ui/base/base.component';
import { SideMenuComponent } from './side-menu/side-menu.component';

@Component({
  selector: 'app-layout',
  imports: [
    RouterModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    SideMenuComponent,
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent extends BaseComponent implements OnInit {
  appName = 'Your Project Name';
  sidenavMode = signal<'over' | 'side'>('side');
  title = signal('Control Center');

  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly titleService = inject(Title);

  constructor() {
    super();
    if (!this.checkAuth()) {
      return;
    }
    this.router.events
      .pipe(
        takeUntil(this.ngUnsubscribe),
        filter((event) => event instanceof NavigationEnd),
        map(() => {
          let child: ActivatedRoute | null = this.route.firstChild;
          while (child) {
            if (child.firstChild) {
              child = child.firstChild;
            } else {
              break;
            }
          }
          const title = child?.snapshot.data['title'];
          if (title) {
            return title;
          }
        })
      )
      .subscribe((title) => {
        if (title) {
          this.title.set(title);
        } else {
          this.title.set('Control Center');
        }
        this.titleService.setTitle(`${this.title()} | ${this.appName}`);
      });
  }

  ngOnInit() {
    if (!this.checkAuth()) {
      return;
    }
  }

  logout() {
    logOut();
    location.reload();
  }

  private checkAuth() {
    if (!AuthSignal().isAuthenticated) {
      void this.router.navigate(['/auth/login']);
      return false;
    }
    return true;
  }
}
