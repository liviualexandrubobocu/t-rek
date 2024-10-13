import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ThemeService } from '../../services/theme.service';
import { Theme } from '../../types/theme';

@Component({
  selector: 't-theme-toggle',
  templateUrl: './t-theme-toggle.component.html',
  styleUrls: ['./t-theme-toggle.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule],
})
export class TThemeToggleComponent {
  theme$: Observable<Theme> = of('dark');

  constructor(private themeService: ThemeService) {
    this.theme$ = this.themeService.theme$;
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }
}
