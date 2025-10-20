import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ComponentRef,
  ElementRef,
  HostListener,
  OnDestroy,
  Type,
  viewChild,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Subject } from 'rxjs';
import { DialogConfig } from './dialog-config';
import { DialogRef } from './dialog-ref';
import { InsertionDirective } from './insertion.directive';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss',
  imports: [InsertionDirective, FontAwesomeModule],
})
export class DialogComponent implements AfterViewInit, OnDestroy {
  componentRef: ComponentRef<any>;
  childComponentType: Type<any>;

  readonly insertionPoint = viewChild<InsertionDirective>(InsertionDirective);
  readonly dialogContainer = viewChild<ElementRef>('dialogContainer');

  private readonly _onClose = new Subject<any>();
  public onClose = this._onClose.asObservable();

  constructor(
    private cd: ChangeDetectorRef,
    private dialogRef: DialogRef,
    private dialogConfig: DialogConfig,
  ) {}

  ngAfterViewInit(): void {
    if (this.dialogConfig.panelClass?.length) {
      this.dialogContainer().nativeElement.classList.add(
        ...this.dialogConfig.panelClass,
      );
    }

    document.body.classList.add('body-no-scroll');

    this.loadChildComponent(this.childComponentType);
    this.cd.detectChanges();
    setTimeout(() =>
      this.dialogContainer().nativeElement.classList.add('fade'),
    );
  }

  ngOnDestroy(): void {
    if (this.componentRef) {
      this.componentRef.destroy();
    }

    document.body.classList.remove('body-no-scroll');
  }

  onOverlayClicked(evt: MouseEvent): void {
    this.dialogRef.close();
  }

  onDialogClicked(evt: MouseEvent): void {
    evt.stopPropagation();
  }

  loadChildComponent(componentType: Type<any>): void {
    const viewContainerRef = this.insertionPoint().viewContainerRef;
    viewContainerRef.clear();

    this.componentRef = viewContainerRef.createComponent(componentType);
  }

  close(): void {
    this.dialogRef.close();
  }

  @HostListener('window:keydown.escape', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.close();
      event.stopPropagation();
      return true;
    }
    return false;
  }
}
