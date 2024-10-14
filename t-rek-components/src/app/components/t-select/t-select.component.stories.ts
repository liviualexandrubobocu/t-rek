import { CommonModule } from '@angular/common';
import {
  TranslocoService,
  TRANSLOCO_FALLBACK_STRATEGY,
  TRANSLOCO_INTERCEPTOR,
  TRANSLOCO_MISSING_HANDLER,
  TRANSLOCO_TRANSPILER,
} from '@jsverse/transloco';
import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { fn } from '@storybook/test';

import { TSelectComponent } from './t-select.component';

export const ActionsData = {
  onClick: fn(),
};

const meta: Meta<TSelectComponent> = {
  title: 'Components/TSelect',
  component: TSelectComponent,
  excludeStories: /.*Data$/,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      providers: [
        TranslocoService,
        {
          provide: TRANSLOCO_TRANSPILER,
          useValue: {
            transpile(value: string) {
              return value;
            },
          },
        },
        {
          provide: TRANSLOCO_MISSING_HANDLER,
          useValue: {
            transpile(value: string) {
              return value;
            },
          },
        },
        {
          provide: TRANSLOCO_INTERCEPTOR,
          useValue: {
            transpile(value: string) {
              return value;
            },
          },
        },
        {
          provide: TRANSLOCO_FALLBACK_STRATEGY,
          useValue: {
            transpile(value: string) {
              return value;
            },
          },
        },
      ],
      imports: [CommonModule, TSelectComponent],
    }),
  ],
};

export default meta;
type Story = StoryObj<TSelectComponent>;
const pageSizes = [5, 10, 25, 50, 100];
const pageSizeOptions = pageSizes.map((size: number) => ({
  value: size,
  label: size.toString(),
}));

export const Default: Story = {
  args: {
    theme: 'light',
    size: 'medium',
    disabled: false,
    options: pageSizeOptions,
  },
  render: () => ({
    template: `<t-select
    id="pageSizeSelect"
    [options]="pageSizeOptions"
    [value]="5"
    (change)="onPageSizeChange($event)"
    [theme]="'light'"
    [size]="'medium'"
  ></t-select>`,
  }),
};

export const DarkTheme: Story = {
  args: {
    ...Default.args,
    theme: 'dark',
    size: 'medium',
    options: pageSizeOptions,
  },
  render: () => {
    return {
      template: `<t-select
        id="pageSizeSelect"
        [options]="pageSizeOptions"
        [value]="5"
        (change)="onPageSizeChange($event)"
        [theme]="'dark'"
        [size]="'medium'"
      ></t-select>`,
    };
  },
};

export const SmallSize: Story = {
  args: {
    ...Default.args,
    size: 'small',
    theme: 'light',
    options: pageSizeOptions,
  },
  render: () => ({
    template: `<t-select
    id="pageSizeSelect"
    [options]="pageSizeOptions"
    [value]="5"
    (change)="onPageSizeChange($event)"
    [theme]="'light'"
    [size]="'small'"
  ></t-select>`,
  }),
};

export const LargeSize: Story = {
  args: {
    ...Default.args,
    size: 'large',
    theme: 'light',
    options: pageSizeOptions,
  },
  render: () => ({
    template: `<t-select
    id="pageSizeSelect"
    [options]="pageSizeOptions"
    [value]="5"
    (change)="onPageSizeChange($event)"
    [theme]="'light'"
    [size]="'large'"
  ></t-select>`,
  }),
};
