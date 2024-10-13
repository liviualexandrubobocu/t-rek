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
};

export const DarkTheme: Story = {
  args: {
    ...Default.args,
    theme: 'dark',
  },
};

export const Disabled: Story = {
  args: {
    ...Default.args,
    disabled: true,
  },
};

export const SmallSize: Story = {
  args: {
    ...Default.args,
    size: 'small',
  },
};

export const LargeSize: Story = {
  args: {
    ...Default.args,
    size: 'large',
  },
};
