import { DialogConfig } from './dialog-config';
import {
  Component,
  Type,
  OnDestroy,
  AfterViewInit,
  ComponentRef,
  ViewChild,
  ChangeDetectorRef,
  ElementRef,
  HostListener,
} from '@angular/core';
import { Subject } from 'rxjs';
import { InsertionDirective } from './insertion.directive';
import { DialogRef } from './dialog-ref';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
  standalone: true,
  imports: [InsertionDirective, FontAwesomeModule],
})
export class DialogComponent implements AfterViewInit, OnDestroy {
  componentRef: ComponentRef<any>;
  childComponentType: Type<any>;

  @ViewChild(InsertionDirective) insertionPoint: InsertionDirective;
  @ViewChild('dialogContainer', { read: ElementRef })
  dialogContainer: ElementRef;

  private readonly _onClose = new Subject<any>();
  public onClose = this._onClose.asObservable();

  constructor(
    private cd: ChangeDetectorRef,
    private dialogRef: DialogRef,
    private dialogConfig: DialogConfig
  ) {}

  ngAfterViewInit(): void {
    if (this.dialogConfig.panelClass?.length) {
      this.dialogContainer.nativeElement.classList.add(
        ...this.dialogConfig.panelClass
      );
    }

    this.loadChildComponent(this.childComponentType);
    this.cd.detectChanges();
    setTimeout(() => this.dialogContainer.nativeElement.classList.add('fade'));
  }

  ngOnDestroy(): void {
    if (this.componentRef) {
      this.componentRef.destroy();
    }
  }

  onOverlayClicked(evt: MouseEvent): void {
    this.dialogRef.close();
  }

  onDialogClicked(evt: MouseEvent): void {
    evt.stopPropagation();
  }

  loadChildComponent(componentType: Type<any>): void {
    let viewContainerRef = this.insertionPoint.viewContainerRef;
    viewContainerRef.clear();

    this.componentRef = viewContainerRef.createComponent(componentType);
  }

  close(): void {
    this._onClose.next(null);
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
