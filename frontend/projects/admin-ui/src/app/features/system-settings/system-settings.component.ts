
import { AfterViewInit, Component, inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SystemConfigDto } from '@app/contracts';
import { BaseEditComponent } from '../../../../../common-ui/base/base-edit.component';
import { CardComponent } from '../../core/components/card/card.component';
import { SystemConfigService } from '../../../../../common-ui/services/system-config.service';

@Component({
  selector: 'app-system-settings',
  imports: [
    CardComponent,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule
],
  templateUrl: './system-settings.component.html',
  styleUrl: './system-settings.component.scss',
})
export class SystemSettingsComponent
  extends BaseEditComponent<SystemConfigDto>
  implements AfterViewInit
{
  private readonly systemConfigService = inject(SystemConfigService);

  override load(id: string) {
    this.systemConfigService.get().subscribe({
      next: this.onEntityLoaded.bind(this),
      error: this.onFetchError.bind(this),
    });
  }

  override buildForm(): void {
    this.form = this.formBuilder.group({});
  }

  override ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this.load(null);
  }

  save() {
    if (!this.form.valid) {
      return;
    }
    // TODO: Implement save
  }

  private onEntityLoaded(response: SystemConfigDto): void {
    this.entity = response;
    this.form.patchValue(response);
  }
}
