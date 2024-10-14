import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChildren,
  OnDestroy,
} from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { Observable } from 'rxjs';

/**
 * TTypewriterComponent creates a typewriter effect for displaying paragraphs of text.
 * It sequentially types out each paragraph with a configurable typing speed.
 * Additionally, it manages translated alternative text for associated images to enhance accessibility.
 *
 * @example
 * ```html
 * <t-typewriter></t-typewriter>
 * ```
 */
@Component({
  selector: 't-typewriter',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './t-typewriter.component.html',
  styleUrls: ['./t-typewriter.component.scss'],
})
export class TTypewriterComponent implements OnInit, OnDestroy {
  /**
   * An array of paragraphs to be displayed with the typewriter effect.
   * Each string in the array represents a separate paragraph.
   *
   * @type {string[]}
   */
  paragraphs: string[] = [
    'T-Rek Components is a component library built on top of Angular that is flexible for content use and theming.',
    'For now we are only able to show T-Rek Grid, our Grid built with Signals and Observables',
    'and our T-Rek Progress component, built on top of Signals, Observables and Canvas.',
  ];

  /**
   * An array that holds the currently displayed text for each paragraph.
   * As the typewriter effect progresses, corresponding entries are updated with typed characters.
   *
   * @type {string[]}
   * @default []
   */
  displayedParagraphs: string[] = [];

  /**
   * The speed at which each character is typed, measured in milliseconds.
   * Lower values result in faster typing.
   *
   * @type {number}
   * @default 20
   */
  typingSpeed = 20;

  /**
   * The index of the currently active paragraph being typed.
   *
   * @type {number}
   * @default 0
   */
  currentParagraphIndex = 0;

  /**
   * The ID returned by `requestAnimationFrame`, used to cancel the typing animation if necessary.
   *
   * @type {number | undefined}
   */
  typingId!: number;

  /**
   * A flag indicating whether the component has been destroyed.
   * Used to prevent further animations after the component is no longer in use.
   *
   * @type {boolean}
   * @default false
   */
  private isDestroyed = false;

  /**
   * An observable that holds the translated alternative text for associated images.
   * Utilizes the TranslocoService for internationalization.
   *
   * @type {Observable<string>}
   */
  imageAltText$!: Observable<string>;

  /**
   * A QueryList of ElementRef instances referencing elements with the `#typewriter` template reference variable.
   * Allows direct manipulation of the DOM elements if needed.
   *
   * @type {QueryList<ElementRef>}
   */
  @ViewChildren('typewriter') typewriters!: QueryList<ElementRef>;

  /**
   * Constructs an instance of TTypewriterComponent.
   * Injects TranslocoService for handling translations.
   *
   * @param {TranslocoService} translocoService - Service for handling internationalization and translations.
   */
  constructor(private translocoService: TranslocoService) {}

  /**
   * Starts the typing animation and initializes translated alternative text.
   */
  ngOnInit(): void {
    this.startTyping();
    this.imageAltText$ = this.translocoService.selectTranslate(
      'presentation.imageAltText',
    );
  }

  /**
   * Initiates the typing animation by starting with the first paragraph.
   */
  startTyping(): void {
    this.typeParagraph(this.currentParagraphIndex);
  }

  /**
   * Types out the specified paragraph character by character using `requestAnimationFrame`.
   * Once a paragraph is fully typed, it recursively calls itself to type the next paragraph.
   *
   * @param {number} paragraphIndex - The index of the paragraph to type.
   */
  typeParagraph(paragraphIndex: number): void {
    if (paragraphIndex >= this.paragraphs.length) return;

    let currentIndex = 0;
    this.displayedParagraphs.push('');
    let lastTime = 0;

    /**
     * The recursive function that types each character based on the typing speed.
     *
     * @param {number} timestamp - The current timestamp provided by `requestAnimationFrame`.
     */
    const typeLetter = (timestamp: number) => {
      if (!lastTime) lastTime = timestamp;
      const delta = timestamp - lastTime;

      if (delta >= this.typingSpeed) {
        this.displayedParagraphs[paragraphIndex] +=
          this.paragraphs[paragraphIndex][currentIndex];
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

  /**
   * Cleans up the typing animation to prevent memory leaks.
   */
  ngOnDestroy(): void {
    this.isDestroyed = true;
    cancelAnimationFrame(this.typingId);
  }
}
