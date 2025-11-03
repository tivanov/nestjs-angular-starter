import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CircuitBreakersListComponent } from './circuit-breakers-list.component';

describe('CircuitBreakersListComponent', () => {
  let component: CircuitBreakersListComponent;
  let fixture: ComponentFixture<CircuitBreakersListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CircuitBreakersListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CircuitBreakersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
