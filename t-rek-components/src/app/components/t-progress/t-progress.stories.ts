import type { Meta, StoryObj } from '@storybook/angular';
import { fn } from '@storybook/test';

import { TProgressComponent } from './t-progress.component';

export const ActionsData = {
  complete: fn(),
};

const meta: Meta<TProgressComponent> = {
  title: 'Components/TProgress',
  component: TProgressComponent,
  excludeStories: /.*Data$/,
  tags: ['autodocs'],
  args: {
    ...ActionsData,
  },
};

export default meta;
type Story = StoryObj<TProgressComponent>;

export const Default: Story = {
  args: {
    progress: 0,
    radius: 75,
    theme: 'light',
    size: 'medium',
    color: '#00BCD4',
  },
};

export const Progress50: Story = {
  args: {
    ...Default.args,
    progress: 50,
  },
};

export const Complete: Story = {
  args: {
    ...Default.args,
    progress: 100,
  },
};
