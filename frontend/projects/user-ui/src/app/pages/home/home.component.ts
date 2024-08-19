import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../../../../common-ui/base/base.component';

@Component({
  standalone: true,
  imports: [],
  selector: 'app-home-page',
  templateUrl: 'home.component.html',
})
export class HomeComponent extends BaseComponent implements OnInit {
  ngOnInit() {}
}
