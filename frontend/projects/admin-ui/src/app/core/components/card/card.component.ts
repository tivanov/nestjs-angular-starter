
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { BaseComponent } from '../../../../../../common-ui/base/base.component';

@Component({
  selector: 'app-card',
  imports: [],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardComponent extends BaseComponent {
  public readonly titleText = input<string>();
}
