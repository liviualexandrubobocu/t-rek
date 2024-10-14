import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslocoService } from '@jsverse/transloco';
import { Observable } from 'rxjs';
import { SelectOption } from '../../types/options';
import { Size, Theme } from '../../types/theme';

/**
 * TSelectComponent is a select (dropdown) component.
 * It supports theming, sizing, disabling, and emits events upon selection changes.
 *
 * @example
 * ```html
 * <t-select
 *   [options]="selectOptions"
 *   theme="dark"
 *   size="large"
 *   [disabled]="isDisabled"
 *   [(value)]="selectedValue"
 *   (selectionChange)="onSelectionChanged($event)"
 * ></t-select>
 * ```
 */
@Component({
  selector: 't-select',
  templateUrl: './t-select.component.html',
  styleUrls: ['./t-select.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class TSelectComponent implements OnInit {
  /**
   * An array of options to be displayed in the select dropdown.
   * Each option should conform to the `SelectOption` interface.
   *
   * @type {SelectOption[]}
   * @default []
   */
  @Input() options: SelectOption[] = [];

  /**
   * Defines the theme of the select component.
   * Can be 'light' or 'dark'.
   *
   * @type {Theme}
   * @default 'light'
   */
  @Input() theme: Theme = 'light';

  /**
   * Specifies the size variant of the select component.
   * Can be 'small', 'medium', or 'large'.
   *
   * @type {Size}
   * @default 'medium'
   */
  @Input() size: Size = 'medium';

  /**
   * Disables the select component when set to true.
   *
   * @type {boolean}
   * @default false
   */
  @Input() disabled = false;

  /**
   * The current value of the select component.
   * Can be of any type (`unknown`).
   *
   * @type {unknown}
   */
  @Input() value: unknown;

  /**
   * Emits an event whenever the selected option changes.
   * The emitted value is the new selected value as a string.
   *
   * @type {EventEmitter<string>}
   */
  @Output() selectionChange = new EventEmitter<string>();

  /**
   * An observable that holds the translated text for the page size label.
   *
   * @type {Observable<string>}
   */
  pageSizeText$!: Observable<string>;

  /**
   * Handles the change event triggered by the select element.
   * Emits the new selected value through the `selectionChange` event emitter.
   *
   * @param {Event} event - The DOM event triggered by changing the selection.
   */
  onSelectionChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.selectionChange.emit(value);
  }

  /**
   * Injects the TranslocoService for handling translations.
   *
   * @param {TranslocoService} translocoService - The Transloco service instance.
   */
  constructor(private translocoService: TranslocoService) {}

  /**
   * Initializes the `pageSizeText$` observable with the translated page size text.
   */
  ngOnInit(): void {
    this.pageSizeText$ = this.translocoService.selectTranslate(
      'lib.grid.pageSizeText',
    );
  }
}
