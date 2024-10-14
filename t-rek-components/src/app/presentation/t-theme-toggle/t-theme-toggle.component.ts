import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { Observable, of } from 'rxjs';
import { ThemeService } from '../../services/theme.service';
import { Theme } from '../../types/theme';

/**
 * TThemeToggleComponent provides a toggle button to switch between light and dark themes.
 * It leverages the ThemeService to manage the current theme state and uses TranslocoService
 * for internationalized accessibility labels.
 *
 * @example
 * ```html
 * <t-theme-toggle></t-theme-toggle>
 * ```
 */
@Component({
  selector: 't-theme-toggle',
  templateUrl: './t-theme-toggle.component.html',
  styleUrls: ['./t-theme-toggle.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule],
})
export class TThemeToggleComponent implements OnInit {
  /**
   * An observable that emits the current theme ('light' or 'dark').
   * Subscribes to the ThemeService to receive real-time theme updates.
   *
   * @type {Observable<Theme>}
   */
  theme$: Observable<Theme> = of('light');

  /**
   * An observable that holds the translated ARIA label for the toggle button.
   * Utilizes TranslocoService for internationalization.
   *
   * @type {Observable<string>}
   */
  toggleButtonAriaLabel$!: Observable<string>;

  /**
   * Constructs an instance of TThemeToggleComponent.
   * Injects ThemeService for theme management and TranslocoService for translations.
   *
   * @param {ThemeService} themeService - Service to manage and observe theme changes.
   * @param {TranslocoService} translocoService - Service for handling internationalization and translations.
   */
  constructor(
    private themeService: ThemeService,
    private translocoService: TranslocoService,
  ) {
    // Subscribe to the theme observable to keep the component's theme in sync.
    this.theme$ = this.themeService.theme$;
  }

  /**
   * Lifecycle hook that is called after Angular has initialized all data-bound properties.
   * Initializes the translated ARIA label for the toggle button.
   */
  ngOnInit(): void {
    this.toggleButtonAriaLabel$ = this.translocoService.selectTranslate(
      'presentation.toggleButtonAriaLabel',
    );
  }

  /**
   * Toggles the current theme between 'light' and 'dark'.
   * Invokes the ThemeService to switch themes.
   */
  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
