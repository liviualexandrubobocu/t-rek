import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Theme } from '../types/theme';

/**
 * ThemeService manages the application's theme state, allowing components to subscribe
 * to theme changes and toggle between predefined themes (e.g., 'light' and 'dark').
 * It utilizes RxJS's BehaviorSubject to emit the current theme and ensure that
 * subscribers receive the latest theme value upon subscription.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  /**
   * A private BehaviorSubject that holds the current theme state.
   * Initialized with the default theme 'light'.
   *
   * @type {BehaviorSubject<Theme>}
   * @private
   */
  private themeSubject: BehaviorSubject<Theme> = new BehaviorSubject<Theme>(
    'light',
  );

  /**
   * An observable that emits the current theme.
   * Components can subscribe to this observable to react to theme changes.
   *
   * @type {Observable<Theme>}
   */
  theme$: Observable<Theme> = this.themeSubject.asObservable();

  /**
   * Sets the application's theme to the specified value.
   * Emits the new theme to all subscribers.
   *
   * @param {Theme} theme - The desired theme to set. Typically 'light' or 'dark'.
   *
   */
  setTheme(theme: Theme): void {
    this.themeSubject.next(theme);
  }

  /**
   * Toggles the application's theme between 'light' and 'dark'.
   * If the current theme is 'light', it switches to 'dark', and vice versa.
   *
   */
  toggleTheme(): void {
    const newTheme: Theme =
      this.themeSubject.value === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }
}
