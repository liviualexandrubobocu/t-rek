import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Size, Theme } from '../../types/theme';

@Injectable()
export class TProgressService {
  private context!: CanvasRenderingContext2D;
  private canvas!: HTMLCanvasElement;
  private radius!: number;
  private color!: string;
  private theme!: Theme;
  private size!: Size;
  private duration: number = 3500;
  private animationId!: number;

  initialize(
    canvas: HTMLCanvasElement,
    radius: number,
    color: string,
    theme: Theme,
    size: Size,
  ): void {
    this.canvas = canvas;
    this.context = canvas.getContext('2d')!;
    this.radius = radius;
    this.color = color;
    this.theme = theme;
    this.size = size;
    this.setCanvasSize();
    this.drawBackground();
  }

  setAnimationDuration(duration: number): void {
    this.duration = duration;
  }

  drawBackground(): void {
    const ctx = this.context;
    const centerX = this.radius;
    const centerY = this.radius;

    ctx.clearRect(0, 0, this.radius * 2, this.radius * 2);

    ctx.beginPath();
    ctx.arc(centerX, centerY, this.radius - 10, 0, 2 * Math.PI);
    ctx.strokeStyle = this.getBackgroundStrokeColor();
    ctx.lineWidth = 10;
    ctx.stroke();
  }

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

      return () => {
        cancelAnimationFrame(this.animationId);
      };
    });
  }

  destroy(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }

  private setCanvasSize(): void {
    this.canvas.width = this.radius * 2;
    this.canvas.height = this.radius * 2;
  }

  private drawProgressCircle(progressValue: number): void {
    this.drawBackground();

    const ctx = this.context;
    const centerX = this.radius;
    const centerY = this.radius;
    const normalizedRadius = this.radius - 10;
    const startAngle = -0.5 * Math.PI;
    const endAngle = startAngle + (2 * Math.PI * progressValue) / 100;

    ctx.beginPath();
    ctx.arc(centerX, centerY, normalizedRadius, startAngle, endAngle);
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 10;
    ctx.stroke();

    ctx.font = `${this.getFontSize()}px Orbitron`;
    ctx.fillStyle = this.getTextColor();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${Math.round(progressValue)}%`, centerX, centerY);
  }

  private getBackgroundStrokeColor(): string {
    return this.theme === 'light'
      ? 'rgba(0, 0, 0, 0.1)'
      : 'rgba(255, 255, 255, 0.2)';
  }

  private getTextColor(): string {
    return this.theme === 'light' ? '#000' : '#fff';
  }

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
