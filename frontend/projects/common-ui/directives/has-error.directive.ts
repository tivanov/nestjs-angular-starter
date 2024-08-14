import {
  Directive,
  EmbeddedViewRef,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import {
  combineLatest,
  distinctUntilChanged,
  EMPTY,
  map,
  ReplaySubject,
  startWith,
  Subscription,
  switchMap,
} from 'rxjs';
import { HasErrorRootDirective } from './has-error-root.directive';

export interface HasErrorContext {
  $implicit: any;
}

@Directive({
  selector: '[hasError]',
  standalone: true,
})
export class HasErrorDirective implements OnInit, OnDestroy {
  static ngTemplateContextGuard(
    _dir: HasErrorDirective,
    ctx: unknown
  ): ctx is HasErrorContext {
    return true;
  }

  @Input()
  set hasError(errorName: string) {
    this.errorName$.next(errorName);
  }

  private errorName$ = new ReplaySubject<string>(1);
  private ctrl$ = this.hasErrorRoot.formControl$;
  private status$ = this.ctrl$.pipe(
    switchMap((ctrl) => (ctrl.statusChanges || EMPTY).pipe(startWith(null)))
  );

  private error$ = combineLatest([
    this.ctrl$,
    this.errorName$,
    this.status$,
  ]).pipe(
    map(([ctrl, errorName]) => ({
      hasError: ctrl.hasError(errorName),
      value: ctrl.getError(errorName),
    })),
    distinctUntilChanged(
      (x, y) => x.hasError === y.hasError && x.value === y.value
    )
  );

  private view?: EmbeddedViewRef<HasErrorContext>;
  private subscription?: Subscription;

  constructor(
    private hasErrorRoot: HasErrorRootDirective,
    private templateRef: TemplateRef<HasErrorContext>,
    private vcr: ViewContainerRef
  ) {}

  ngOnInit(): void {
    this.subscription = this.error$.subscribe((error) => {
      if (!error.hasError) {
        this.view?.destroy();
        this.view = undefined;
        return;
      }

      if (this.view) {
        this.view.context.$implicit = error.value;
        this.view.markForCheck();
        return;
      }

      this.view = this.vcr.createEmbeddedView(this.templateRef, {
        $implicit: error.value,
      });
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
