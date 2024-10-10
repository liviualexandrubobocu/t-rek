import {
  Component,
  Input,
  Output,
  EventEmitter,
  ContentChildren,
  QueryList,
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { TColumnComponent } from '../t-column/t-column.component';
import { Direction } from '../../models/direction.enum';
import { Observable, isObservable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { TButtonComponent } from '../t-button/t-button.component';
import { TSelectComponent } from '../t-select/t-select.component';

@Component({
  selector: 't-grid',
  templateUrl: './t-grid.component.html',
  styleUrls: ['./t-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, TButtonComponent, TSelectComponent],
})
export class TGridComponent<T> implements AfterContentInit {
  @Input() data!: T[] | Observable<T[]>;
  @Input() sortable: boolean = false;
  @Input() pageSize: number | null = null;
  
  @Input() theme: 'light' | 'dark' = 'light';
  @Input() size: 'small' | 'medium' | 'large' = 'medium';

  @Output() sortChange = new EventEmitter<{
    columnName: keyof T;
    direction: Direction;
  }>();
  @Output() paginationChange = new EventEmitter<{
    currentPage: number;
    pageSize: number | null;
  }>();

  @ContentChildren(TColumnComponent) columns!: QueryList<TColumnComponent<T>>;

  displayedData: T[] = [];

  currentPage: number = 1;
  totalPages: number = 1;
  totalItems: number = 0;
  pageSizes = [5, 10, 25, 50, 100];
  pageSizeOptions = this.pageSizes.map((size) => ({ value: size, label: size.toString() }));

  sortDirection: Direction | null = null;
  sortColumn: keyof T | null = null;

  private allData: T[] = [];

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterContentInit() {
    this.initializeData();
  }

  private initializeData() {
    if (isObservable(this.data)) {
      (this.data as Observable<T[]>).subscribe((data) => {
        this.allData = data;
        this.totalItems = data.length;
        this.updateDisplayedData();
        this.cdr.markForCheck();
      });
    } else {
      this.allData = this.data as T[];
      this.totalItems = this.allData.length;
      this.updateDisplayedData();
      this.cdr.markForCheck();
    }
  }

  private updateDisplayedData() {
    let data = [...this.allData];

    // Apply sorting
    if (this.sortable && this.sortColumn && this.sortDirection) {
      data.sort((a, b) => {
        const valueA = a[this.sortColumn!];
        const valueB = b[this.sortColumn!];
        if (valueA < valueB) {
          return this.sortDirection === Direction.ASC ? -1 : 1;
        } else if (valueA > valueB) {
          return this.sortDirection === Direction.ASC ? 1 : -1;
        } else {
          return 0;
        }
      });
    }

    if (this.pageSize && this.pageSize > 0) {
      this.totalPages = Math.ceil(data.length / this.pageSize);
      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      this.displayedData = data.slice(startIndex, endIndex);
    } else {
      this.displayedData = data;
      this.totalPages = 1;
    }
  }

  onHeaderClick(column: TColumnComponent<T>) {
    if (!column.sortable || !this.sortable) {
      return;
    }
    if (this.sortColumn === column.property) {
      this.sortDirection =
        this.sortDirection === Direction.ASC ? Direction.DESC : Direction.ASC;
    } else {
      this.sortColumn = column.property;
      this.sortDirection = Direction.ASC;
    }
    this.sortChange.emit({
      columnName: this.sortColumn!,
      direction: this.sortDirection,
    });
    this.currentPage = 1;
    this.updateDisplayedData();
    this.cdr.markForCheck();
  }

  onPageSizeChange(event: Event) {
    const value = event;
    this.pageSize = Number(value);
    this.currentPage = 1;
    this.paginationChange.emit({
      currentPage: this.currentPage,
      pageSize: this.pageSize,
    });
    this.updateDisplayedData();
    this.cdr.markForCheck();
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) {
      return;
    }
    this.currentPage = page;
    this.paginationChange.emit({
      currentPage: this.currentPage,
      pageSize: this.pageSize,
    });
    this.updateDisplayedData();
    this.cdr.markForCheck();
  }
}
