import {
  Component,
  Input,
  Output,
  EventEmitter,
  ContentChildren,
  QueryList,
  AfterContentInit,
  ChangeDetectionStrategy,
  signal,
} from '@angular/core';
import { TColumnComponent } from '../t-column/t-column.component';
import { Direction } from '../../models/direction.enum';
import { Observable, of, combineLatest, map, defer } from 'rxjs';
import { CommonModule } from '@angular/common';
import { TButtonComponent } from '../t-button/t-button.component';
import { TSelectComponent } from '../t-select/t-select.component';
import { sortData } from '../../utils/sorting.utils';
import { paginateData } from '../../utils/pagination.utils';
import { toObservable } from '@angular/core/rxjs-interop';
import { TranslocoService } from '@jsverse/transloco';
import { Size, Theme } from '../../types/theme';

/**
 * TGridComponent is a customizable data grid component.
 * It supports features such as sorting, pagination, theming, and dynamic data handling.
 *
 * @template T - The type of data items to be displayed in the grid.
 */
@Component({
  selector: 't-grid',
  templateUrl: './t-grid.component.html',
  styleUrls: ['./t-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, TButtonComponent, TSelectComponent],
})
export class TGridComponent<T> implements AfterContentInit {
  /**
   * Internal storage for the data input, which can be an array or an Observable stream.
   */
  private _data!: T[] | Observable<T[]>;

  /**
   * The data to be displayed in the grid.
   * Accepts either an array of items or an Observable that emits an array of items.
   */
  @Input()
  set data(value: T[] | Observable<T[]>) {
    this._data = value;
  }

  /**
   * Retrieves the current data for the grid.
   */
  get data(): T[] | Observable<T[]> {
    return this._data;
  }

  /**
   * Enables or disables sorting functionality on the grid.
   * @default false
   */
  @Input() sortable = false;

  /**
   * Defines the theme to be applied to the grid.
   */
  @Input() theme!: Theme;

  /**
   * Specifies the size variant of the grid (e.g., small, medium, large).
   */
  @Input() size!: Size;

  /**
   * Emits an event when the sort order changes.
   * The event payload includes the column name and the new sort direction.
   */
  @Output() sortChange = new EventEmitter<{
    columnName: keyof T;
    direction: Direction;
  }>();

  /**
   * Emits an event when pagination parameters change.
   * The event payload includes the current page number and the page size.
   */
  @Output() paginationChange = new EventEmitter<{
    currentPage: number;
    pageSize: number | null;
  }>();

  /**
   * Internal storage for the page size.
   */
  private _pageSize: number | null = null;

  /**
   * Sets the number of items to display per page.
   * @param value The desired page size or null for no pagination.
   */
  @Input()
  set pageSize(value: number | null) {
    this._pageSize = value;
    this.pageSizeSignal.set(value);
  }

  /**
   * Retrieves the current page size.
   */
  get pageSize(): number | null {
    return this._pageSize;
  }

  /**
   * A QueryList of child TColumnComponent instances representing the grid's columns.
   */
  @ContentChildren(TColumnComponent) columns!: QueryList<TColumnComponent<T>>;

  /**
   * Available page size options for pagination.
   */
  pageSizes = [5, 10, 25, 50, 100];

  /**
   * Transformed page size options with labels for UI selection.
   */
  pageSizeOptions = this.pageSizes.map((size) => ({
    value: size,
    label: size.toString(),
  }));

  /** Observable for the "Page" text, used in pagination controls. */
  pageText$!: Observable<string>;

  /** Observable for the "of" text in pagination (e.g., "Page 1 of 10"). */
  pageOfText$!: Observable<string>;

  /** Observable for the "Previous" button text. */
  previousButtonText$!: Observable<string>;

  /** Observable for the "Previous" button ARIA label. */
  previousButtonAriaLabel$!: Observable<string>;

  /** Observable for the "Next" button text. */
  nextButtonText$!: Observable<string>;

  /** Observable for the "Next" button ARIA label. */
  nextButtonAriaLabel$!: Observable<string>;

  /** Observable for the grid's caption text. */
  gridCaption$!: Observable<string>;

  /** Signal to track the current sort direction ('asc', 'desc', or null). */
  sortDirection = signal<'asc' | 'desc' | null>(null);

  /** Signal to track the currently sorted column. */
  sortColumn = signal<keyof T | null>(null);

  /** Signal to track the current page number in pagination. */
  currentPage = signal<number>(1);

  /** Signal to track the current page size in pagination. */
  pageSizeSignal = signal<number | null>(null);

  /** Signal to track the total number of items in the grid. */
  totalItems = signal<number>(0);

  /** Signal to track the total number of pages based on current pagination. */
  totalPages = signal<number>(1);

  /**
   * Converts the data input into an Observable stream.
   * If the data is already an Observable, it is returned as is.
   * Otherwise, the data array is wrapped in an Observable using `of`.
   *
   * @returns An Observable emitting the data array.
   */
  get data$(): Observable<T[]> {
    return defer(() => {
      if (this.isObservable(this.data)) {
        return this.data as Observable<T[]>;
      } else {
        return of(this.data as T[]);
      }
    });
  }

  /**
   * Processes the data by applying sorting and pagination.
   * Combines the latest values of data, sort parameters, and pagination parameters.
   * Updates total items and total pages accordingly.
   */
  processedData$ = combineLatest([
    this.data$,
    toObservable(this.sortColumn),
    toObservable(this.sortDirection),
    toObservable(this.currentPage),
    toObservable(this.pageSizeSignal),
  ]).pipe(
    map(([data, sortColumn, sortDirection, currentPage, pageSize]) => {
      let processedData = [...data];

      this.totalItems.set(data.length);

      if (this.sortable && sortColumn && sortDirection) {
        processedData = sortData(processedData, sortColumn, sortDirection);
      }

      if (pageSize && pageSize > 0) {
        const totalPages = Math.ceil(processedData.length / pageSize);
        this.totalPages.set(totalPages);
        processedData = paginateData(processedData, currentPage, pageSize);
      } else {
        this.totalPages.set(1);
      }

      return processedData;
    }),
  );

  /**
   * Injects the TranslocoService for handling translations.
   *
   * @param translocoService The Transloco service instance.
   */
  constructor(private translocoService: TranslocoService) {}

  /**
   * Lifecycle hook that is called after Angular has fully initialized the component's content.
   * Initializes translation observables for various UI texts.
   */
  ngAfterContentInit() {
    // Translations
    this.pageText$ = this.translocoService.selectTranslate('lib.grid.pageText');
    this.pageOfText$ = this.translocoService.selectTranslate(
      'lib.grid.pageOfText',
    );
    this.previousButtonText$ = this.translocoService.selectTranslate(
      'lib.grid.previousButtonText',
    );
    this.previousButtonAriaLabel$ = this.translocoService.selectTranslate(
      'lib.grid.previousButtonAriaLabel',
    );
    this.nextButtonText$ = this.translocoService.selectTranslate(
      'lib.grid.nextButtonText',
    );
    this.nextButtonAriaLabel$ = this.translocoService.selectTranslate(
      'lib.grid.nextButtonAriaLabel',
    );
    this.gridCaption$ = this.translocoService.selectTranslate(
      'lib.grid.gridCaption',
    );
  }

  /**
   * Handles click events on column headers to toggle sorting.
   * If the clicked column is already sorted, it toggles the sort direction.
   * Otherwise, it sets the clicked column as the new sort column and defaults to ascending order.
   * Emits the `sortChange` event with the new sort parameters and resets the current page to 1.
   *
   * @param column The column component that was clicked.
   */
  onHeaderClick(column: TColumnComponent<T>) {
    if (!column.sortable || !this.sortable) {
      return;
    }
    if (this.sortColumn() === column.property) {
      const newDirection = this.sortDirection() === 'asc' ? 'desc' : 'asc';
      this.sortDirection.set(newDirection);
    } else {
      this.sortColumn.set(column.property);
      this.sortDirection.set('asc');
    }
    this.sortChange.emit({
      columnName: this.sortColumn()!,
      direction: this.sortDirection() as Direction,
    });
    this.currentPage.set(1);
  }

  /**
   * Handles changes to the page size selection.
   * Updates the page size signal, resets the current page to 1,
   * and emits the `paginationChange` event with the new pagination parameters.
   *
   * @param event The DOM event triggered by changing the page size.
   */
  onPageSizeChange(event: Event) {
    this.pageSizeSignal.set(Number((event?.target as HTMLSelectElement).value));
    this.currentPage.set(1);
    this.paginationChange.emit({
      currentPage: this.currentPage(),
      pageSize: this.pageSizeSignal(),
    });
  }

  /**
   * Navigates to a specified page number.
   * Ensures the requested page is within valid bounds before updating.
   * Emits the `paginationChange` event with the new pagination parameters.
   *
   * @param page The page number to navigate to.
   */
  goToPage(page: number) {
    if (page < 1 || page > this.totalPages()) {
      return;
    }
    this.currentPage.set(page);
    this.paginationChange.emit({
      currentPage: this.currentPage(),
      pageSize: this.pageSizeSignal(),
    });
  }

  /**
   * Determines whether a given object is an Observable.
   *
   * @param obj The object to check.
   * @returns True if the object is an Observable, false otherwise.
   */
  private isObservable<T>(obj: unknown): obj is Observable<T> {
    return (
      obj !== null &&
      typeof obj === 'object' &&
      !Array.isArray(obj) &&
      typeof (obj as Observable<T>).subscribe === 'function'
    );
  }
}
