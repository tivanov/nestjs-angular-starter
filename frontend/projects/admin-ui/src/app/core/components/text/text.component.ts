import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { BaseComponent } from '../../../../../../common-ui/base/base.component';
import { TimeAgoPipe } from '../../../../../../common-ui/pipes/time-ago.pipe';
@Component({
  selector: 'app-text',
  templateUrl: './text.component.html',
  styleUrl: './text.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    RouterModule,
    TimeAgoPipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppTextComponent extends BaseComponent {
  readonly label = input<string>();
  readonly value = input<any>();
  readonly type = input<
    | 'date'
    | 'datetime'
    | 'number'
    | 'small-number'
    | 'currency'
    | 'cardano-tx'
    | 'cardano-address'
    | 'boolean'
    | 'link'
    | 'time-ago'
    | 'enum'
  >();
  readonly showCopy = input<boolean>(false);
  readonly currency = input<string>('');
  readonly link = input<string | any[]>();

  protected override copyToClipboard(): void {
    void navigator.clipboard.writeText(this.value());
  }
}
