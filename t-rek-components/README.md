# T-Rek Components

## Requirements

 - Install Node 20.11.1
 - TypeScript 5.4.4
 - Clone repository
 - Run: npm i
 - Start : npm run start
 - Build : npm run start
 - Test: npm run test
 - Lint: npm run lint
 - Prettier: npm run prettier
 - Storybook: npm run storybook

# Component library

Added components:
 - t-button
 - t-select
 - t-column
 - t-grid
 - t-progress

These Components are styled by light / dark theme. Additionally, they allow a change in size, especially button and select components (small / medium / large).

These library components ar within src/app/components folder

The presentation layer contains 

 - t-header
 - t-rek-components
 - t-theme-toggle
 - t-typewriter

The presentation layer is concentrated in the presentation folder.
These components are for presentation purposes only and they haven't been extended theme wise.

Unit tests have been added for TGridComponent, TSelectComponent, TProgressService and the two utilities for sorting and pagination.

All animations leverage requestAnimationFrame() for proper timing.

TGridComponent and TProgressComponent leverage a mix of observables and signals to obtain fine grained reactivity.
As observables can be unsubscribed via async pipe in the DOM, it was easier for TGridComponent, to chreate a mechanism of automatic cleanup.
It was also easier to leverage an automatic change detection trigger without manual intervention, due to signal reactivity and reference change.
For TProgressComponent it was done manually.

Storybook unfortunately doesn't work properly at the current time and it need fixing for data completion.

Components have been enhanced with some accessibility and responsive features.