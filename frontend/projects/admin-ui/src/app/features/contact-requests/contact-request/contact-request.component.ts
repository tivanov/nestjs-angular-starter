import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ContactRequestDto } from '@app/contracts';
import { BaseEditComponent } from '../../../../../../common-ui/base/base-edit.component';
import { CardComponent } from '../../../core/components/card/card.component';
import { SpinnerComponent } from '../../../core/components/spinner/spinner.component';
import { AppTextComponent } from '../../../core/components/text/text.component';
import { ContactRequestsService } from '../../../../../../common-ui/services/contact-requests.service';

@Component({
  selector: 'app-contact-request',
  imports: [
    SpinnerComponent,
    MatIconModule,
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    CardComponent,
    AppTextComponent,
  ],
  templateUrl: './contact-request.component.html',
  styleUrl: './contact-request.component.scss',
})
export class ContactRequestComponent extends BaseEditComponent<ContactRequestDto> {
  private readonly contactRequest = inject(ContactRequestsService);

  public override load(contactRequestId: string) {
    this.contactRequest
      .getOne(contactRequestId)
      .pipe()
      .subscribe({
        next: (contactRequest) => {
          this.onContactRequestLoaded(contactRequest);
        },
        error: this.onFetchError.bind(this),
      });
  }

  onContactRequestLoaded(contactRequest: ContactRequestDto) {
    this.entity = contactRequest;
    this.dataLoaded.set(true);
  }

  public override buildForm(): void {
    this.form = this.formBuilder.group({});
  }

  override reset() {
    if (this.entity) {
      this.onContactRequestLoaded(this.entity);
    } else {
      this.form.reset();
    }
  }

  markAsRead(): void {
    if (!this.entity) return;

    this.contactRequest.markAsRead(this.entity.id).subscribe({
      next: (updated) => {
        this.entity = updated;
        this.snackBar.open('Successfully updated status', 'Close', {
          duration: 3000,
        });
      },
      error: (err) => {
        console.error('Failed to mark as read', err);
      },
    });
  }
}
