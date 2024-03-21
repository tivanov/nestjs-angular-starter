import { ChangeDetectorRef, Component, ViewChild, inject } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Observable } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faUser } from '@fortawesome/free-solid-svg-icons';

interface MenuItem {
  label: string;
  link: string;
  icon: IconDefinition;
}

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterModule, MatSidenavModule, CommonModule, FontAwesomeModule,
    MatButtonModule, MatListModule, MatIconModule, MatToolbarModule, MatSelectModule, MatFormFieldModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {

  sidenavMode: 'over' | 'side' = 'side';

  menuItems: MenuItem[] = [
    { label: 'Users', link: '/users-list', icon: faUser },
    // Add more menu items here as needed
  ];

  title = 'Admin-UI';

  @ViewChild('drawer') drawer: any;

  constructor(
    private cdr: ChangeDetectorRef,
    private authService: AuthService
  ) { }

  private breakpointObserver = inject(BreakpointObserver);

  isHandset$: Observable<boolean> = this.breakpointObserver.observe([Breakpoints.Handset, Breakpoints.Tablet])
    .pipe(
      map(result => {
        const mode = result.matches ? 'over' : 'side';
        if (mode !== this.sidenavMode) {
          this.sidenavMode = mode;
          this.cdr.detectChanges();
        }
        return result.matches;
      }),
    );

  logout() {
    this.authService.logout()
  }

}
