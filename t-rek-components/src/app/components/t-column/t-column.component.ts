import { Component, Input } from '@angular/core';

@Component({
  selector: 't-column',
  template: '',
  standalone: true,
})
export class TColumnComponent<T> {
  @Input() name!: string;
  @Input() property!: keyof T;
  @Input() sortable: boolean = false;
}
