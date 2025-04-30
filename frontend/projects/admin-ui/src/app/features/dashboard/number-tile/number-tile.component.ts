import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseComponent } from '../../../../../../common-ui/base/base.component';
import { ShortNumberPipe } from '../../../../../../common-ui/pipes/short-number.pipe';

@Component({
    selector: 'app-number-tile',
    imports: [CommonModule, ShortNumberPipe],
    templateUrl: './number-tile.component.html',
    styleUrl: './number-tile.component.scss'
})
export class NumberTileComponent extends BaseComponent implements OnInit {
  @Input('text') text: any;
  @Input('value') value: number;

  constructor() {
    super();
  }

  async ngOnInit() {}
}
