import {
  Injectable,
  ComponentFactoryResolver,
  ApplicationRef,
  Injector,
  EmbeddedViewRef,
  ComponentRef,
  Type,
  Inject,
  Renderer2,
  RendererFactory2,
} from '@angular/core';
import { DialogComponent } from './dialog.component';
import { DialogConfig } from './dialog-config';
import { DialogInjector } from './dialog-injector';
import { DialogRef } from './dialog-ref';
import { DOCUMENT } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class DialogService {
  dialogComponentRef: ComponentRef<DialogComponent>;
  private renderer: Renderer2;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector,
    @Inject(DOCUMENT) private document: Document,
    private rendererFactory: RendererFactory2
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  public open(componentType: Type<any>, config: DialogConfig): DialogRef {
    const dialogRef = this.appendDialogComponentToBody(config);

    this.dialogComponentRef.instance.childComponentType = componentType;
    this.renderer.addClass(this.document.body, 'modal-open');

    return dialogRef;
  }

  private appendDialogComponentToBody(config: DialogConfig): DialogRef {
    const map = new WeakMap();
    map.set(DialogConfig, config);

    const dialogRef = new DialogRef();
    map.set(DialogRef, dialogRef);

    const sub = dialogRef.afterClosed.subscribe(() => {
      // close the dialog
      this.removeDialogComponentFromBody();
      sub.unsubscribe();
    });

    const componentFactory =
      this.componentFactoryResolver.resolveComponentFactory(DialogComponent);
    const componentRef = componentFactory.create(
      new DialogInjector(this.injector, map)
    );
    this.appRef.attachView(componentRef.hostView);

    const domElem = (componentRef.hostView as EmbeddedViewRef<any>)
      .rootNodes[0] as HTMLElement;
    document.body.appendChild(domElem);

    this.dialogComponentRef = componentRef;

    const sub2 = this.dialogComponentRef.instance.onClose.subscribe(() => {
      this.removeDialogComponentFromBody();
      sub2.unsubscribe();
    });

    return dialogRef;
  }

  private removeDialogComponentFromBody(): void {
    this.appRef.detachView(this.dialogComponentRef.hostView);
    this.dialogComponentRef.destroy();
    this.renderer.removeClass(this.document.body, 'modal-open');
  }
}
