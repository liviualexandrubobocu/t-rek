import { CommonModule } from '@angular/common';
import { TColumnComponent } from '../../components/t-column/t-column.component';
import { TGridComponent } from '../../components/t-grid/t-grid.component';
import { TProgressComponent } from '../../components/t-progress/t-progress.component';
import { Component, OnInit, OnDestroy } from '@angular/core';
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

  constructor(
    private themeService: ThemeService,
    private translocoService: TranslocoService,
  ) {
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
    { firstName: 'Jean-Luc', lastName: 'Picard', age: 59, rank: 'Captain' },
    { firstName: 'William', lastName: 'Riker', age: 46, rank: 'Commander' },
    { firstName: 'Data', lastName: '', age: 28, rank: 'Lieutenant Commander' },
    { firstName: 'Worf', lastName: '', age: 35, rank: 'Lieutenant Commander' },
    {
      firstName: 'Geordi',
      lastName: 'La Forge',
      age: 36,
      rank: 'Lieutenant Commander',
    },
    { firstName: 'Beverly', lastName: 'Crusher', age: 58, rank: 'Commander' },
    {
      firstName: 'Deanna',
      lastName: 'Troi',
      age: 43,
      rank: 'Lieutenant Commander',
    },
    { firstName: 'Wesley', lastName: 'Crusher', age: 18, rank: 'Ensign' },
    { firstName: 'Tasha', lastName: 'Yar', age: 29, rank: 'Lieutenant' },
    { firstName: 'Data', lastName: '', age: 28, rank: 'Lieutenant Commander' },
    {
      firstName: 'Miles',
      lastName: 'O’Brien',
      age: 38,
      rank: 'Chief Petty Officer',
    },
    { firstName: 'Reginald', lastName: 'Barclay', age: 34, rank: 'Lieutenant' },
    { firstName: 'Rashida', lastName: 'Jones', age: 37, rank: 'Lieutenant' },
    { firstName: 'Benjamin', lastName: 'Sisko', age: 45, rank: 'Commander' },
    { firstName: 'Kira', lastName: 'Nerys', age: 42, rank: 'Major' },
    { firstName: 'Odo', lastName: '', age: 350, rank: 'Constable' },
    {
      firstName: 'Julian',
      lastName: 'Bashir',
      age: 35,
      rank: 'Lieutenant Commander',
    },
    {
      firstName: 'Jadzia',
      lastName: 'Dax',
      age: 57,
      rank: 'Lieutenant Commander',
    },
    { firstName: 'Ezri', lastName: 'Dax', age: 31, rank: 'Lieutenant' },
    { firstName: 'Quark', lastName: '', age: 70, rank: 'Barkeep' },
    {
      firstName: 'Bashir',
      lastName: 'Julian',
      age: 35,
      rank: 'Lieutenant Commander',
    },
    { firstName: 'Nog', lastName: '', age: 24, rank: 'Lieutenant' },
    {
      firstName: 'Miles',
      lastName: 'O’Brien',
      age: 38,
      rank: 'Chief Petty Officer',
    },
    { firstName: 'Tom', lastName: 'Paris', age: 36, rank: 'Lieutenant' },
    { firstName: 'Beverly', lastName: 'Crusher', age: 58, rank: 'Commander' },
    {
      firstName: 'Data',
      lastName: '',
      age: '28',
      rank: 'Lieutenant Commander',
    },
    { firstName: 'Worf', lastName: '', age: 35, rank: 'Lieutenant Commander' },
    {
      firstName: 'Geordi',
      lastName: 'La Forge',
      age: 36,
      rank: 'Lieutenant Commander',
    },
    {
      firstName: 'Deanna',
      lastName: 'Troi',
      age: 43,
      rank: 'Lieutenant Commander',
    },
    { firstName: 'Wesley', lastName: 'Crusher', age: 18, rank: 'Ensign' },
    { firstName: 'Tasha', lastName: 'Yar', age: 29, rank: 'Lieutenant' },
    {
      firstName: 'Miles',
      lastName: 'O’Brien',
      age: 38,
      rank: 'Chief Petty Officer',
    },
    { firstName: 'Reginald', lastName: 'Barclay', age: 34, rank: 'Lieutenant' },
    { firstName: 'Rashida', lastName: 'Jones', age: 37, rank: 'Lieutenant' },
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
