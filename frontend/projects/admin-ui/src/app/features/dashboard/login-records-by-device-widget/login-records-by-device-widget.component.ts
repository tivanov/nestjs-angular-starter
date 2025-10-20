import { Component, inject, OnInit, ViewChild } from '@angular/core';

import { takeUntil } from 'rxjs';
import { BaseComponent } from '../../../../../../common-ui/base/base.component';
import { MatCardModule } from '@angular/material/card';
import {
  ApexChart,
  ApexNonAxisChartSeries,
  ApexTitleSubtitle,
  ChartComponent,
  NgApexchartsModule,
} from 'ng-apexcharts';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DashboardService } from '../../../../../../common-ui/services/dashboard.service';

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  labels: string[];
  chart: ApexChart;
  title: ApexTitleSubtitle;
};

@Component({
  selector: 'app-login-records-by-device-widget',
  imports: [MatCardModule, NgApexchartsModule],
  templateUrl: './login-records-by-device-widget.component.html',
  styleUrl: './login-records-by-device-widget.component.scss',
})
export class LoginRecordsByDeviceWidgetComponent
  extends BaseComponent
  implements OnInit
{
  public chartOptions: Partial<ChartOptions> = null;

  @ViewChild('chart') chart: ChartComponent;

  private readonly dashboardService = inject(DashboardService);
  private readonly snackBar = inject(MatSnackBar);

  ngOnInit() {
    this.load();
  }

  load() {
    this.dataLoaded.set(false);
    this.dashboardService.getLoginRecordsByDevice().subscribe({
      next: (data) => {
        this.chartOptions = {
          chart: {
            id: 'devices-chart',
            type: 'donut',
            foreColor: 'white',
          },
          title: {
            text: 'Logins This Week',
          },
          series: data.map((item) => item.count),
          labels: data.map((item) => item._id || 'Unknown'),
        };

        if (this.chart) {
          this.chart.updateOptions(this.chartOptions);
        }
      },
      error: (e) => {
        console.error(e);
        this.dataLoaded.set(true);
        this.snackBar.open(this.extractErrorMessage(e), 'Dismiss', {
          duration: 3000,
        });
      },
    });
  }
}
