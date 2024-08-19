import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../../../../../common-ui/base/base.component';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  imports: [RouterModule],
  selector: 'app-main-layout',
  templateUrl: 'main-layout.component.html',
  styleUrls: ['main-layout.component.scss'],
})
export class MainLayoutComponent extends BaseComponent implements OnInit {
  ngOnInit() {}
}
