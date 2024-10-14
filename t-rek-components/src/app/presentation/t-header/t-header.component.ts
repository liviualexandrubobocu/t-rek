import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { Observable } from 'rxjs';
import { TThemeToggleComponent } from '../t-theme-toggle/t-theme-toggle.component';

/**
 * THeaderComponent serves as the header section of the application.
 * It displays the main title of the application and includes a theme toggle button
 * to switch between light and dark themes.
 *
 * @example
 * ```html
 * <t-header></t-header>
 * ```
 */
@Component({
  selector: 't-header',
  standalone: true,
  imports: [TThemeToggleComponent, CommonModule],
  templateUrl: './t-header.component.html',
  styleUrls: ['./t-header.component.scss'],
})
export class THeaderComponent implements OnInit {
  /**
   * An observable that emits the translated main title text.
   * Utilizes TranslocoService for internationalization.
   *
   * @type {Observable<string>}
   */
  mainTitle$!: Observable<string>;

  /**
   * Constructs an instance of THeaderComponent.
   * Injects TranslocoService for handling translations.
   *
   * @param {TranslocoService} translocoService - Service for managing internationalization and translations.
   */
  constructor(private translocoService: TranslocoService) {}

  /**
   * Lifecycle hook that is called after Angular has initialized all data-bound properties.
   * Initializes the `mainTitle$` observable with the translated main title.
   */
  ngOnInit(): void {
    this.mainTitle$ = this.translocoService.selectTranslate(
      'presentation.mainTitle',
    );
  }
}
