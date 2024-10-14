import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { TSelectComponent } from './t-select.component';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { TranslocoService, TRANSLOCO_TRANSPILER } from '@jsverse/transloco';
import { of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Size, Theme } from '../../types/theme';
import { FormsModule } from '@angular/forms';
import { SelectOption } from '../../types/options';

const MockTranslocoService = {
  selectTranslate: (key: string) => of(key),
};

@Component({
  selector: 't-host',
  template: `
    <t-select
      [options]="options"
      [theme]="theme"
      [size]="size"
      [disabled]="disabled"
      [value]="value"
      (selectionChange)="onSelectionChange($event)"
    ></t-select>
  `,
})
class TestHostComponent {
  options: SelectOption[] = [];
  theme: Theme = 'light';
  size: Size = 'medium';
  disabled = false;
  value: unknown = null;

  onSelectionChange(event: unknown) {
    console.log(event);
  }
}

describe('TSelectComponent', () => {
  let component: TSelectComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let testHostComponent: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestHostComponent],
      imports: [CommonModule, FormsModule, TSelectComponent],
      providers: [
        { provide: TranslocoService, useValue: MockTranslocoService },
        {
          provide: TRANSLOCO_TRANSPILER,
          useValue: {
            transpile(value: string) {
              return value;
            },
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestHostComponent);
    testHostComponent = fixture.componentInstance;
    fixture.detectChanges();

    const selectDebugElement = fixture.debugElement.query(
      By.directive(TSelectComponent),
    );
    component = selectDebugElement.componentInstance;
  });

  it('should create the select component', () => {
    expect(component).toBeTruthy();
  });

  it('should render the correct number of options', () => {
    testHostComponent.options = [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' },
      { value: 'option3', label: 'Option 3' },
    ];
    fixture.detectChanges();

    const optionElements = fixture.debugElement.queryAll(By.css('option'));
    expect(optionElements.length).toBe(3);
    expect(optionElements[0].nativeElement.value).toContain('option1');
    expect(optionElements[0].nativeElement.textContent).toContain('Option 1');
  });

  it('should emit selectionChange event when an option is selected', fakeAsync(() => {
    spyOn(testHostComponent, 'onSelectionChange').and.callThrough();

    testHostComponent.options = [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' },
    ];
    fixture.detectChanges();
    tick();

    const selectElement = fixture.debugElement.query(
      By.css('select'),
    ).nativeElement;

    selectElement.value = 'option2';
    selectElement.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    tick();

    expect(testHostComponent.onSelectionChange).toHaveBeenCalledWith('option2');
  }));

  it('should not click the disabled input', () => {
    testHostComponent.disabled = true;
    fixture.detectChanges();

    const selectElement = fixture.debugElement.query(
      By.css('select'),
    ).nativeElement;
    expect(selectElement.disabled).toBeTrue();
  });

  it('should apply the correct theme class', () => {
    testHostComponent.theme = 'dark';
    fixture.detectChanges();

    const selectElement = fixture.debugElement.query(
      By.css('select'),
    ).nativeElement;
    expect(selectElement.classList).toContain('dark');
    expect(selectElement.classList).not.toContain('light');
  });

  it('should apply the correct size class', () => {
    testHostComponent.size = 'large';
    fixture.detectChanges();

    const selectElement = fixture.debugElement.query(
      By.css('select'),
    ).nativeElement;
    expect(selectElement.classList).toContain('large');
    expect(selectElement.classList).not.toContain('medium');
  });

  it('should display translated page size text', () => {
    const translatedKey = 'lib.grid.pageSizeText';
    component.pageSizeText$.subscribe((text) => {
      expect(text).toBe(translatedKey);
    });
  });

  it('should set the correct value in the select element', fakeAsync(() => {
    testHostComponent.value = 'option2';
    testHostComponent.options = [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' },
    ];
    fixture.detectChanges();
    tick();

    const selectElement = fixture.debugElement.query(
      By.css('select'),
    ).nativeElement;
    expect(selectElement.value).toBe('option2');
  }));

  it('should handle value changes programmatically', fakeAsync(() => {
    testHostComponent.options = [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' },
      { value: 'option3', label: 'Option 3' },
    ];
    testHostComponent.value = 'option3';
    fixture.detectChanges();
    tick();

    const selectElement = fixture.debugElement.query(
      By.css('select'),
    ).nativeElement;
    expect(selectElement.value).toBe('option3');

    const selectedOption = selectElement.options[selectElement.selectedIndex];
    expect(selectedOption.value).toBe('option3');
    expect(selectedOption.textContent.trim()).toBe('Option 3');
  }));
});
