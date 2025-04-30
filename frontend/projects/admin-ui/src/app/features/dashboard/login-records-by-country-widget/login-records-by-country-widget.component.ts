import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
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
    selector: 'app-login-records-by-country-widget',
    imports: [CommonModule, MatCardModule, NgApexchartsModule],
    templateUrl: './login-records-by-country-widget.component.html',
    styleUrl: './login-records-by-country-widget.component.scss'
})
export class LoginRecordsByCountryWidgetComponent
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
    this.dataLoaded = false;
    this.dashboardService.getLoginRecordsByCountry().subscribe({
      next: (data) => {
        this.chartOptions = {
          chart: {
            id: 'countries-chart',
            type: 'donut',
            foreColor: 'white',
          },
          title: {
            text: 'Logins This Week',
          },
          series: data.map((item) => item.count),
          labels: data.map((item) => item._id?.substring(0, 20) || 'Unknown'),
        };
        if (this.chart) {
          this.chart.updateOptions(this.chartOptions);
        }
        this.dataLoaded = true;
      },
      error: (error) => {
        console.error(error);
        this.dataLoaded = true;
        this.snackBar.open(this.extractErrorMessage(error), 'Dismiss', {
          duration: 3000,
        });
      },
    });
  }
}
