import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChildren,
  OnDestroy,
} from '@angular/core';

@Component({
  selector: 't-typewriter',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './t-typewriter.component.html',
  styleUrls: ['./t-typewriter.component.scss'],
})
export class TTypewriterComponent implements OnInit, OnDestroy {
  paragraphs: string[] = [
    'T-Rek Components is a component library built on top of Angular that is flexible for content use and theming.',
    'For now we are only able to show T-Rek Grid, our Grid built with Signals and Observables',
    'and our T-Rek Progress component, built on top of Signals, Observables and Canvas.',
  ];

  displayedParagraphs: string[] = [];
  typingSpeed = 20;
  currentParagraphIndex = 0;
  typingId!: number;
  private isDestroyed = false;
  @ViewChildren('typewriter') typewriters!: QueryList<ElementRef>;

  ngOnInit() {
    this.startTyping();
  }

  startTyping() {
    this.typeParagraph(this.currentParagraphIndex);
  }

  typeParagraph(paragraphIndex: number) {
    if (paragraphIndex >= this.paragraphs.length) return;

    let currentIndex = 0;
    this.displayedParagraphs.push('');
    let lastTime = 0;

    const typeLetter = (timestamp: number) => {
      if (!lastTime) lastTime = timestamp;
      const delta = timestamp - lastTime;

      if (delta >= this.typingSpeed) {
        this.displayedParagraphs[paragraphIndex] += this.paragraphs[paragraphIndex][currentIndex];
        currentIndex++;
        lastTime = timestamp;
      }

      if (currentIndex < this.paragraphs[paragraphIndex].length) {
        if (!this.isDestroyed) {
          this.typingId = requestAnimationFrame(typeLetter);
        }
      } else {
        this.currentParagraphIndex++;
        this.typeParagraph(this.currentParagraphIndex);
      }
    };

    this.typingId = requestAnimationFrame(typeLetter);
  }

  ngOnDestroy() {
    this.isDestroyed = true;
    cancelAnimationFrame(this.typingId);
  }
}
