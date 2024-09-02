import {
  defaultDarkTheme,
  defaultLightTheme,
  ReactVSCodeProvider,
  VSCodeTheme,
} from '@kbjdev/react-vscode';
import { withThemeFromJSXProvider } from '@storybook/addon-themes';
import { Preview } from '@storybook/react';
import { createGlobalStyle } from 'styled-components';

const darkTheme: VSCodeTheme = {
  name: 'Dark (Visual Studio)',
  type: 'dark',
  colors: defaultDarkTheme,
};

const lightTheme: VSCodeTheme = {
  name: 'Light (Visual Studio)',
  type: 'light',
  colors: defaultLightTheme,
};

const GlobalStyles = createGlobalStyle`
  * {
    font-family: -apple-system, BlinkMacSystemFont, sans-serif;

  }

  body {
    background-color: ${({ theme }) => theme['sideBar.background']};
  }
`;

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    withThemeFromJSXProvider({
      themes: { [darkTheme.name]: darkTheme, [lightTheme.name]: lightTheme },
      defaultTheme: darkTheme.name,
      GlobalStyles,
      Provider: ReactVSCodeProvider,
    }),
  ],
};

export default preview;
