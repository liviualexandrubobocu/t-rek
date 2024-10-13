import {
  Component,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  signal,
  effect,
} from '@angular/core';
import { TProgressService } from './t-progress.service';
import { Subscription } from 'rxjs';
import { Size, Theme } from '../../types/theme';

@Component({
  selector: 't-progress',
  templateUrl: './t-progress.component.html',
  styleUrls: ['./t-progress.component.scss'],
  providers: [TProgressService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.light]': "theme === 'light'",
    '[class.dark]': "theme === 'dark'",
    '[class.small]': "size === 'small'",
    '[class.medium]': "size === 'medium'",
    '[class.large]': "size === 'large'",
  },
  standalone: true,
})
export class TProgressComponent implements AfterViewInit, OnDestroy {
  private radiusSignal = signal<number>(50);
  private progressSignal = signal<number>(0);
  private colorSignal = signal<string>('#6a5acd');
  private themeSignal = signal<Theme>('dark');
  private sizeSignal = signal<Size>('medium');

  @Input()
  set radius(value: number) {
    this.radiusSignal.set(Math.max(value, 50));
  }
  get radius(): number {
    return this.radiusSignal();
  }

  @Input()
  set progress(value: number) {
    this.progressSignal.set(Math.min(Math.max(value, 0), 100));
  }
  get progress(): number {
    return this.progressSignal();
  }

  @Input()
  set color(value: string) {
    this.colorSignal.set(value);
  }
  get color(): string {
    return this.colorSignal();
  }

  @Input()
  set theme(value: Theme) {
    this.themeSignal.set(value);
  }
  get theme(): Theme {
    return this.themeSignal();
  }

  @Input()
  set size(value: Size) {
    this.sizeSignal.set(value);
  }
  get size(): Size {
    return this.sizeSignal();
  }

  @Output() complete = new EventEmitter<void>();

  @ViewChild('progressCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  private progressSubscription: Subscription | null = null;
  private intersectionObserver!: IntersectionObserver;
  private hasAnimated = false;

  constructor(
    private progressService: TProgressService,
    private cdr: ChangeDetectorRef,
    private hostElement: ElementRef,
  ) {
    effect(() => {
      if (this.canvasRef) {
        this.progressService.initialize(
          this.canvasRef.nativeElement,
          this.radiusSignal(),
          this.colorSignal(),
          this.themeSignal(),
          this.sizeSignal(),
        );
        this.progressService.setAnimationDuration(3500);
        this.animateProgress();
      }
    });
  }

  ngAfterViewInit(): void {
    this.setupIntersectionObserver();
    this.cdr.markForCheck();
  }

  private setupIntersectionObserver(): void {
    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !this.hasAnimated) {
            this.animateProgress();
            this.hasAnimated = true;
            this.intersectionObserver.unobserve(entry.target);
          }
        });
      },
      {
        root: null, // Observe relative to the viewport
        threshold: 0.1, // Trigger when 10% of the component is visible
      },
    );

    // Observe the host element
    this.intersectionObserver.observe(this.hostElement.nativeElement);
  }

  ngOnDestroy(): void {
    if (this.progressSubscription) {
      this.progressSubscription.unsubscribe();
    }
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
    this.progressService.destroy();
  }

  private animateProgress(): void {
    if (this.progressSubscription) {
      this.progressSubscription.unsubscribe();
    }

    this.progressSubscription = this.progressService
      .animateProgress(this.progressSignal())
      .subscribe({
        next: () => {
          this.cdr.markForCheck();
        },
        complete: () => {
          if (this.progressSignal() >= 100) {
            this.complete.emit();
          }
        },
      });
  }
}
