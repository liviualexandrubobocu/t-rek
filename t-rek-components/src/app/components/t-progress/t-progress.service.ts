import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Size, Theme } from '../../types/theme';

/**
 * TProgressService is responsible for managing and animating a circular progress indicator using the HTML5 Canvas API.
 * It handles the initialization, rendering, and animation of the progress circle based on provided configurations.
 */
@Injectable()
export class TProgressService {
  /**
   * The 2D rendering context for the canvas element.
   */
  private context!: CanvasRenderingContext2D;

  /**
   * The HTML canvas element where the progress indicator is rendered.
   */
  private canvas!: HTMLCanvasElement;

  /**
   * The radius of the progress circle in pixels.
   */
  private radius!: number;

  /**
   * The color of the progress arc.
   */
  private color!: string;

  /**
   * The current theme ('light' or 'dark') influencing the background and text colors.
   */
  private theme!: Theme;

  /**
   * The size category ('small', 'medium', 'large') determining font sizes and other size-related properties.
   */
  private size!: Size;

  /**
   * The ID of the current animation frame, used to cancel animations if needed.
   */
  private animationId!: number;

  /**
   * The duration of the progress animation in milliseconds.
   * @default 3500
   */
  private _duration = 3500;

  /**
   * Gets the duration of the progress animation.
   *
   * @returns The animation duration in milliseconds.
   */
  get duration(): number {
    return this._duration;
  }

  /**
   * Sets the duration of the progress animation.
   *
   * @param duration The desired animation duration in milliseconds.
   */
  set duration(duration: number) {
    this._duration = duration;
  }

  /**
   * Initializes the progress service with the necessary configurations and prepares the canvas for rendering.
   *
   * @param canvas The HTMLCanvasElement where the progress indicator will be rendered.
   * @param radius The radius of the progress circle in pixels. Must be at least 50 pixels.
   * @param color The color of the progress arc in any valid CSS color format.
   * @param theme The theme of the progress indicator ('light' or 'dark').
   * @param size The size category of the progress indicator ('small', 'medium', 'large').
   *
   * @throws Will throw an error if the canvas context cannot be obtained.
   */
  initialize(
    canvas: HTMLCanvasElement,
    radius: number,
    color: string,
    theme: Theme,
    size: Size,
  ): void {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Unable to obtain 2D context from canvas.');
    }
    this.context = ctx;
    this.radius = radius;
    this.color = color;
    this.theme = theme;
    this.size = size;
    this.setCanvasSize();
    this.drawBackground();
  }

  /**
   * Sets the duration of the progress animation.
   *
   * @param duration The desired animation duration in milliseconds.
   */
  setAnimationDuration(duration: number): void {
    this.duration = duration;
  }

  /**
   * Draws the static background circle representing the total progress path.
   * The background color adapts based on the current theme.
   */
  drawBackground(): void {
    const ctx = this.context;
    const centerX = this.radius;
    const centerY = this.radius;

    // Clear the canvas before drawing
    ctx.clearRect(0, 0, this.radius * 2, this.radius * 2);

    ctx.beginPath();
    ctx.arc(centerX, centerY, this.radius - 10, 0, 2 * Math.PI);
    ctx.strokeStyle = this.getBackgroundStrokeColor();
    ctx.lineWidth = 10;
    ctx.stroke();
  }

  /**
   * Animates the progress indicator from 0% to the specified target progress.
   * The animation progresses smoothly over the set duration.
   *
   * @param targetProgress The target progress value (0 to 100).
   * @returns An Observable that emits the current progress value at each animation frame and completes when the target is reached.
   */
  animateProgress(targetProgress: number): Observable<number> {
    const startTime = performance.now();
    return new Observable<number>((observer) => {
      const animate = (timestamp: number) => {
        const elapsed = timestamp - startTime;
        const progressFraction = Math.min(elapsed / this.duration, 1);
        const progressValue = progressFraction * targetProgress;

        this.drawProgressCircle(progressValue);
        observer.next(progressValue);

        if (progressFraction < 1) {
          this.animationId = requestAnimationFrame(animate);
        } else {
          observer.complete();
        }
      };
      this.animationId = requestAnimationFrame(animate);

      // Cleanup function to cancel the animation if unsubscribed
      return () => {
        cancelAnimationFrame(this.animationId);
      };
    });
  }

  /**
   * Cleans up any ongoing animations to prevent memory leaks.
   * Should be called when the service is no longer needed.
   */
  destroy(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }

  /**
   * Sets the size of the canvas element based on the specified radius.
   * Ensures that the canvas dimensions accommodate the entire progress circle.
   */
  private setCanvasSize(): void {
    this.canvas.width = this.radius * 2;
    this.canvas.height = this.radius * 2;
  }

  /**
   * Draws the progress arc and the percentage text inside the circle based on the current progress value.
   *
   * @param progressValue The current progress value (0 to 100).
   */
  private drawProgressCircle(progressValue: number): void {
    this.drawBackground();

    const ctx = this.context;
    const centerX = this.radius;
    const centerY = this.radius;
    const normalizedRadius = this.radius - 10;
    const startAngle = -0.5 * Math.PI; // Start at the top of the circle
    const endAngle = startAngle + (2 * Math.PI * progressValue) / 100;

    // Draw the progress arc
    ctx.beginPath();
    ctx.arc(centerX, centerY, normalizedRadius, startAngle, endAngle);
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 10;
    ctx.stroke();

    // Draw the progress text
    ctx.font = `${this.getFontSize()}px Orbitron`;
    ctx.fillStyle = this.getTextColor();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${Math.round(progressValue)}%`, centerX, centerY);
  }

  /**
   * Determines the stroke color for the background circle based on the current theme.
   *
   * @returns The background stroke color as a string.
   */
  private getBackgroundStrokeColor(): string {
    return this.theme === 'light'
      ? 'rgba(0, 0, 0, 0.1)'
      : 'rgba(255, 255, 255, 0.2)';
  }

  /**
   * Determines the text color based on the current theme.
   *
   * @returns The text color as a string.
   */
  private getTextColor(): string {
    return this.theme === 'light' ? '#000' : '#fff';
  }

  /**
   * Calculates the font size for the progress text based on the current size category.
   *
   * @returns The font size in pixels.
   */
  private getFontSize(): number {
    switch (this.size) {
      case 'small':
        return this.radius * 0.3;
      case 'medium':
        return this.radius * 0.4;
      case 'large':
        return this.radius * 0.5;
      default:
        return this.radius * 0.6;
    }
  }
}
