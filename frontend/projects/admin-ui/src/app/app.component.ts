import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  FontAwesomeModule,
  FaIconLibrary,
} from '@fortawesome/angular-fontawesome';
import {
  faBolt,
  faChartLine,
  faChevronDown,
  faClipboardList,
  faEnvelope,
  faGear,
  faGears,
  faList,
  faPlus,
  faSpinner,
  faUser,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FontAwesomeModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'admin-ui';
  constructor(library: FaIconLibrary) {
    library.addIcons(
      faUser,
      faChartLine,
      faList,
      faPlus,
      faChevronDown,
      faGears,
      faClipboardList,
      faSpinner,
      faEnvelope,
      faGear,
      faBolt
    );
  }
}
