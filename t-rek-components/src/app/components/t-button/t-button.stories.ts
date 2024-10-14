import type { Meta, StoryObj } from '@storybook/angular';
import { fn } from '@storybook/test';

import { TButtonComponent } from './t-button.component';

export const ActionsData = {
  onClick: fn(),
};

const meta: Meta<TButtonComponent> = {
  title: 'Components/TButton',
  component: TButtonComponent,
  excludeStories: /.*Data$/,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<TButtonComponent>;

export const Default: Story = {
  args: {
    theme: 'light',
    size: 'medium',
    disabled: false,
  },
  render: (args: any) => ({    
    template: `<t-button
      [theme]="'light'"
      [size]="'medium'"
      [disabled]="false"
      [ariaLabel]="'button-label'"
    >
      Previous
    </t-button>`
  })
};

export const DarkTheme: Story = {
  args: {
    ...Default.args,
    theme: 'dark',
    size: 'medium'
  },
  render: (args: any) => ({    
    template: `<t-button
      [theme]="'dark'"
      [size]="'medium'"
      [disabled]="false"
      [ariaLabel]="'button-label'"
    >
      Previous
    </t-button>`
  })
};

export const Disabled: Story = {
  args: {
    ...Default.args,
    disabled: true,
    theme: 'light',
    size: 'medium'
  },
  render: (args: any) => ({    
    template: `<t-button
      [theme]="'light'"
      [size]="'medium'"
      [disabled]="true"
      [ariaLabel]="'button-label'"
    >
      Previous
    </t-button>`
  })
};

export const SmallSize: Story = {
  args: {
    ...Default.args,
    size: 'small',
    theme: 'light',
  },
  render: (args: any) => ({    
    template: `<t-button
      [theme]="'light'"
      [size]="'small'"
      [disabled]="true"
      [ariaLabel]="'button-label'"
    >
      Previous
    </t-button>`
  })
};

export const LargeSize: Story = {
  args: {
    ...Default.args,
    size: 'large',
    theme: 'light',
  },
  render: (args: any) => ({    
    template: `<t-button
      [theme]="'light'"
      [size]="'large'"
      [disabled]="true"
      [ariaLabel]="'button-label'"
    >
      Previous
    </t-button>`
  })
};
