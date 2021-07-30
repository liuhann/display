import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';

const customViewports = {
  Narrow200: {
    name: 'Narrow200',
    styles: {
      width: '200px',
      height: '600px'
    },
  },
  Narrow240: {
    name: 'Narrow200',
    styles: {
      width: '240px',
      height: '600px'
    },
  },
};

export const parameters = {
  viewport: {
    viewports: {
       ...INITIAL_VIEWPORTS,
      ...customViewports,
    },
  },
  actions: { argTypesRegex: "^on[A-Z].*" },
  // layout: 'centered',
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    }
  }
}