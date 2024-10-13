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

@Component({
  selector: 't-grid',
  templateUrl: './t-grid.component.html',
  styleUrls: ['./t-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, TButtonComponent, TSelectComponent],
})
export class TGridComponent<T> implements AfterContentInit {
  private _data!: T[] | Observable<T[]>;

  @Input() set data(value: T[] | Observable<T[]>) {
    this._data = value;
  }
  get data(): T[] | Observable<T[]> {
    return this._data;
  }

  @Input() sortable: boolean = false;
  @Input() pageSize: number | null = null;

  @Input() theme!: Theme;
  @Input() size!: Size;

  @Output() sortChange = new EventEmitter<{
    columnName: keyof T;
    direction: Direction;
  }>();
  @Output() paginationChange = new EventEmitter<{
    currentPage: number;
    pageSize: number | null;
  }>();

  @ContentChildren(TColumnComponent) columns!: QueryList<TColumnComponent<T>>;

  pageSizes = [5, 10, 25, 50, 100];
  pageSizeOptions = this.pageSizes.map((size) => ({
    value: size,
    label: size.toString(),
  }));

  pageText$!: Observable<string>;
  pageOfText$!: Observable<string>;
  previousButtonText$!: Observable<string>;
  previousButtonAriaLabel$!: Observable<string>;
  nextButtonText$!: Observable<string>;
  nextButtonAriaLabel$!: Observable<string>;
  gridCaption$!: Observable<string>;

  sortDirection = signal<'asc' | 'desc' | null>(null);
  sortColumn = signal<keyof T | null>(null);
  currentPage = signal<number>(1);
  pageSizeSignal = signal<number | null>(null);

  totalItems = signal<number>(0);
  totalPages = signal<number>(1);

  get data$(): Observable<T[]> {
    return defer(() => {
      if (this.isObservable(this.data)) {
        return this.data as Observable<T[]>;
      } else {
        return of(this.data as T[]);
      }
    });
  }

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

  constructor(private translocoService: TranslocoService) {}

  ngAfterContentInit() {
    if (this.pageSize) {
      this.pageSizeSignal.set(this.pageSize);
    }

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

  onPageSizeChange(event: any) {
    this.pageSizeSignal.set(Number(event.target.value));
    this.currentPage.set(1);
    this.paginationChange.emit({
      currentPage: this.currentPage(),
      pageSize: this.pageSizeSignal(),
    });
  }

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

  private isObservable(obj: any): obj is Observable<T[]> {
    return obj && typeof obj.subscribe === 'function';
  }
}
