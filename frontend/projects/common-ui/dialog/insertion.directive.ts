import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
    selector: '[appInsertion]',
    standalone: true
})
export class InsertionDirective {
  constructor(public viewContainerRef: ViewContainerRef) {}
}