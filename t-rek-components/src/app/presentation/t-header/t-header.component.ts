import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { Observable } from 'rxjs';
import { TThemeToggleComponent } from '../t-theme-toggle/t-theme-toggle.component';

@Component({
  selector: 't-header',
  standalone: true,
  imports: [TThemeToggleComponent, CommonModule],
  templateUrl: './t-header.component.html',
  styleUrl: './t-header.component.scss',
})
export class THeaderComponent implements OnInit {
  mainTitle$!: Observable<string>;
  constructor(private translocoService: TranslocoService) {}

  ngOnInit() {
    this.mainTitle$ = this.translocoService.selectTranslate(
      'presentation.mainTitle',
    );
  }
}
