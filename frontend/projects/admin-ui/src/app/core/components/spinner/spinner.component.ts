import { Component } from '@angular/core';
import { BaseComponent } from '../../../../../../common-ui/base/base.component';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
    selector: 'app-spinner',
    imports: [FontAwesomeModule],
    templateUrl: './spinner.component.html',
    styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent extends BaseComponent {}
