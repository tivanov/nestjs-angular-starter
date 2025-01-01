import { Component } from '@angular/core';
import { BaseComponent } from '../../../../../../common-ui/base/base.component';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-spinner',
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
  standalone: true,
})
export class SpinnerComponent extends BaseComponent {}
