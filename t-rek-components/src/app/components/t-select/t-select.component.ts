import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslocoService } from '@jsverse/transloco';
import { Observable } from 'rxjs';
import { SelectOption } from '../../types/options';
import { Size, Theme } from '../../types/theme';

@Component({
  selector: 't-select',
  templateUrl: './t-select.component.html',
  styleUrls: ['./t-select.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class TSelectComponent implements OnInit {
  @Input() options: SelectOption[] = [];
  @Input() theme: Theme = 'dark';
  @Input() size: Size = 'medium';
  @Input() disabled = false;
  @Input() value: unknown;
  @Output() selectionChange = new EventEmitter<string>();

  pageSizeText$!: Observable<string>;

  onSelectionChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.selectionChange.emit(value);
  }

  constructor(private translocoService: TranslocoService) {}

  ngOnInit() {
    this.pageSizeText$ = this.translocoService.selectTranslate(
      'lib.grid.pageSizeText',
    );
  }
}
