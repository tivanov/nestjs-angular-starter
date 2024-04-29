import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HasErrorDirective } from './has-error.directive';
import { HasErrorRootDirective } from './has-error-root.directive';

@NgModule({
  declarations: [HasErrorDirective, HasErrorRootDirective],
  imports: [CommonModule],
  exports: [HasErrorDirective, HasErrorRootDirective],
})
export class DirectivesModule {}