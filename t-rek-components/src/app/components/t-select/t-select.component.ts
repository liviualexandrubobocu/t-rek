import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 't-select',
  templateUrl: './t-select.component.html',
  styleUrls: ['./t-select.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class TSelectComponent {
  @Input() options: Array<{ value: any; label: string }> = [];
  @Input() theme: 'light' | 'dark' = 'light';
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() disabled: boolean = false;
  @Input() selectedValue: any;

  @Output() selectionChange = new EventEmitter<any>();

  onSelectionChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.selectionChange.emit(value);
  }
}
