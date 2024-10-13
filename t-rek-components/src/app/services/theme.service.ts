import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Theme } from '../types/theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private themeSubject = new BehaviorSubject<Theme>('light');
  theme$ = this.themeSubject.asObservable();

  setTheme(theme: Theme) {
    this.themeSubject.next(theme);
  }

  toggleTheme() {
    this.setTheme(this.themeSubject.value === 'light' ? 'dark' : 'light');
  }
}
