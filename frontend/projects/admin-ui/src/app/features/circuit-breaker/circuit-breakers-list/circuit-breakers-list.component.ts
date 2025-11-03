import { CommonModule } from '@angular/common';
import { Component, inject, input, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import {
  CircuitBreakerDto,
  CircuitBreakerOperation,
  GetCircuitBreakersQuery,
} from '@app/contracts';
import { BaseListComponent } from '../../../../../../common-ui/base/base-list.component';
import { CircuitBreakersService } from '../../../../../../common-ui/services/circuit-breakers.service';

@Component({
  selector: 'app-circuit-breakers-list',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    RouterModule,
    MatIconModule,
    MatSelectModule,
    MatOptionModule,
  ],
  templateUrl: './circuit-breakers-list.component.html',
  styleUrl: './circuit-breakers-list.component.scss',
})
export class CircuitBreakersListComponent
  extends BaseListComponent<CircuitBreakerDto>
  implements OnInit
{
  resourceId = input<string>();

  private readonly circuitBreakers = inject(CircuitBreakersService);
  public readonly operations = Object.values(CircuitBreakerOperation);

  public override load($event: { pageIndex: number; pageSize?: number }) {
    const filter: GetCircuitBreakersQuery = this.populateShapeableQuery($event);
    this.circuitBreakers.get(filter).subscribe({
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
      operation: [],
      resourceId: [this.resourceId()],
    });
  }

  override setColumns() {
    this.defaultColumns = [
      'operation',
      'resourceId',
      'state',
      'failureCount',
      'lastFailureTime',
      'nextAttemptTime',
      'actions',
    ];

    this.mobileColumns = ['state', 'resourceId', 'actions'];
  }
}
