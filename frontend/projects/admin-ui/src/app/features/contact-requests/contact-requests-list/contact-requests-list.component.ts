
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { ContactRequestDto, GetContactRequestQuery } from '@app/contracts';
import { BaseListComponent } from '../../../../../../common-ui/base/base-list.component';
import { ContactRequestsService } from '../../../../../../common-ui/services/contact-requests.service';
import { ContactRequestStatusEnum } from './../../../../../../../../backend/libs/contracts/src/enums/contact-request-status.enum';
import { ContactTypeEnum } from './../../../../../../../../backend/libs/contracts/src/enums/contact-type.enum';

@Component({
  selector: 'app-contact-requests-list',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    RouterModule,
    MatIconModule,
    MatSelectModule,
    MatOptionModule,
    MatCheckboxModule,
    MatSortModule,
    MatDatepickerModule
],
  templateUrl: './contact-requests-list.component.html',
  styleUrl: './contact-requests-list.component.scss',
})
export class ContactRequestsListComponent extends BaseListComponent<ContactRequestDto> {
  private readonly contactRequest = inject(ContactRequestsService);

  ContactRequestStatusEnum = ContactRequestStatusEnum;
  ContactTypeEnum = ContactTypeEnum;

  contactRequestsStatus = Object.values(this.ContactRequestStatusEnum);
  contactRequestsType = Object.values(this.ContactTypeEnum);

  public override load($event: { pageIndex: number; pageSize?: number }) {
    const filter: GetContactRequestQuery = this.populateShapeableQuery($event);

    this.contactRequest.get(filter).subscribe({
      next: (result) => {
        this.dataSource.data = result.docs;

        this.totalItems = result.totalDocs;
        this.setQueryParams(filter);
      },
      error: this.onFetchError.bind(this),
    });
  }

  public override buildForm(): void {
    this.filterForm = this.formBuilder.group({
      status: [null],
      type: [null],
      startDate: [null],
      endDate: [null],
    });
  }

  override setColumns() {
    this.defaultColumns = [
      'name',
      'email',
      'company',
      'type',
      'status',
      'actions',
    ];

    this.mobileColumns = ['name', 'actions'];
  }
}
