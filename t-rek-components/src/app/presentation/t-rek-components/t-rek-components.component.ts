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

/**
 * TRekComponentsComponent is an integrated view of multple components: header, grid, progress indicator,
 * and typewriter to present a cohesive user interface. It manages themes, sizes, pagination, and progress animations.
 *
 * @example
 * ```html
 * <t-rek-components></t-rek-components>
 * ```
 */
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
  styleUrls: ['./t-rek-components.component.scss'],
})
export class TRekComponentsComponent implements OnInit, OnDestroy {
  /**
   * Represents the current progress value for the progress indicator.
   * Ranges from 0 to 100.
   *
   * @type {number}
   * @default 0
   */
  progressValue = 0;

  /**
   * The ID returned by `requestAnimationFrame`, used to cancel the animation if necessary.
   *
   * @type {number | undefined}
   */
  animationId?: number;

  /**
   * The current theme of the component, either 'light' or 'dark'.
   *
   * @type {Theme}
   * @default 'light'
   */
  theme: Theme = 'light';

  /**
   * Subscription to the theme observable from the ThemeService.
   * Manages theme changes dynamically.
   *
   * @type {Subscription}
   */
  themeSubscription: Subscription;

  /**
   * The current size of the component, affecting various sub-components.
   * Can be 'small', 'medium', or 'large'.
   *
   * @type {Size}
   * @default 'medium'
   */
  size: Size = 'medium';

  /**
   * The number of items to display per page in the grid component.
   *
   * @type {number}
   * @default 5
   */
  pageSize = 5;

  /**
   * Observable holding the translated title for the grid component.
   *
   * @type {Observable<string>}
   */
  gridTitle$!: Observable<string>;

  /**
   * Observable holding the translated title for the progress component.
   *
   * @type {Observable<string>}
   */
  progressTitle$!: Observable<string>;

  /**
   * An array of data objects representing individuals from Star Trek.
   * Used as the data source for the grid component.
   *
   * @type {Array<{ firstName: string; lastName: string; age: number | string; rank: string }>}
   */
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

  /**
   * Constructs an instance of TRekComponentsComponent.
   * Injects ThemeService for theme management and TranslocoService for translations.
   *
   * @param {ThemeService} themeService - Service to manage and observe theme changes.
   * @param {TranslocoService} translocoService - Service for handling internationalization and translations.
   */
  constructor(
    private themeService: ThemeService,
    private translocoService: TranslocoService,
  ) {
    this.themeSubscription = this.themeService.theme$.subscribe((theme) => {
      this.theme = theme;
    });
  }

  /**
   * Starts the progress animation and initializes translated titles for grid and progress components.
   */
  ngOnInit(): void {
    // Start the progress animation.
    this.animationId = requestAnimationFrame(() => this.increaseLoader());

    this.gridTitle$ = this.translocoService.selectTranslate(
      'presentation.gridTitle',
    );
    this.progressTitle$ = this.translocoService.selectTranslate(
      'presentation.progressTitle',
    );
  }

  /**
   * Increases the progress value incrementally and continues the animation until reaching 100%.
   * Utilizes `requestAnimationFrame` for smooth animations.
   */
  increaseLoader(): void {
    if (this.progressValue < 100) {
      this.progressValue += 5;
    }
    this.animationId = requestAnimationFrame(() => this.increaseLoader());
  }

  /**
   * Handles pagination events emitted by the grid component.
   * Logs the current page and page size to the console.
   *
   * @param {object} event - The pagination event containing currentPage and pageSize.
   * @param {number} event.currentPage - The current active page number.
   * @param {number | null} event.pageSize - The number of items per page or null if pagination is disabled.
   */
  performFetch(event: { currentPage: number; pageSize: number | null }): void {
    console.log('Pagination event:', event);
  }

  /**
   * Callback function invoked when the progress animation completes.
   * Logs a completion message to the console.
   */
  onProgressComplete(): void {
    console.log('Progress Complete!');
    // Implement additional logic upon progress completion, such as triggering other actions.
  }

  /**
   * Lifecycle hook that is called just before Angular destroys the component.
   * Cleans up subscriptions and cancels ongoing animations to prevent memory leaks.
   */
  ngOnDestroy(): void {
    // Cancel the ongoing animation frame to stop the progress increment.
    if (this.animationId !== undefined) {
      cancelAnimationFrame(this.animationId);
    }

    // Unsubscribe from the theme subscription to prevent memory leaks.
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
  }
}
