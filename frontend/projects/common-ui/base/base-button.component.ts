import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { BaseComponent } from './base.component';

@Component({
  selector: 'app-base-button',
  template: '',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, RouterModule],
})
export abstract class BaseButtonComponent extends BaseComponent {
  readonly text = input<string>('');
  readonly type = input<'button' | 'submit'>('button');
  readonly disabled = input(false);
  readonly link = input<string | null>(null);
  readonly isExternalLink = input(false);

  readonly bold = input(false);
  readonly underline = input(false);
  readonly uppercase = input(false);
  readonly textSize = input<'xs' | 'sm' | 'base' | 'lg'>('base');

  readonly isLoading = input(false);
  readonly loadingText = input<string>();

  readonly icon = input<IconProp | null>(null);
  readonly iconPosition = input<'left' | 'right'>('left');
  readonly iconSize = input<'xs' | 'sm' | 'lg' | 'xl' | '2xl'>('sm');

  readonly gradientDirection = input<'left' | 'right'>('left');

  readonly color = input<'accent' | 'primary'>();

  protected getTextSizeClasses(): string {
    return (
      {
        xs: 'text-xs',
        sm: 'text-sm',
        base: 'text-base',
        lg: 'text-lg',
      }[this.textSize()] ?? 'text-base'
    );
  }

  protected getDisplayText(): string {
    const displayText = this.isLoading()
      ? (this.loadingText() ?? this.text())
      : this.text();
    return this.uppercase() ? displayText?.toUpperCase() : displayText;
  }
}
