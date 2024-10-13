import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
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
export class TThemeToggleComponent implements OnInit {
  theme$: Observable<Theme> = of('dark');
  toggleButtonAriaLabel$!: Observable<string>;

  constructor(
    private themeService: ThemeService,
    private translocoService: TranslocoService,
  ) {
    this.theme$ = this.themeService.theme$;
  }

  ngOnInit() {
    this.toggleButtonAriaLabel$ = this.translocoService.selectTranslate(
      'presentation.toggleButtonAriaLabel',
    );
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }
}
