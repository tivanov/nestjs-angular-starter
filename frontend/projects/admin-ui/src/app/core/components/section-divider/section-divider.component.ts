
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { BaseComponent } from '../../../../../../common-ui/base/base.component';

@Component({
    selector: 'app-section-divider',
    imports: [],
    templateUrl: './section-divider.component.html',
    styleUrl: './section-divider.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SectionDividerComponent extends BaseComponent {
  public title = input<string>();
}
