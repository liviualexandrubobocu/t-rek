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

/**
 * TProgressComponent is a customizable progress indicator component.
 * It visually represents progress using a canvas-based circular progress bar with support for theming and sizing.
 *
 * @example
 * ```html
 * <t-progress
 *   [radius]="60"
 *   [progress]="75"
 *   color="#ff6347"
 *   theme="light"
 *   size="large"
 *   (finalize)="onProgressComplete()"
 * ></t-progress>
 * ```
 */
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
  /**
   * Signal to track the radius of the progress circle.
   * Initialized to 50 pixels.
   */
  private radiusSignal = signal<number>(50);

  /**
   * Signal to track the current progress value (0-100).
   */
  private progressSignal = signal<number>(0);

  /**
   * Signal to track the color of the progress indicator.
   * Initialized to a default purple color.
   */
  private colorSignal = signal<string>('#6a5acd');

  /**
   * Signal to track the current theme ('light' or 'dark').
   * Initialized to 'light'.
   */
  private themeSignal = signal<Theme>('light');

  /**
   * Signal to track the size of the progress indicator ('small', 'medium', 'large').
   * Initialized to 'medium'.
   */
  private sizeSignal = signal<Size>('medium');

  /**
   * Sets the radius of the progress circle.
   * The radius is constrained to a minimum of 50 pixels.
   *
   * @param value The desired radius in pixels.
   */
  @Input()
  set radius(value: number) {
    this.radiusSignal.set(Math.max(value, 50));
  }

  /**
   * Retrieves the current radius of the progress circle.
   *
   * @returns The radius in pixels.
   */
  get radius(): number {
    return this.radiusSignal();
  }

  /**
   * Sets the current progress value.
   * The value is constrained between 0 and 100.
   *
   * @param value The desired progress percentage.
   */
  @Input()
  set progress(value: number) {
    this.progressSignal.set(Math.min(Math.max(value, 0), 100));
  }

  /**
   * Retrieves the current progress value.
   *
   * @returns The progress percentage.
   */
  get progress(): number {
    return this.progressSignal();
  }

  /**
   * Sets the color of the progress indicator.
   *
   * @param value The desired color in HEX, RGB, or any valid CSS color format.
   */
  @Input()
  set color(value: string) {
    this.colorSignal.set(value);
  }

  /**
   * Retrieves the current color of the progress indicator.
   *
   * @returns The color string.
   */
  get color(): string {
    return this.colorSignal();
  }

  /**
   * Sets the theme of the progress indicator.
   *
   * @param value The desired theme ('light' or 'dark').
   */
  @Input()
  set theme(value: Theme) {
    this.themeSignal.set(value);
  }

  /**
   * Retrieves the current theme of the progress indicator.
   *
   * @returns The theme ('light' or 'dark').
   */
  get theme(): Theme {
    return this.themeSignal();
  }

  /**
   * Sets the size of the progress indicator.
   *
   * @param value The desired size ('small', 'medium', 'large').
   */
  @Input()
  set size(value: Size) {
    this.sizeSignal.set(value);
  }

  /**
   * Retrieves the current size of the progress indicator.
   *
   * @returns The size ('small', 'medium', 'large').
   */
  get size(): Size {
    return this.sizeSignal();
  }

  /**
   * Emits an event when the progress animation completes (i.e., reaches 100%).
   * Useful for triggering actions upon completion of the progress.
   */
  @Output() finalize = new EventEmitter<void>();

  /**
   * Reference to the canvas element used for rendering the progress indicator.
   */
  @ViewChild('progressCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  /**
   * Subscription to the progress animation observable.
   */
  private progressSubscription: Subscription | null = null;

  /**
   * IntersectionObserver to detect when the component enters the viewport.
   */
  private intersectionObserver!: IntersectionObserver;

  /**
   * Flag to ensure the progress animation runs only once.
   */
  private hasAnimated = false;

  /**
   * Injects necessary services and initializes reactive effects.
   *
   * @param progressService Service responsible for managing progress animations.
   * @param cdr ChangeDetectorRef for manually triggering change detection.
   * @param hostElement Reference to the host DOM element of the component.
   */
  constructor(
    private progressService: TProgressService,
    private cdr: ChangeDetectorRef,
    private hostElement: ElementRef,
  ) {
    // Reactive effect to initialize and update the progress service whenever relevant signals change.
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

  /**
   * Sets up the IntersectionObserver to trigger the progress animation when the component becomes visible.
   */
  ngAfterViewInit(): void {
    this.setupIntersectionObserver();
    this.cdr.markForCheck();
  }

  /**
   * Sets up the IntersectionObserver to monitor when the component enters the viewport.
   * When at least 10% of the component is visible, the progress animation is triggered.
   */
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

    this.intersectionObserver.observe(this.hostElement.nativeElement);
  }

  /**
   * Lifecycle hook that is called just before Angular destroys the component.
   * Cleans up subscriptions and observers to prevent memory leaks.
   */
  ngOnDestroy(): void {
    if (this.progressSubscription) {
      this.progressSubscription.unsubscribe();
    }
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
    this.progressService.destroy();
  }

  /**
   * Initiates the progress animation using the ProgressService.
   * Subscribes to the animation observable to update the view and emit the finalize event upon completion.
   */
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
            this.finalize.emit();
          }
        },
      });
  }
}
