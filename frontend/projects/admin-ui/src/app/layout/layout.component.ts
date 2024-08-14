import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { filter, map, takeUntil } from 'rxjs/operators';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterModule,
} from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Observable } from 'rxjs';
import { AuthSignal, logOut } from '../../../../common-ui/auth/auth.signal';
import { BaseComponent } from '../../../../common-ui/base/base.component';
import { SideMenuComponent } from './side-menu/side-menu.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    RouterModule,
    MatSidenavModule,
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    SideMenuComponent,
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent extends BaseComponent implements OnInit {
  sidenavMode: 'over' | 'side' = 'side';
  title = 'Control Center';

  private readonly cdr = inject(ChangeDetectorRef);
  private readonly router = inject(Router);
  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly route = inject(ActivatedRoute);

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe([Breakpoints.Handset, Breakpoints.Tablet])
    .pipe(
      takeUntil(this.ngUnsubscribe),
      map((result) => {
        const mode = result.matches ? 'over' : 'side';
        if (mode !== this.sidenavMode) {
          this.sidenavMode = mode;
          this.cdr.detectChanges();
        }
        return result.matches;
      })
    );

  constructor() {
    super();
    this.router.events
      .pipe(
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
          this.title = title;
        } else {
          this.title = 'Control Center';
        }
      });
  }

  ngOnInit() {
    if (!AuthSignal().isAuthenticated) {
      this.router.navigate(['/login']);
      return;
    }
  }

  logout() {
    logOut();
    location.reload();
  }
}
