import { CommonModule } from '@angular/common';
import { TColumnComponent } from '../../components/t-column/t-column.component';
import { TGridComponent } from '../../components/t-grid/t-grid.component';
import { TProgressComponent } from '../../components/t-progress/t-progress.component';
import {
  Component,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { ThemeService } from '../../services/theme.service';
import { Observable, Subscription } from 'rxjs';
import { THeaderComponent } from '../t-header/t-header.component';
import { TTypewriterComponent } from '../t-typewriter/t-typewriter.component';
import { TranslocoService } from '@jsverse/transloco';
import { Size, Theme } from '../../types/theme';

@Component({
  selector: 't-rek-components',
  standalone: true,
  imports: [
    CommonModule,
    THeaderComponent,
    TGridComponent,
    TColumnComponent,
    TProgressComponent,
    TTypewriterComponent,
  ],
  templateUrl: './t-rek-components.component.html',
  styleUrl: './t-rek-components.component.scss',
})
export class TRekComponentsComponent implements OnInit, OnDestroy {
  progressValue: number = 0;
  interval?: NodeJS.Timeout;
  animationId?: number;
  theme: Theme = 'dark';
  themeSubscription: Subscription;

  size: Size = 'medium';
  pageSize: number = 5;

  gridTitle$!: Observable<string>;
  progressTitle$!: Observable<string>;

  constructor(private themeService: ThemeService, 
    private translocoService: TranslocoService) {
    this.themeSubscription = this.themeService.theme$.subscribe((theme) => {
      this.theme = theme;
    });
  }

  ngOnInit() {
    this.animationId = requestAnimationFrame(() => this.increaseLoader());
    this.gridTitle$ = this.translocoService.selectTranslate(
      'presentation.gridTitle',
    );
    this.progressTitle$ = this.translocoService.selectTranslate(
      'presentation.progressTitle',
    );
  }

  increaseLoader() {
    if (this.progressValue < 100) {
      this.progressValue += 5;
    }
    requestAnimationFrame(() => this.increaseLoader());
  }

  data = [
    { firstName: 'Alice', lastName: 'Smith', age: 30 },
    { firstName: 'Bob', lastName: 'Johnson', age: 25 },
    { firstName: 'Charlie', lastName: 'Brown', age: 35 },
    { firstName: 'Alice', lastName: 'Smith', age: 30 },
    { firstName: 'Bob', lastName: 'Johnson', age: 25 },
    { firstName: 'Charlie', lastName: 'Brown', age: 35 },
    { firstName: 'Alice', lastName: 'Smith', age: 30 },
    { firstName: 'Bob', lastName: 'Johnson', age: 25 },
    { firstName: 'Charlie', lastName: 'Brown', age: 35 },
    { firstName: 'Alice', lastName: 'Smith', age: 30 },
    { firstName: 'Bob', lastName: 'Johnson', age: 25 },
    { firstName: 'Charlie', lastName: 'Brown', age: 35 },
    { firstName: 'Alice', lastName: 'Smith', age: 30 },
    { firstName: 'Bob', lastName: 'Johnson', age: 25 },
    { firstName: 'Charlie', lastName: 'Brown', age: 35 },
    { firstName: 'Alice', lastName: 'Smith', age: 30 },
    { firstName: 'Bob', lastName: 'Johnson', age: 25 },
    { firstName: 'Charlie', lastName: 'Brown', age: 35 },
    { firstName: 'Alice', lastName: 'Smith', age: 30 },
    { firstName: 'Bob', lastName: 'Johnson', age: 25 },
    { firstName: 'Charlie', lastName: 'Brown', age: 35 },
    { firstName: 'Alice', lastName: 'Smith', age: 30 },
    { firstName: 'Bob', lastName: 'Johnson', age: 25 },
    { firstName: 'Charlie', lastName: 'Brown', age: 35 },
    { firstName: 'Alice', lastName: 'Smith', age: 30 },
    { firstName: 'Bob', lastName: 'Johnson', age: 25 },
    { firstName: 'Charlie', lastName: 'Brown', age: 35 },
    { firstName: 'Alice', lastName: 'Smith', age: 30 },
    { firstName: 'Bob', lastName: 'Johnson', age: 25 },
    { firstName: 'Charlie', lastName: 'Brown', age: 35 },
    { firstName: 'Alice', lastName: 'Smith', age: 30 },
    { firstName: 'Bob', lastName: 'Johnson', age: 25 },
    { firstName: 'Charlie', lastName: 'Brown', age: 35 },
  ];

  performFetch(event: { currentPage: number; pageSize: number | null }) {
    console.log('Pagination event:', event);
  }

  onProgressComplete() {
    console.log('Progress Complete!');
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.animationId as number);
    this.themeSubscription.unsubscribe();
  }
}
