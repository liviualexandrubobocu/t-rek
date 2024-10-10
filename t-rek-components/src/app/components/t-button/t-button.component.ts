import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 't-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './t-button.component.html',
  styleUrl: './t-button.component.scss'
})
export class TButtonComponent {
  @Input() theme: 'light' | 'dark' = 'light';
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() disabled: boolean = false;
}
