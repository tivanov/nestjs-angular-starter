import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CircuitBreakerComponent } from './circuit-breaker.component';

describe('CircuitBreakerComponent', () => {
  let component: CircuitBreakerComponent;
  let fixture: ComponentFixture<CircuitBreakerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CircuitBreakerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CircuitBreakerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
