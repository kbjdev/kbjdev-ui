/* eslint-disable react-refresh/only-export-components */
import React, { FC, PropsWithChildren, useMemo, useState } from 'react';
import { ThemeProvider } from 'styled-components';
import GlobalStyles from './GlobalStyles';
import ColorRegistry from '../../utils/color/colorRegistry';

import type { IVSCodeTheme } from '../../types/color';

interface IReactVSCodeProviderProps {
  theme?: IVSCodeTheme;
}

export const defaultDarkTheme: IVSCodeTheme['colors'] = {
  'checkbox.border': '#6B6B6B',
  'editor.background': '#1E1E1E',
  'editor.foreground': '#D4D4D4',
  'editor.inactiveSelectionBackground': '#3A3D41',
  'editorIndentGuide.background1': '#404040',
  'editorIndentGuide.activeBackground1': '#707070',
  'editor.selectionHighlightBackground': '#ADD6FF26',
  'list.dropBackground': '#383B3D',
  'activityBarBadge.background': '#007ACC',
  'sideBarTitle.foreground': '#BBBBBB',
  'input.placeholderForeground': '#A6A6A6',
  'menu.background': '#252526',
  'menu.foreground': '#CCCCCC',
  'menu.separatorBackground': '#454545',
  'menu.border': '#454545',
  'statusBarItem.remoteForeground': '#FFF',
  'statusBarItem.remoteBackground': '#16825D',
  'ports.iconRunningProcessForeground': '#369432',
  'sideBarSectionHeader.background': '#0000',
  'sideBarSectionHeader.border': '#ccc3',
  'tab.selectedBackground': '#222222',
  'tab.selectedForeground': '#ffffffa0',
  'tab.lastPinnedBorder': '#ccc3',
  'list.activeSelectionIconForeground': '#FFF',
  'terminal.inactiveSelectionBackground': '#3A3D41',
  'widget.border': '#303031',
  'actionBar.toggledBackground': '#383a49',
};

export const defaultLightTheme: IVSCodeTheme['colors'] = {
  'checkbox.border': '#919191',
  'editor.background': '#FFFFFF',
  'editor.foreground': '#000000',
  'editor.inactiveSelectionBackground': '#E5EBF1',
  'editorIndentGuide.background1': '#D3D3D3',
  'editorIndentGuide.activeBackground1': '#939393',
  'editor.selectionHighlightBackground': '#ADD6FF80',
  'editorSuggestWidget.background': '#F3F3F3',
  'activityBarBadge.background': '#007ACC',
  'sideBarTitle.foreground': '#6F6F6F',
  'list.hoverBackground': '#E8E8E8',
  'menu.border': '#D4D4D4',
  'input.placeholderForeground': '#767676',
  'searchEditor.textInputBorder': '#CECECE',
  'settings.textInputBorder': '#CECECE',
  'settings.numberInputBorder': '#CECECE',
  'statusBarItem.remoteForeground': '#FFF',
  'statusBarItem.remoteBackground': '#16825D',
  'ports.iconRunningProcessForeground': '#369432',
  'sideBarSectionHeader.background': '#0000',
  'sideBarSectionHeader.border': '#61616130',
  'tab.selectedForeground': '#333333b3',
  'tab.selectedBackground': '#ffffffa5',
  'tab.lastPinnedBorder': '#61616130',
  'notebook.cellBorderColor': '#E8E8E8',
  'notebook.selectedCellBackground': '#c8ddf150',
  'statusBarItem.errorBackground': '#c72e0f',
  'list.activeSelectionIconForeground': '#FFF',
  'list.focusAndSelectionOutline': '#90C2F9',
  'terminal.inactiveSelectionBackground': '#E5EBF1',
  'widget.border': '#d4d4d4',
  'actionBar.toggledBackground': '#dddddd',
  'diffEditor.unchangedRegionBackground': '#f8f8f8',
};

const ReactVSCodeProvider: FC<PropsWithChildren<IReactVSCodeProviderProps>> = ({
  theme,
  children,
}) => {
  const [registry] = useState(() => new ColorRegistry());

  const colors = useMemo(() => {
    const themeColors = theme?.colors ?? defaultDarkTheme;
    const themeType = theme?.type ?? 'dark';
    return registry.getThemeColor(themeColors, themeType);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme]);

  return (
    <ThemeProvider theme={colors}>
      <GlobalStyles />
      {children}
    </ThemeProvider>
  );
};

export default ReactVSCodeProvider;
