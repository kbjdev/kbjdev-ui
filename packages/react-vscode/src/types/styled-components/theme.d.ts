import 'styled-components';
import type { IVSCodeTheme } from '../color';

type Colors = IVSCodeTheme['colors'];

declare module 'styled-components' {
  export interface DefaultTheme extends Colors {}
}
