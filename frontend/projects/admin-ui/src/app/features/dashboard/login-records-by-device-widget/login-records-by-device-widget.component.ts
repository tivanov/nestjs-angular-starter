import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  standalone: true,
  imports: [CommonModule, MatCardModule, NgApexchartsModule],
  templateUrl: './login-records-by-device-widget.component.html',
  styleUrl: './login-records-by-device-widget.component.scss',
})
export class LoginRecordsByDeviceWidgetComponent
  extends BaseComponent
  implements OnInit
{
  data: any[];
  public chartOptions: Partial<ChartOptions> = {
    chart: {
      id: 'devices-chart',
      type: 'donut',
      foreColor: 'white',
    },
    title: {
      text: 'Logins This Week',
    },
  };

  @ViewChild('chart') chart: ChartComponent;

  private readonly dashboardService = inject(DashboardService);
  private readonly snackBar = inject(MatSnackBar);

  ngOnInit() {
    this.load();
  }

  load() {
    this.dashboardService.getLoginRecordsByDevice().subscribe({
      next: (data) => {
        this.data = data;
        this.chartOptions.series = this.data.map((item) => item.count);
        this.chartOptions.labels = this.data.map(
          (item) => item._id || 'Unknown'
        );
      },
      error: (e) => {
        console.error(e);
        this.dataLoaded = true;
        this.snackBar.open(this.extractErrorMessage(e), 'Dismiss', {
          duration: 3000,
        });
      },
    });
  }
}
