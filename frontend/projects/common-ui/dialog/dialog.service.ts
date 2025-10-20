
import {
  ComponentRef,
  Inject,
  Injectable,
  Injector,
  Renderer2,
  RendererFactory2,
  Type,
  ViewContainerRef,
  DOCUMENT
} from '@angular/core';
import { DialogConfig } from './dialog-config';
import { DialogInjector } from './dialog-injector';
import { DialogRef } from './dialog-ref';
import { DialogComponent } from './dialog.component';

@Injectable({ providedIn: 'root' })
export class DialogService {
  private dialogs: ComponentRef<DialogComponent>[] = [];
  private renderer: Renderer2;

  private viewContainerRef: ViewContainerRef;

  constructor(
    private injector: Injector,
    @Inject(DOCUMENT) private document: Document,
    rendererFactory: RendererFactory2,
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  public setViewContainerRef(viewContainerRef: ViewContainerRef) {
    this.viewContainerRef = viewContainerRef;
  }

  public open(componentType: Type<any>, config: DialogConfig): DialogRef {
    const dialogRef = this.appendDialogComponentToBody(config);

    const topDialog = this.dialogs[this.dialogs.length - 1];
    topDialog.instance.childComponentType = componentType;
    this.renderer.addClass(this.document.body, 'modal-open');

    return dialogRef;
  }

  private appendDialogComponentToBody(config: DialogConfig): DialogRef {
    const map = new WeakMap();
    map.set(DialogConfig, config);

    const dialogRef = new DialogRef();
    map.set(DialogRef, dialogRef);

    const componentRef = this.viewContainerRef.createComponent(
      DialogComponent,
      {
        injector: new DialogInjector(this.injector, map),
      },
    );

    this.dialogs.push(componentRef);

    const onCloseSub = dialogRef.afterClosed.subscribe(() => {
      this.removeDialogComponentFromBody(componentRef);
      onCloseSub.unsubscribe();
    });

    const sub2 = componentRef.instance.onClose.subscribe(() => {
      this.removeDialogComponentFromBody(componentRef);
      sub2.unsubscribe();
    });

    return dialogRef;
  }

  private removeDialogComponentFromBody(
    componentRef: ComponentRef<DialogComponent>,
  ): void {
    this.viewContainerRef.remove(
      this.viewContainerRef.indexOf(componentRef.hostView),
    );

    this.dialogs = this.dialogs.filter((ref) => ref !== componentRef);

    if (this.dialogs.length === 0) {
      this.renderer.removeClass(this.document.body, 'modal-open');
    }
  }
}
