import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Size, Theme } from '../../types/theme';

@Component({
  selector: 't-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './t-button.component.html',
  styleUrl: './t-button.component.scss',
})
export class TButtonComponent {
  @Input() theme: Theme = 'dark';
  @Input() size: Size = 'medium';
  @Input() disabled: boolean = false;
  @Input() ariaLabel!: string | null;
}
