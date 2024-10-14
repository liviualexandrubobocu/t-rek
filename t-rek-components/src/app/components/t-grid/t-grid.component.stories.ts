import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { fn } from '@storybook/test';
import { TGridComponent } from './t-grid.component';
import { TColumnComponent } from '../t-column/t-column.component';
import { CommonModule } from '@angular/common';
import { TButtonComponent } from '../t-button/t-button.component';
import { TSelectComponent } from '../t-select/t-select.component';
import { TranslocoService, TRANSLOCO_TRANSPILER, TRANSLOCO_MISSING_HANDLER, TRANSLOCO_INTERCEPTOR, TRANSLOCO_FALLBACK_STRATEGY } from '@jsverse/transloco';

export const ActionsData = {
  sortChange: fn(),
  paginationChange: fn(),
};

const meta: Meta<TGridComponent<unknown>> = {
  title: 'Components/TGrid',
  component: TGridComponent,
  excludeStories: /.*Data$/,
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
      imports: [CommonModule, TButtonComponent, TSelectComponent, TColumnComponent],
    }),
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<TGridComponent<unknown>>;

const Template: Story = {
  render: (args) => ({
    props: {
      ...args,
      ...ActionsData,
    },
    template: `
      <t-grid
        [data]="data"
        [sortable]="sortable"
        [pageSize]="pageSize"
        (sortChange)="sortChange($event)"
        (paginationChange)="paginationChange($event)"
      >
        <t-column property="id" header="ID" [sortable]="true"></t-column>
        <t-column property="name" header="Name" [sortable]="true"></t-column>
        <t-column property="value" header="Value" [sortable]="false"></t-column>
      </t-grid>
    `,
  }),
};

export const Default: Story = {
  ...Template,
  args: {
    data: [
      { id: 1, name: 'Item 1', value: 10 },
      { id: 2, name: 'Item 2', value: 20 },
      { id: 3, name: 'Item 3', value: 30 },
    ],
    sortable: true,
    pageSize: null,
  },
};

export const WithPagination: Story = {
  ...Template,
  args: {
    ...Default.args,
    pageSize: 2,
  },
};

export const NonSortable: Story = {
  ...Template,
  args: {
    ...Default.args,
    sortable: false,
  },
};

export const LargeDataSet: Story = {
  ...Template,
  args: {
    data: Array.from({ length: 50 }, (_, i) => ({
      id: i + 1,
      name: `Item ${i + 1}`,
      value: (i + 1) * 10,
    })),
    sortable: true,
    pageSize: 10,
  },
};
