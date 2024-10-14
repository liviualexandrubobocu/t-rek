import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Size, Theme } from '../../types/theme';

/**
 * TButtonComponent is a customizable button component .
 * It supports theming, sizing, disabling, and accessibility features.
 *
 * @example
 * ```html
 * <t-button
 *   theme="dark"
 *   size="large"
 *   [disabled]="isButtonDisabled"
 *   ariaLabel="Submit Form"
 * >
 *   Submit
 * </t-button>
 * ```
 */
@Component({
  selector: 't-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './t-button.component.html',
  styleUrls: ['./t-button.component.scss'],
})
export class TButtonComponent {
  /**
   * Defines the visual theme of the button.
   * Can be 'light' or 'dark'.
   *
   * @type {Theme}
   * @default 'light'
   */
  @Input() theme: Theme = 'light';

  /**
   * Specifies the size variant of the button.
   * Can be 'small', 'medium', or 'large'.
   *
   * @type {Size}
   * @default 'medium'
   */
  @Input() size: Size = 'medium';

  /**
   * Disables the button when set to true.
   * A disabled button cannot be interacted with and appears visually muted.
   *
   * @type {boolean}
   * @default false
   */
  @Input() disabled = false;

  /**
   * Provides an accessible label for the button.
   * Useful for screen readers to describe the button's action.
   *
   * @type {string | null}
   * @default null
   */
  @Input() ariaLabel!: string | null;
}
