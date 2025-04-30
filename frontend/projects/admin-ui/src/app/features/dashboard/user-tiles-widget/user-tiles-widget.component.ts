import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseComponent } from '../../../../../../common-ui/base/base.component';
import { DashboardService } from '../../../../../../common-ui/services/dashboard.service';
import { MatCardModule } from '@angular/material/card';
import { NumberTileComponent } from '../number-tile/number-tile.component';
import { Observable, takeUntil } from 'rxjs';

@Component({
    selector: 'app-user-tiles-widget',
    imports: [CommonModule, NumberTileComponent, MatCardModule],
    templateUrl: './user-tiles-widget.component.html',
    styleUrl: './user-tiles-widget.component.scss'
})
export class UserTilesWidgetComponent extends BaseComponent implements OnInit {
  $tiles: Observable<any>;
  private readonly dashboardService = inject(DashboardService);

  async ngOnInit() {
    this.$tiles = this.dashboardService.getUsersTiles();
  }
}
