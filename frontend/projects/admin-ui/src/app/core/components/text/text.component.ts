import { Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';
import { BaseComponent } from '../../../../../../common-ui/base/base.component';

@Component({
  selector: 'app-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss'],
  standalone: true,
  imports: [NgIf],
})
export class AppTextComponent extends BaseComponent {
  @Input() public label: string;
  @Input() public value: string;
}
