import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { Observable } from 'rxjs';
import { Size, Theme } from '../../types/theme';

@Component({
  selector: 't-select',
  templateUrl: './t-select.component.html',
  styleUrls: ['./t-select.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class TSelectComponent {
  @Input() options: Array<{ value: any; label: string }> = [];
  @Input() theme: Theme = 'dark';
  @Input() size: Size = 'medium';
  @Input() disabled: boolean = false;
  @Input() value: any;
  @Output() selectionChange = new EventEmitter<any>();
  
  pageSizeText$!: Observable<string>;

  onSelectionChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.selectionChange.emit(value);
  }

  constructor(private translocoService: TranslocoService){
  }

  ngOnInit(){
    this.pageSizeText$ = this.translocoService.selectTranslate(
      'lib.grid.pageSizeText',
    );
  }
}
