import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';

@Component({
  selector: 't-typewriter',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './t-typewriter.component.html',
  styleUrl: './t-typewriter.component.scss',
})
export class TTypewriterComponent implements OnInit {
  paragraphs: string[] = [
    'T-Rek Components is a component library built on top of Angular that is flexible for content use and theming.',
    'For now we are only able to show T-Rek Grid, our Grid built with Signals and Observables.',
    'and our T-Rek Progress component, built on top of SVG.',
  ];

  displayedParagraphs: string[] = [];
  typingSpeed = 50;
  currentParagraphIndex = 0;
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

    const typingInterval = setInterval(() => {
      this.displayedParagraphs[paragraphIndex] +=
        this.paragraphs[paragraphIndex][currentIndex];
      currentIndex++;

      if (currentIndex === this.paragraphs[paragraphIndex].length) {
        clearInterval(typingInterval);
        this.currentParagraphIndex++;
        this.typeParagraph(this.currentParagraphIndex);
      }
    }, this.typingSpeed);
  }
}
