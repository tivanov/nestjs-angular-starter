import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BaseComponent } from '../../../common-ui/base/base.component';
import { SpinnerComponent } from './shared/components/spinner/spinner.component';
import {
  FaIconLibrary,
  FontAwesomeModule,
} from '@fortawesome/angular-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SpinnerComponent, FontAwesomeModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent extends BaseComponent {
  title = 'user-ui';

  constructor(library: FaIconLibrary) {
    super();
    library.addIcons(faSpinner);
    setTimeout(() => {
      this.dataLoaded = true;
    }, 700);
  }
}
