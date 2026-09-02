import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { BaseComponent } from '../../../../../../common-ui/base/base.component';

let nextCardId = 0;

@Component({
  selector: 'app-card',
  imports: [MatIconModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block w-full',
  },
})
export class CardComponent extends BaseComponent {
  public readonly titleText = input<string>();
  public readonly collapsible = input<boolean>(true);
  protected readonly collapsed = signal(false);

  private readonly cardId = ++nextCardId;
  protected readonly panelId = `app-card-panel-${this.cardId}`;
  protected readonly titleId = `app-card-title-${this.cardId}`;

  protected toggleCollapsed() {
    if (this.collapsible()) {
      this.collapsed.update((v) => !v);
    }
  }
}
