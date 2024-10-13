import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { Size, Theme } from '../../types/theme';

@Component({
  selector: 't-progress',
  templateUrl: './t-progress.component.html',
  styleUrls: ['./t-progress.component.scss'],
})
export class TProgressComponent implements OnChanges {
  @Input() radius: number = 50;
  @Input() progress: number = 0;
  @Input() color: string = '#00BCD4';

  @Input() theme: Theme = 'dark';
  @Input() size: Size = 'medium';

  @Output() complete = new EventEmitter<void>();

  strokeDasharray: string = '';
  strokeDashoffset: string = '';

  circumference: number = 0;

  ngOnChanges(): void {
    this.calculateProgress();

    if (this.progress >= 100) {
      this.complete.emit();
    }
  }

  private calculateProgress(): void {
    const normalizedRadius = this.radius - 10; // Adjust for stroke width
    this.circumference = normalizedRadius * 2 * Math.PI;

    const progressPercent = Math.min(Math.max(this.progress, 0), 100);
    const offset =
      this.circumference - (progressPercent / 100) * this.circumference;

    this.strokeDasharray = `${this.circumference} ${this.circumference}`;
    this.strokeDashoffset = offset.toString();
  }
}
