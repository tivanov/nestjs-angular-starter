import { AfterViewInit, Component, inject } from '@angular/core';
import { BaseComponent } from '../../../../../common-ui/base/base.component';

import { UserTilesWidgetComponent } from './user-tiles-widget/user-tiles-widget.component';
import { LoginRecordsByDeviceWidgetComponent } from './login-records-by-device-widget/login-records-by-device-widget.component';
import { LoginRecordsByCountryWidgetComponent } from './login-records-by-country-widget/login-records-by-country-widget.component';
import { MatCard } from '@angular/material/card';
import { AlertsWidgetComponent } from './alerts-widget/alerts-widget.component';

@Component({
    selector: 'app-dashboard',
    imports: [
    UserTilesWidgetComponent,
    LoginRecordsByDeviceWidgetComponent,
    LoginRecordsByCountryWidgetComponent,
    MatCard,
    AlertsWidgetComponent
],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss'
})
export class DashboardComponent extends BaseComponent implements AfterViewInit {
  ngAfterViewInit() {}
}
