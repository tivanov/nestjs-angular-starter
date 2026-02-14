import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { BaseComponent } from '../../../../../../common-ui/base/base.component';

@Component({
  selector: 'app-card',
  imports: [CommonModule, MatIconModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardComponent extends BaseComponent {
  public readonly titleText = input<string>();
  public readonly collapsible = input<boolean>(true);
  protected readonly collapsed = signal(false);

  protected toggleCollapsed() {
    if (this.collapsible()) {
      this.collapsed.update((v) => !v);
    }
  }
}
