/* eslint-disable @typescript-eslint/no-unused-vars */
import { Color, RGBA } from '../vs/color';
import { IVSCodeTheme, VSCodeThemeColorType } from '../../types/color';

type ColorIdentifier = keyof IVSCodeTheme['colors'];

type ColorValue = Color | string | ColorIdentifier | ColorTransform;

const enum ColorTransformType {
  Darken,
  Lighten,
  Transparent,
  Opaque,
  OneOf,
  LessProminent,
  IfDefinedThenElse,
}

type ColorTransform =
  | { op: ColorTransformType.Darken; value: ColorValue; factor: number }
  | { op: ColorTransformType.Lighten; value: ColorValue; factor: number }
  | { op: ColorTransformType.Transparent; value: ColorValue; factor: number }
  | { op: ColorTransformType.Opaque; value: ColorValue; background: ColorValue }
  | { op: ColorTransformType.OneOf; values: readonly ColorValue[] }
  | {
      op: ColorTransformType.LessProminent;
      value: ColorValue;
      background: ColorValue;
      factor: number;
      transparency: number;
    }
  | {
      op: ColorTransformType.IfDefinedThenElse;
      if: ColorIdentifier;
      then: ColorValue;
      else: ColorValue;
    };

interface IColorDefaults {
  light: ColorValue | null;
  dark: ColorValue | null;
  hcDark: ColorValue | null;
  hcLight: ColorValue | null;
}

function isColorIdentifier(colorValue: ColorValue): colorValue is ColorIdentifier {
  return typeof colorValue === 'string' && !colorValue.startsWith('#');
}

function isColorDefaults(
  colorValue: ColorValue | IColorDefaults | null
): colorValue is IColorDefaults {
  return !!colorValue && typeof colorValue === 'object' && 'light' in colorValue;
}

function darken(colorValue: ColorValue, factor: number): ColorTransform {
  return { op: ColorTransformType.Darken, value: colorValue, factor };
}

function lighten(colorValue: ColorValue, factor: number): ColorTransform {
  return { op: ColorTransformType.Lighten, value: colorValue, factor };
}

function transparent(colorValue: ColorValue, factor: number): ColorTransform {
  return { op: ColorTransformType.Transparent, value: colorValue, factor };
}

function opaque(colorValue: ColorValue, background: ColorValue): ColorTransform {
  return { op: ColorTransformType.Opaque, value: colorValue, background };
}

function oneOf(...colorValues: ColorValue[]): ColorTransform {
  return { op: ColorTransformType.OneOf, values: colorValues };
}

function ifDefinedThenElse(
  ifArg: ColorIdentifier,
  thenArg: ColorValue,
  elseArg: ColorValue
): ColorTransform {
  return { op: ColorTransformType.IfDefinedThenElse, if: ifArg, then: thenArg, else: elseArg };
}

function lessProminent(
  colorValue: ColorValue,
  backgroundColorValue: ColorValue,
  factor: number,
  transparency: number
): ColorTransform {
  return {
    op: ColorTransformType.LessProminent,
    value: colorValue,
    background: backgroundColorValue,
    factor,
    transparency,
  };
}

class ColorRegistry {
  private _defaults: Map<ColorIdentifier, IColorDefaults | ColorValue | null> = new Map();

  public constructor() {
    // <-- https://github.com/microsoft/vscode/tree/1.91.1/src/vs/platform/theme/common/colors/baseColors.ts -->

    const foreground = this._registerColor('foreground', {
      dark: '#CCCCCC',
      light: '#616161',
      hcDark: '#FFFFFF',
      hcLight: '#292929',
    });
    const disabledForeground = this._registerColor('disabledForeground', {
      dark: '#CCCCCC80',
      light: '#61616180',
      hcDark: '#A5A5A5',
      hcLight: '#7F7F7F',
    });
    const errorForeground = this._registerColor('errorForeground', {
      dark: '#F48771',
      light: '#A1260D',
      hcDark: '#F48771',
      hcLight: '#B5200D',
    });
    const descriptionForeground = this._registerColor('descriptionForeground', {
      light: '#717171',
      dark: transparent(foreground, 0.7),
      hcDark: transparent(foreground, 0.7),
      hcLight: transparent(foreground, 0.7),
    });
    const iconForeground = this._registerColor('icon.foreground', {
      dark: '#C5C5C5',
      light: '#424242',
      hcDark: '#FFFFFF',
      hcLight: '#292929',
    });
    const focusBorder = this._registerColor('focusBorder', {
      dark: '#007FD4',
      light: '#0090F1',
      hcDark: '#F38518',
      hcLight: '#006BBD',
    });
    const contrastBorder = this._registerColor('contrastBorder', {
      light: null,
      dark: null,
      hcDark: '#6FC3DF',
      hcLight: '#0F4A85',
    });
    const activeContrastBorder = this._registerColor('contrastActiveBorder', {
      light: null,
      dark: null,
      hcDark: focusBorder,
      hcLight: focusBorder,
    });
    const selectionBackground = this._registerColor('selection.background', null);
    const textLinkForeground = this._registerColor('textLink.foreground', {
      light: '#006AB1',
      dark: '#3794FF',
      hcDark: '#21A6FF',
      hcLight: '#0F4A85',
    });
    const textLinkActiveForeground = this._registerColor('textLink.activeForeground', {
      light: '#006AB1',
      dark: '#3794FF',
      hcDark: '#21A6FF',
      hcLight: '#0F4A85',
    });
    const textSeparatorForeground = this._registerColor('textSeparator.foreground', {
      light: '#0000002e',
      dark: '#ffffff2e',
      hcDark: Color.black,
      hcLight: '#292929',
    });
    const textPreformatForeground = this._registerColor('textPreformat.foreground', {
      light: '#A31515',
      dark: '#D7BA7D',
      hcDark: '#000000',
      hcLight: '#FFFFFF',
    });
    const textPreformatBackground = this._registerColor('textPreformat.background', {
      light: '#0000001A',
      dark: '#FFFFFF1A',
      hcDark: '#FFFFFF',
      hcLight: '#09345f',
    });
    const textBlockQuoteBackground = this._registerColor('textBlockQuote.background', {
      light: '#f2f2f2',
      dark: '#222222',
      hcDark: null,
      hcLight: '#F2F2F2',
    });
    const textBlockQuoteBorder = this._registerColor('textBlockQuote.border', {
      light: '#007acc80',
      dark: '#007acc80',
      hcDark: Color.white,
      hcLight: '#292929',
    });
    const textCodeBlockBackground = this._registerColor('textCodeBlock.background', {
      light: '#dcdcdc66',
      dark: '#0a0a0a66',
      hcDark: Color.black,
      hcLight: '#F2F2F2',
    });

    // <-- https://github.com/microsoft/vscode/tree/1.91.1/src/vs/platform/theme/common/colors/miscColors.ts -->

    // ----- sash
    const sashHoverBorder = this._registerColor('sash.hoverBorder', focusBorder);
    // ----- badge
    const badgeBackground = this._registerColor('badge.background', {
      dark: '#4D4D4D',
      light: '#C4C4C4',
      hcDark: Color.black,
      hcLight: '#0F4A85',
    });
    const badgeForeground = this._registerColor('badge.foreground', {
      dark: Color.white,
      light: '#333',
      hcDark: Color.white,
      hcLight: Color.white,
    });
    // ----- scrollbar
    const scrollbarShadow = this._registerColor('scrollbar.shadow', {
      dark: '#000000',
      light: '#DDDDDD',
      hcDark: null,
      hcLight: null,
    });
    const scrollbarSliderBackground = this._registerColor('scrollbarSlider.background', {
      dark: Color.fromHex('#797979').transparent(0.4),
      light: Color.fromHex('#646464').transparent(0.4),
      hcDark: transparent(contrastBorder, 0.6),
      hcLight: transparent(contrastBorder, 0.4),
    });
    const scrollbarSliderHoverBackground = this._registerColor('scrollbarSlider.hoverBackground', {
      dark: Color.fromHex('#646464').transparent(0.7),
      light: Color.fromHex('#646464').transparent(0.7),
      hcDark: transparent(contrastBorder, 0.8),
      hcLight: transparent(contrastBorder, 0.8),
    });
    const scrollbarSliderActiveBackground = this._registerColor(
      'scrollbarSlider.activeBackground',
      {
        dark: Color.fromHex('#BFBFBF').transparent(0.4),
        light: Color.fromHex('#000000').transparent(0.6),
        hcDark: contrastBorder,
        hcLight: contrastBorder,
      }
    );
    // ----- progress bar
    const progressBarBackground = this._registerColor('progressBar.background', {
      dark: Color.fromHex('#0E70C0'),
      light: Color.fromHex('#0E70C0'),
      hcDark: contrastBorder,
      hcLight: contrastBorder,
    });

    // <-- https://github.com/microsoft/vscode/tree/1.91.1/src/vs/platform/theme/common/colors/editorColors.ts -->

    // ----- editor
    const editorBackground = this._registerColor('editor.background', {
      light: '#ffffff',
      dark: '#1E1E1E',
      hcDark: Color.black,
      hcLight: Color.white,
    });
    const editorForeground = this._registerColor('editor.foreground', {
      light: '#333333',
      dark: '#BBBBBB',
      hcDark: Color.white,
      hcLight: foreground,
    });
    const editorStickyScrollBackground = this._registerColor(
      'editorStickyScroll.background',
      editorBackground
    );
    const editorStickyScrollHoverBackground = this._registerColor(
      'editorStickyScrollHover.background',
      {
        dark: '#2A2D2E',
        light: '#F0F0F0',
        hcDark: null,
        hcLight: Color.fromHex('#0F4A85').transparent(0.1),
      }
    );
    const editorStickyScrollBorder = this._registerColor('editorStickyScroll.border', {
      dark: null,
      light: null,
      hcDark: contrastBorder,
      hcLight: contrastBorder,
    });
    const editorStickyScrollShadow = this._registerColor(
      'editorStickyScroll.shadow',
      scrollbarShadow
    );
    const editorWidgetBackground = this._registerColor('editorWidget.background', {
      dark: '#252526',
      light: '#F3F3F3',
      hcDark: '#0C141F',
      hcLight: Color.white,
    });
    const editorWidgetForeground = this._registerColor('editorWidget.foreground', foreground);
    const editorWidgetBorder = this._registerColor('editorWidget.border', {
      dark: '#454545',
      light: '#C8C8C8',
      hcDark: contrastBorder,
      hcLight: contrastBorder,
    });
    const editorWidgetResizeBorder = this._registerColor('editorWidget.resizeBorder', null);
    const editorErrorBackground = this._registerColor('editorError.background', null, true);
    const editorErrorForeground = this._registerColor('editorError.foreground', {
      dark: '#F14C4C',
      light: '#E51400',
      hcDark: '#F48771',
      hcLight: '#B5200D',
    });
    const editorErrorBorder = this._registerColor('editorError.border', {
      dark: null,
      light: null,
      hcDark: Color.fromHex('#E47777').transparent(0.8),
      hcLight: '#B5200D',
    });
    const editorWarningBackground = this._registerColor('editorWarning.background', null, true);
    const editorWarningForeground = this._registerColor('editorWarning.foreground', {
      dark: '#CCA700',
      light: '#BF8803',
      hcDark: '#FFD370',
      hcLight: '#895503',
    });
    const editorWarningBorder = this._registerColor('editorWarning.border', {
      dark: null,
      light: null,
      hcDark: Color.fromHex('#FFCC00').transparent(0.8),
      hcLight: Color.fromHex('#FFCC00').transparent(0.8),
    });
    const editorInfoBackground = this._registerColor('editorInfo.background', null, true);
    const editorInfoForeground = this._registerColor('editorInfo.foreground', {
      dark: '#3794FF',
      light: '#1a85ff',
      hcDark: '#3794FF',
      hcLight: '#1a85ff',
    });
    const editorInfoBorder = this._registerColor('editorInfo.border', {
      dark: null,
      light: null,
      hcDark: Color.fromHex('#3794FF').transparent(0.8),
      hcLight: '#292929',
    });
    const editorHintForeground = this._registerColor('editorHint.foreground', {
      dark: Color.fromHex('#eeeeee').transparent(0.7),
      light: '#6c6c6c',
      hcDark: null,
      hcLight: null,
    });
    const editorHintBorder = this._registerColor('editorHint.border', {
      dark: null,
      light: null,
      hcDark: Color.fromHex('#eeeeee').transparent(0.8),
      hcLight: '#292929',
    });
    const editorActiveLinkForeground = this._registerColor('editorLink.activeForeground', {
      dark: '#4E94CE',
      light: Color.blue,
      hcDark: Color.cyan,
      hcLight: '#292929',
    });
    // ----- editor selection
    const editorSelectionBackground = this._registerColor('editor.selectionBackground', {
      light: '#ADD6FF',
      dark: '#264F78',
      hcDark: '#f3f518',
      hcLight: '#0F4A85',
    });
    const editorSelectionForeground = this._registerColor('editor.selectionForeground', {
      light: null,
      dark: null,
      hcDark: '#000000',
      hcLight: Color.white,
    });
    const editorInactiveSelection = this._registerColor(
      'editor.inactiveSelectionBackground',
      {
        light: transparent(editorSelectionBackground, 0.5),
        dark: transparent(editorSelectionBackground, 0.5),
        hcDark: transparent(editorSelectionBackground, 0.7),
        hcLight: transparent(editorSelectionBackground, 0.5),
      },
      true
    );
    const editorSelectionHighlight = this._registerColor(
      'editor.selectionHighlightBackground',
      {
        light: lessProminent(editorSelectionBackground, editorBackground, 0.3, 0.6),
        dark: lessProminent(editorSelectionBackground, editorBackground, 0.3, 0.6),
        hcDark: null,
        hcLight: null,
      },
      true
    );
    const editorSelectionHighlightBorder = this._registerColor('editor.selectionHighlightBorder', {
      light: null,
      dark: null,
      hcDark: activeContrastBorder,
      hcLight: activeContrastBorder,
    });
    // ----- editor find
    const editorFindMatch = this._registerColor('editor.findMatchBackground', {
      light: '#A8AC94',
      dark: '#515C6A',
      hcDark: null,
      hcLight: null,
    });
    const editorFindMatchForeground = this._registerColor('editor.findMatchForeground', null);
    const editorFindMatchHighlight = this._registerColor(
      'editor.findMatchHighlightBackground',
      { light: '#EA5C0055', dark: '#EA5C0055', hcDark: null, hcLight: null },
      true
    );
    const editorFindMatchHighlightForeground = this._registerColor(
      'editor.findMatchHighlightForeground',
      null
    );
    const editorFindRangeHighlight = this._registerColor(
      'editor.findRangeHighlightBackground',
      { dark: '#3a3d4166', light: '#b4b4b44d', hcDark: null, hcLight: null },
      true
    );
    const editorFindMatchBorder = this._registerColor('editor.findMatchBorder', {
      light: null,
      dark: null,
      hcDark: activeContrastBorder,
      hcLight: activeContrastBorder,
    });
    const editorFindMatchHighlightBorder = this._registerColor('editor.findMatchHighlightBorder', {
      light: null,
      dark: null,
      hcDark: activeContrastBorder,
      hcLight: activeContrastBorder,
    });
    const editorFindRangeHighlightBorder = this._registerColor(
      'editor.findRangeHighlightBorder',
      {
        dark: null,
        light: null,
        hcDark: transparent(activeContrastBorder, 0.4),
        hcLight: transparent(activeContrastBorder, 0.4),
      },
      true
    );
    // ----- editor hover
    const editorHoverHighlight = this._registerColor(
      'editor.hoverHighlightBackground',
      { light: '#ADD6FF26', dark: '#264f7840', hcDark: '#ADD6FF26', hcLight: null },
      true
    );
    const editorHoverBackground = this._registerColor(
      'editorHoverWidget.background',
      editorWidgetBackground
    );
    const editorHoverForeground = this._registerColor(
      'editorHoverWidget.foreground',
      editorWidgetForeground
    );
    const editorHoverBorder = this._registerColor('editorHoverWidget.border', editorWidgetBorder);
    const editorHoverStatusBarBackground = this._registerColor(
      'editorHoverWidget.statusBarBackground',
      {
        dark: lighten(editorHoverBackground, 0.2),
        light: darken(editorHoverBackground, 0.05),
        hcDark: editorWidgetBackground,
        hcLight: editorWidgetBackground,
      }
    );
    // ----- editor inlay hint
    const editorInlayHintForeground = this._registerColor('editorInlayHint.foreground', {
      dark: '#969696',
      light: '#969696',
      hcDark: Color.white,
      hcLight: Color.black,
    });
    const editorInlayHintBackground = this._registerColor('editorInlayHint.background', {
      dark: transparent(badgeBackground, 0.1),
      light: transparent(badgeBackground, 0.1),
      hcDark: transparent(Color.white, 0.1),
      hcLight: transparent(badgeBackground, 0.1),
    });
    const editorInlayHintTypeForeground = this._registerColor(
      'editorInlayHint.typeForeground',
      editorInlayHintForeground
    );
    const editorInlayHintTypeBackground = this._registerColor(
      'editorInlayHint.typeBackground',
      editorInlayHintBackground
    );
    const editorInlayHintParameterForeground = this._registerColor(
      'editorInlayHint.parameterForeground',
      editorInlayHintForeground
    );
    const editorInlayHintParameterBackground = this._registerColor(
      'editorInlayHint.parameterBackground',
      editorInlayHintBackground
    );
    // ----- editor lightbulb
    const editorLightBulbForeground = this._registerColor('editorLightBulb.foreground', {
      dark: '#FFCC00',
      light: '#DDB100',
      hcDark: '#FFCC00',
      hcLight: '#007ACC',
    });
    const editorLightBulbAutoFixForeground = this._registerColor(
      'editorLightBulbAutoFix.foreground',
      { dark: '#75BEFF', light: '#007ACC', hcDark: '#75BEFF', hcLight: '#007ACC' }
    );
    const editorLightBulbAiForeground = this._registerColor(
      'editorLightBulbAi.foreground',
      editorLightBulbForeground
    );
    // ----- editor snippet
    const snippetTabstopHighlightBackground = this._registerColor(
      'editor.snippetTabstopHighlightBackground',
      {
        dark: new Color(new RGBA(124, 124, 124, 0.3)),
        light: new Color(new RGBA(10, 50, 100, 0.2)),
        hcDark: new Color(new RGBA(124, 124, 124, 0.3)),
        hcLight: new Color(new RGBA(10, 50, 100, 0.2)),
      }
    );
    const snippetTabstopHighlightBorder = this._registerColor(
      'editor.snippetTabstopHighlightBorder',
      null
    );
    const snippetFinalTabstopHighlightBackground = this._registerColor(
      'editor.snippetFinalTabstopHighlightBackground',
      null
    );
    const snippetFinalTabstopHighlightBorder = this._registerColor(
      'editor.snippetFinalTabstopHighlightBorder',
      {
        dark: '#525252',
        light: new Color(new RGBA(10, 50, 100, 0.5)),
        hcDark: '#525252',
        hcLight: '#292929',
      }
    );
    // ----- diff editor
    const defaultInsertColor = new Color(new RGBA(155, 185, 85, 0.2));
    const defaultRemoveColor = new Color(new RGBA(255, 0, 0, 0.2));
    const diffInserted = this._registerColor(
      'diffEditor.insertedTextBackground',
      { dark: '#9ccc2c33', light: '#9ccc2c40', hcDark: null, hcLight: null },
      true
    );
    const diffRemoved = this._registerColor(
      'diffEditor.removedTextBackground',
      { dark: '#ff000033', light: '#ff000033', hcDark: null, hcLight: null },
      true
    );
    const diffInsertedLine = this._registerColor(
      'diffEditor.insertedLineBackground',
      { dark: defaultInsertColor, light: defaultInsertColor, hcDark: null, hcLight: null },
      true
    );
    const diffRemovedLine = this._registerColor(
      'diffEditor.removedLineBackground',
      { dark: defaultRemoveColor, light: defaultRemoveColor, hcDark: null, hcLight: null },
      true
    );
    const diffInsertedLineGutter = this._registerColor(
      'diffEditorGutter.insertedLineBackground',
      null
    );
    const diffRemovedLineGutter = this._registerColor(
      'diffEditorGutter.removedLineBackground',
      null
    );
    const diffOverviewRulerInserted = this._registerColor(
      'diffEditorOverview.insertedForeground',
      null
    );
    const diffOverviewRulerRemoved = this._registerColor(
      'diffEditorOverview.removedForeground',
      null
    );
    const diffInsertedOutline = this._registerColor('diffEditor.insertedTextBorder', {
      dark: null,
      light: null,
      hcDark: '#33ff2eff',
      hcLight: '#374E06',
    });
    const diffRemovedOutline = this._registerColor('diffEditor.removedTextBorder', {
      dark: null,
      light: null,
      hcDark: '#FF008F',
      hcLight: '#AD0707',
    });
    const diffBorder = this._registerColor('diffEditor.border', {
      dark: null,
      light: null,
      hcDark: contrastBorder,
      hcLight: contrastBorder,
    });
    const diffDiagonalFill = this._registerColor('diffEditor.diagonalFill', {
      dark: '#cccccc33',
      light: '#22222233',
      hcDark: null,
      hcLight: null,
    });
    const diffUnchangedRegionBackground = this._registerColor(
      'diffEditor.unchangedRegionBackground',
      'sideBar.background'
    );
    const diffUnchangedRegionForeground = this._registerColor(
      'diffEditor.unchangedRegionForeground',
      'foreground'
    );
    const diffUnchangedTextBackground = this._registerColor('diffEditor.unchangedCodeBackground', {
      dark: '#74747429',
      light: '#b8b8b829',
      hcDark: null,
      hcLight: null,
    });
    // ----- widget
    const widgetShadow = this._registerColor('widget.shadow', {
      dark: transparent(Color.black, 0.36),
      light: transparent(Color.black, 0.16),
      hcDark: null,
      hcLight: null,
    });
    const widgetBorder = this._registerColor('widget.border', {
      dark: null,
      light: null,
      hcDark: contrastBorder,
      hcLight: contrastBorder,
    });
    // ----- toolbar
    const toolbarHoverBackground = this._registerColor('toolbar.hoverBackground', {
      dark: '#5a5d5e50',
      light: '#b8b8b850',
      hcDark: null,
      hcLight: null,
    });
    const toolbarHoverOutline = this._registerColor('toolbar.hoverOutline', {
      dark: null,
      light: null,
      hcDark: activeContrastBorder,
      hcLight: activeContrastBorder,
    });
    const toolbarActiveBackground = this._registerColor('toolbar.activeBackground', {
      dark: lighten(toolbarHoverBackground, 0.1),
      light: darken(toolbarHoverBackground, 0.1),
      hcDark: null,
      hcLight: null,
    });
    // ----- breadcumbs
    const breadcrumbsForeground = this._registerColor(
      'breadcrumb.foreground',
      transparent(foreground, 0.8)
    );
    const breadcrumbsBackground = this._registerColor('breadcrumb.background', editorBackground);
    const breadcrumbsFocusForeground = this._registerColor('breadcrumb.focusForeground', {
      light: darken(foreground, 0.2),
      dark: lighten(foreground, 0.1),
      hcDark: lighten(foreground, 0.1),
      hcLight: lighten(foreground, 0.1),
    });
    const breadcrumbsActiveSelectionForeground = this._registerColor(
      'breadcrumb.activeSelectionForeground',
      {
        light: darken(foreground, 0.2),
        dark: lighten(foreground, 0.1),
        hcDark: lighten(foreground, 0.1),
        hcLight: lighten(foreground, 0.1),
      }
    );
    const breadcrumbsPickerBackground = this._registerColor(
      'breadcrumbPicker.background',
      editorWidgetBackground
    );
    // ----- merge
    const headerTransparency = 0.5;
    const currentBaseColor = Color.fromHex('#40C8AE').transparent(headerTransparency);
    const incomingBaseColor = Color.fromHex('#40A6FF').transparent(headerTransparency);
    const commonBaseColor = Color.fromHex('#606060').transparent(0.4);
    const contentTransparency = 0.4;
    const rulerTransparency = 1;
    const mergeCurrentHeaderBackground = this._registerColor('merge.currentHeaderBackground', {
      dark: currentBaseColor,
      light: currentBaseColor,
      hcDark: null,
      hcLight: null,
    });
    const mergeCurrentContentBackground = this._registerColor(
      'merge.currentContentBackground',
      transparent(mergeCurrentHeaderBackground, contentTransparency)
    );
    const mergeIncomingHeaderBackground = this._registerColor('merge.incomingHeaderBackground', {
      dark: incomingBaseColor,
      light: incomingBaseColor,
      hcDark: null,
      hcLight: null,
    });
    const mergeIncomingContentBackground = this._registerColor(
      'merge.incomingContentBackground',
      transparent(mergeIncomingHeaderBackground, contentTransparency)
    );
    const mergeCommonHeaderBackground = this._registerColor('merge.commonHeaderBackground', {
      dark: commonBaseColor,
      light: commonBaseColor,
      hcDark: null,
      hcLight: null,
    });
    const mergeCommonContentBackground = this._registerColor(
      'merge.commonContentBackground',
      transparent(mergeCommonHeaderBackground, contentTransparency)
    );
    const mergeBorder = this._registerColor('merge.border', {
      dark: null,
      light: null,
      hcDark: '#C3DF6F',
      hcLight: '#007ACC',
    });
    const overviewRulerCurrentContentForeground = this._registerColor(
      'editorOverviewRuler.currentContentForeground',
      {
        dark: transparent(mergeCurrentHeaderBackground, rulerTransparency),
        light: transparent(mergeCurrentHeaderBackground, rulerTransparency),
        hcDark: mergeBorder,
        hcLight: mergeBorder,
      }
    );
    const overviewRulerIncomingContentForeground = this._registerColor(
      'editorOverviewRuler.incomingContentForeground',
      {
        dark: transparent(mergeIncomingHeaderBackground, rulerTransparency),
        light: transparent(mergeIncomingHeaderBackground, rulerTransparency),
        hcDark: mergeBorder,
        hcLight: mergeBorder,
      }
    );
    const overviewRulerCommonContentForeground = this._registerColor(
      'editorOverviewRuler.commonContentForeground',
      {
        dark: transparent(mergeCommonHeaderBackground, rulerTransparency),
        light: transparent(mergeCommonHeaderBackground, rulerTransparency),
        hcDark: mergeBorder,
        hcLight: mergeBorder,
      }
    );
    const overviewRulerFindMatchForeground = this._registerColor(
      'editorOverviewRuler.findMatchForeground',
      { dark: '#d186167e', light: '#d186167e', hcDark: '#AB5A00', hcLight: '' }
    );
    const overviewRulerSelectionHighlightForeground = this._registerColor(
      'editorOverviewRuler.selectionHighlightForeground',
      '#A0A0A0CC'
    );
    // ----- problems
    const problemsErrorIconForeground = this._registerColor(
      'problemsErrorIcon.foreground',
      editorErrorForeground
    );
    const problemsWarningIconForeground = this._registerColor(
      'problemsWarningIcon.foreground',
      editorWarningForeground
    );
    const problemsInfoIconForeground = this._registerColor(
      'problemsInfoIcon.foreground',
      editorInfoForeground
    );

    // <-- https://github.com/microsoft/vscode/tree/1.91.1/src/vs/platform/theme/common/colors/inputColors.ts -->

    // ----- input
    const inputBackground = this._registerColor('input.background', {
      dark: '#3C3C3C',
      light: Color.white,
      hcDark: Color.black,
      hcLight: Color.white,
    });
    const inputForeground = this._registerColor('input.foreground', foreground);
    const inputBorder = this._registerColor('input.border', {
      dark: null,
      light: null,
      hcDark: contrastBorder,
      hcLight: contrastBorder,
    });
    const inputActiveOptionBorder = this._registerColor('inputOption.activeBorder', {
      dark: '#007ACC',
      light: '#007ACC',
      hcDark: contrastBorder,
      hcLight: contrastBorder,
    });
    const inputActiveOptionHoverBackground = this._registerColor('inputOption.hoverBackground', {
      dark: '#5a5d5e80',
      light: '#b8b8b850',
      hcDark: null,
      hcLight: null,
    });
    const inputActiveOptionBackground = this._registerColor('inputOption.activeBackground', {
      dark: transparent(focusBorder, 0.4),
      light: transparent(focusBorder, 0.2),
      hcDark: Color.transparent,
      hcLight: Color.transparent,
    });
    const inputActiveOptionForeground = this._registerColor('inputOption.activeForeground', {
      dark: Color.white,
      light: Color.black,
      hcDark: foreground,
      hcLight: foreground,
    });
    const inputPlaceholderForeground = this._registerColor('input.placeholderForeground', {
      light: transparent(foreground, 0.5),
      dark: transparent(foreground, 0.5),
      hcDark: transparent(foreground, 0.7),
      hcLight: transparent(foreground, 0.7),
    });
    // ----- input validation
    const inputValidationInfoBackground = this._registerColor('inputValidation.infoBackground', {
      dark: '#063B49',
      light: '#D6ECF2',
      hcDark: Color.black,
      hcLight: Color.white,
    });
    const inputValidationInfoForeground = this._registerColor('inputValidation.infoForeground', {
      dark: null,
      light: null,
      hcDark: null,
      hcLight: foreground,
    });
    const inputValidationInfoBorder = this._registerColor('inputValidation.infoBorder', {
      dark: '#007acc',
      light: '#007acc',
      hcDark: contrastBorder,
      hcLight: contrastBorder,
    });
    const inputValidationWarningBackground = this._registerColor(
      'inputValidation.warningBackground',
      { dark: '#352A05', light: '#F6F5D2', hcDark: Color.black, hcLight: Color.white }
    );
    const inputValidationWarningForeground = this._registerColor(
      'inputValidation.warningForeground',
      { dark: null, light: null, hcDark: null, hcLight: foreground }
    );
    const inputValidationWarningBorder = this._registerColor('inputValidation.warningBorder', {
      dark: '#B89500',
      light: '#B89500',
      hcDark: contrastBorder,
      hcLight: contrastBorder,
    });
    const inputValidationErrorBackground = this._registerColor('inputValidation.errorBackground', {
      dark: '#5A1D1D',
      light: '#F2DEDE',
      hcDark: Color.black,
      hcLight: Color.white,
    });
    const inputValidationErrorForeground = this._registerColor('inputValidation.errorForeground', {
      dark: null,
      light: null,
      hcDark: null,
      hcLight: foreground,
    });
    const inputValidationErrorBorder = this._registerColor('inputValidation.errorBorder', {
      dark: '#BE1100',
      light: '#BE1100',
      hcDark: contrastBorder,
      hcLight: contrastBorder,
    });
    // ----- select
    const selectBackground = this._registerColor('dropdown.background', {
      dark: '#3C3C3C',
      light: Color.white,
      hcDark: Color.black,
      hcLight: Color.white,
    });
    const selectListBackground = this._registerColor('dropdown.listBackground', {
      dark: null,
      light: null,
      hcDark: Color.black,
      hcLight: Color.white,
    });
    const selectForeground = this._registerColor('dropdown.foreground', {
      dark: '#F0F0F0',
      light: foreground,
      hcDark: Color.white,
      hcLight: foreground,
    });
    const selectBorder = this._registerColor('dropdown.border', {
      dark: selectBackground,
      light: '#CECECE',
      hcDark: contrastBorder,
      hcLight: contrastBorder,
    });
    // ------ button
    const buttonForeground = this._registerColor('button.foreground', Color.white);
    const buttonSeparator = this._registerColor(
      'button.separator',
      transparent(buttonForeground, 0.4)
    );
    const buttonBackground = this._registerColor('button.background', {
      dark: '#0E639C',
      light: '#007ACC',
      hcDark: null,
      hcLight: '#0F4A85',
    });
    const buttonHoverBackground = this._registerColor('button.hoverBackground', {
      dark: lighten(buttonBackground, 0.2),
      light: darken(buttonBackground, 0.2),
      hcDark: buttonBackground,
      hcLight: buttonBackground,
    });
    const buttonBorder = this._registerColor('button.border', contrastBorder);
    const buttonSecondaryForeground = this._registerColor('button.secondaryForeground', {
      dark: Color.white,
      light: Color.white,
      hcDark: Color.white,
      hcLight: foreground,
    });
    const buttonSecondaryBackground = this._registerColor('button.secondaryBackground', {
      dark: '#3A3D41',
      light: '#5F6A79',
      hcDark: null,
      hcLight: Color.white,
    });
    const buttonSecondaryHoverBackground = this._registerColor('button.secondaryHoverBackground', {
      dark: lighten(buttonSecondaryBackground, 0.2),
      light: darken(buttonSecondaryBackground, 0.2),
      hcDark: null,
      hcLight: null,
    });
    // ------ checkbox
    const checkboxBackground = this._registerColor('checkbox.background', selectBackground);
    const checkboxSelectBackground = this._registerColor(
      'checkbox.selectBackground',
      editorWidgetBackground
    );
    const checkboxForeground = this._registerColor('checkbox.foreground', selectForeground);
    const checkboxBorder = this._registerColor('checkbox.border', selectBorder);
    const checkboxSelectBorder = this._registerColor('checkbox.selectBorder', iconForeground);
    // ------ keybinding label
    const keybindingLabelBackground = this._registerColor('keybindingLabel.background', {
      dark: new Color(new RGBA(128, 128, 128, 0.17)),
      light: new Color(new RGBA(221, 221, 221, 0.4)),
      hcDark: Color.transparent,
      hcLight: Color.transparent,
    });
    const keybindingLabelForeground = this._registerColor('keybindingLabel.foreground', {
      dark: Color.fromHex('#CCCCCC'),
      light: Color.fromHex('#555555'),
      hcDark: Color.white,
      hcLight: foreground,
    });
    const keybindingLabelBorder = this._registerColor('keybindingLabel.border', {
      dark: new Color(new RGBA(51, 51, 51, 0.6)),
      light: new Color(new RGBA(204, 204, 204, 0.4)),
      hcDark: new Color(new RGBA(111, 195, 223)),
      hcLight: contrastBorder,
    });
    const keybindingLabelBottomBorder = this._registerColor('keybindingLabel.bottomBorder', {
      dark: new Color(new RGBA(68, 68, 68, 0.6)),
      light: new Color(new RGBA(187, 187, 187, 0.4)),
      hcDark: new Color(new RGBA(111, 195, 223)),
      hcLight: foreground,
    });

    // <-- https://github.com/microsoft/vscode/tree/1.91.1/src/vs/platform/theme/common/colors/listColors.ts -->

    const listFocusBackground = this._registerColor('list.focusBackground', null);
    const listFocusForeground = this._registerColor('list.focusForeground', null);
    const listFocusOutline = this._registerColor('list.focusOutline', {
      dark: focusBorder,
      light: focusBorder,
      hcDark: activeContrastBorder,
      hcLight: activeContrastBorder,
    });
    const listFocusAndSelectionOutline = this._registerColor('list.focusAndSelectionOutline', null);
    const listActiveSelectionBackground = this._registerColor('list.activeSelectionBackground', {
      dark: '#04395E',
      light: '#0060C0',
      hcDark: null,
      hcLight: Color.fromHex('#0F4A85').transparent(0.1),
    });
    const listActiveSelectionForeground = this._registerColor('list.activeSelectionForeground', {
      dark: Color.white,
      light: Color.white,
      hcDark: null,
      hcLight: null,
    });
    const listActiveSelectionIconForeground = this._registerColor(
      'list.activeSelectionIconForeground',
      null
    );
    const listInactiveSelectionBackground = this._registerColor(
      'list.inactiveSelectionBackground',
      {
        dark: '#37373D',
        light: '#E4E6F1',
        hcDark: null,
        hcLight: Color.fromHex('#0F4A85').transparent(0.1),
      }
    );
    const listInactiveSelectionForeground = this._registerColor(
      'list.inactiveSelectionForeground',
      null
    );
    const listInactiveSelectionIconForeground = this._registerColor(
      'list.inactiveSelectionIconForeground',
      null
    );
    const listInactiveFocusBackground = this._registerColor('list.inactiveFocusBackground', null);
    const listInactiveFocusOutline = this._registerColor('list.inactiveFocusOutline', null);
    const listHoverBackground = this._registerColor('list.hoverBackground', {
      dark: '#2A2D2E',
      light: '#F0F0F0',
      hcDark: Color.white.transparent(0.1),
      hcLight: Color.fromHex('#0F4A85').transparent(0.1),
    });
    const listHoverForeground = this._registerColor('list.hoverForeground', null);
    const listDropOverBackground = this._registerColor('list.dropBackground', {
      dark: '#062F4A',
      light: '#D6EBFF',
      hcDark: null,
      hcLight: null,
    });
    const listDropBetweenBackground = this._registerColor('list.dropBetweenBackground', {
      dark: iconForeground,
      light: iconForeground,
      hcDark: null,
      hcLight: null,
    });
    const listHighlightForeground = this._registerColor('list.highlightForeground', {
      dark: '#2AAAFF',
      light: '#0066BF',
      hcDark: focusBorder,
      hcLight: focusBorder,
    });
    const listFocusHighlightForeground = this._registerColor('list.focusHighlightForeground', {
      dark: listHighlightForeground,
      light: ifDefinedThenElse(listActiveSelectionBackground, listHighlightForeground, '#BBE7FF'),
      hcDark: listHighlightForeground,
      hcLight: listHighlightForeground,
    });
    const listInvalidItemForeground = this._registerColor('list.invalidItemForeground', {
      dark: '#B89500',
      light: '#B89500',
      hcDark: '#B89500',
      hcLight: '#B5200D',
    });
    const listErrorForeground = this._registerColor('list.errorForeground', {
      dark: '#F88070',
      light: '#B01011',
      hcDark: null,
      hcLight: null,
    });
    const listWarningForeground = this._registerColor('list.warningForeground', {
      dark: '#CCA700',
      light: '#855F00',
      hcDark: null,
      hcLight: null,
    });
    const listFilterWidgetBackground = this._registerColor('listFilterWidget.background', {
      light: darken(editorWidgetBackground, 0),
      dark: lighten(editorWidgetBackground, 0),
      hcDark: editorWidgetBackground,
      hcLight: editorWidgetBackground,
    });
    const listFilterWidgetOutline = this._registerColor('listFilterWidget.outline', {
      dark: Color.transparent,
      light: Color.transparent,
      hcDark: '#f38518',
      hcLight: '#007ACC',
    });
    const listFilterWidgetNoMatchesOutline = this._registerColor(
      'listFilterWidget.noMatchesOutline',
      { dark: '#BE1100', light: '#BE1100', hcDark: contrastBorder, hcLight: contrastBorder }
    );
    const listFilterWidgetShadow = this._registerColor('listFilterWidget.shadow', widgetShadow);
    const listFilterMatchHighlight = this._registerColor('list.filterMatchBackground', {
      dark: editorFindMatchHighlight,
      light: editorFindMatchHighlight,
      hcDark: null,
      hcLight: null,
    });
    const listFilterMatchHighlightBorder = this._registerColor('list.filterMatchBorder', {
      dark: editorFindMatchHighlightBorder,
      light: editorFindMatchHighlightBorder,
      hcDark: contrastBorder,
      hcLight: activeContrastBorder,
    });
    const listDeemphasizedForeground = this._registerColor('list.deemphasizedForeground', {
      dark: '#8C8C8C',
      light: '#8E8E90',
      hcDark: '#A7A8A9',
      hcLight: '#666666',
    });
    // ------ tree
    const treeIndentGuidesStroke = this._registerColor('tree.indentGuidesStroke', {
      dark: '#585858',
      light: '#a9a9a9',
      hcDark: '#a9a9a9',
      hcLight: '#a5a5a5',
    });
    const treeInactiveIndentGuidesStroke = this._registerColor(
      'tree.inactiveIndentGuidesStroke',
      transparent(treeIndentGuidesStroke, 0.4)
    );
    // ------ table
    const tableColumnsBorder = this._registerColor('tree.tableColumnsBorder', {
      dark: '#CCCCCC20',
      light: '#61616120',
      hcDark: null,
      hcLight: null,
    });
    const tableOddRowsBackgroundColor = this._registerColor('tree.tableOddRowsBackground', {
      dark: transparent(foreground, 0.04),
      light: transparent(foreground, 0.04),
      hcDark: null,
      hcLight: null,
    });

    // <-- https://github.com/microsoft/vscode/tree/1.91.1/src/vs/platform/theme/common/colors/menuColors.ts -->

    const menuBorder = this._registerColor('menu.border', {
      dark: null,
      light: null,
      hcDark: contrastBorder,
      hcLight: contrastBorder,
    });
    const menuForeground = this._registerColor('menu.foreground', selectForeground);
    const menuBackground = this._registerColor('menu.background', selectBackground);
    const menuSelectionForeground = this._registerColor(
      'menu.selectionForeground',
      listActiveSelectionForeground
    );
    const menuSelectionBackground = this._registerColor(
      'menu.selectionBackground',
      listActiveSelectionBackground
    );
    const menuSelectionBorder = this._registerColor('menu.selectionBorder', {
      dark: null,
      light: null,
      hcDark: activeContrastBorder,
      hcLight: activeContrastBorder,
    });
    const menuSeparatorBackground = this._registerColor('menu.separatorBackground', {
      dark: '#606060',
      light: '#D4D4D4',
      hcDark: contrastBorder,
      hcLight: contrastBorder,
    });

    // <-- https://github.com/microsoft/vscode/tree/1.91.1/src/vs/platform/theme/common/colors/minimapColors.ts -->

    const minimapFindMatch = this._registerColor(
      'minimap.findMatchHighlight',
      { light: '#d18616', dark: '#d18616', hcDark: '#AB5A00', hcLight: '#0F4A85' },
      true
    );
    const minimapSelectionOccurrenceHighlight = this._registerColor(
      'minimap.selectionOccurrenceHighlight',
      { light: '#c9c9c9', dark: '#676767', hcDark: '#ffffff', hcLight: '#0F4A85' },
      true
    );
    const minimapSelection = this._registerColor(
      'minimap.selectionHighlight',
      { light: '#ADD6FF', dark: '#264F78', hcDark: '#ffffff', hcLight: '#0F4A85' },
      true
    );
    const minimapInfo = this._registerColor('minimap.infoHighlight', {
      dark: editorInfoForeground,
      light: editorInfoForeground,
      hcDark: editorInfoBorder,
      hcLight: editorInfoBorder,
    });
    const minimapWarning = this._registerColor('minimap.warningHighlight', {
      dark: editorWarningForeground,
      light: editorWarningForeground,
      hcDark: editorWarningBorder,
      hcLight: editorWarningBorder,
    });
    const minimapError = this._registerColor('minimap.errorHighlight', {
      dark: new Color(new RGBA(255, 18, 18, 0.7)),
      light: new Color(new RGBA(255, 18, 18, 0.7)),
      hcDark: new Color(new RGBA(255, 50, 50, 1)),
      hcLight: '#B5200D',
    });
    const minimapBackground = this._registerColor('minimap.background', null);
    const minimapForegroundOpacity = this._registerColor(
      'minimap.foregroundOpacity',
      Color.fromHex('#000f')
    );
    const minimapSliderBackground = this._registerColor(
      'minimapSlider.background',
      transparent(scrollbarSliderBackground, 0.5)
    );
    const minimapSliderHoverBackground = this._registerColor(
      'minimapSlider.hoverBackground',
      transparent(scrollbarSliderHoverBackground, 0.5)
    );
    const minimapSliderActiveBackground = this._registerColor(
      'minimapSlider.activeBackground',
      transparent(scrollbarSliderActiveBackground, 0.5)
    );

    // <-- https://github.com/microsoft/vscode/tree/1.91.1/src/vs/platform/theme/common/colors/quickpickColors.ts -->

    const quickInputBackground = this._registerColor(
      'quickInput.background',
      editorWidgetBackground
    );
    const quickInputForeground = this._registerColor(
      'quickInput.foreground',
      editorWidgetForeground
    );
    const quickInputTitleBackground = this._registerColor('quickInputTitle.background', {
      dark: new Color(new RGBA(255, 255, 255, 0.105)),
      light: new Color(new RGBA(0, 0, 0, 0.06)),
      hcDark: '#000000',
      hcLight: Color.white,
    });
    const pickerGroupForeground = this._registerColor('pickerGroup.foreground', {
      dark: '#3794FF',
      light: '#0066BF',
      hcDark: Color.white,
      hcLight: '#0F4A85',
    });
    const pickerGroupBorder = this._registerColor('pickerGroup.border', {
      dark: '#3F3F46',
      light: '#CCCEDB',
      hcDark: Color.white,
      hcLight: '#0F4A85',
    });
    const _deprecatedQuickInputListFocusBackground = this._registerColor(
      'quickInput.list.focusBackground',
      null
    );
    const quickInputListFocusForeground = this._registerColor(
      'quickInputList.focusForeground',
      listActiveSelectionForeground
    );
    const quickInputListFocusIconForeground = this._registerColor(
      'quickInputList.focusIconForeground',
      listActiveSelectionIconForeground
    );
    const quickInputListFocusBackground = this._registerColor('quickInputList.focusBackground', {
      dark: oneOf(_deprecatedQuickInputListFocusBackground, listActiveSelectionBackground),
      light: oneOf(_deprecatedQuickInputListFocusBackground, listActiveSelectionBackground),
      hcDark: null,
      hcLight: null,
    });

    // <-- https://github.com/microsoft/vscode/tree/1.91.1/src/vs/platform/theme/common/colors/searchColors.ts -->

    const searchResultsInfoForeground = this._registerColor('search.resultsInfoForeground', {
      light: foreground,
      dark: transparent(foreground, 0.65),
      hcDark: foreground,
      hcLight: foreground,
    });
    // ----- search editor (Distinct from normal editor find match to allow for better differentiation)
    const searchEditorFindMatch = this._registerColor('searchEditor.findMatchBackground', {
      light: transparent(editorFindMatchHighlight, 0.66),
      dark: transparent(editorFindMatchHighlight, 0.66),
      hcDark: editorFindMatchHighlight,
      hcLight: editorFindMatchHighlight,
    });
    const searchEditorFindMatchBorder = this._registerColor('searchEditor.findMatchBorder', {
      light: transparent(editorFindMatchHighlightBorder, 0.66),
      dark: transparent(editorFindMatchHighlightBorder, 0.66),
      hcDark: editorFindMatchHighlightBorder,
      hcLight: editorFindMatchHighlightBorder,
    });

    // <-- https://github.com/microsoft/vscode/tree/1.91.1/src/vs/platform/theme/common/colors/chartsColors.ts -->

    const chartsForeground = this._registerColor('charts.foreground', foreground);
    const chartsLines = this._registerColor('charts.lines', transparent(foreground, 0.5));
    const chartsRed = this._registerColor('charts.red', editorErrorForeground);
    const chartsBlue = this._registerColor('charts.blue', editorInfoForeground);
    const chartsYellow = this._registerColor('charts.yellow', editorWarningForeground);
    const chartsOrange = this._registerColor('charts.orange', minimapFindMatch);
    const chartsGreen = this._registerColor('charts.green', {
      dark: '#89D185',
      light: '#388A34',
      hcDark: '#89D185',
      hcLight: '#374e06',
    });
    const chartsPurple = this._registerColor('charts.purple', {
      dark: '#B180D7',
      light: '#652D90',
      hcDark: '#B180D7',
      hcLight: '#652D90',
    });

    // <-- https://github.com/microsoft/vscode/tree/1.91.1/src/vs/editor/common/core/editorColorRegistry.ts -->

    const editorLineHighlight = this._registerColor('editor.lineHighlightBackground', null);
    const editorLineHighlightBorder = this._registerColor('editor.lineHighlightBorder', {
      dark: '#282828',
      light: '#eeeeee',
      hcDark: '#f38518',
      hcLight: contrastBorder,
    });
    const editorRangeHighlight = this._registerColor(
      'editor.rangeHighlightBackground',
      { dark: '#ffffff0b', light: '#fdff0033', hcDark: null, hcLight: null },
      true
    );
    const editorRangeHighlightBorder = this._registerColor('editor.rangeHighlightBorder', {
      dark: null,
      light: null,
      hcDark: activeContrastBorder,
      hcLight: activeContrastBorder,
    });
    const editorSymbolHighlight = this._registerColor(
      'editor.symbolHighlightBackground',
      {
        dark: editorFindMatchHighlight,
        light: editorFindMatchHighlight,
        hcDark: null,
        hcLight: null,
      },
      true
    );
    const editorSymbolHighlightBorder = this._registerColor('editor.symbolHighlightBorder', {
      dark: null,
      light: null,
      hcDark: activeContrastBorder,
      hcLight: activeContrastBorder,
    });
    const editorCursorForeground = this._registerColor('editorCursor.foreground', {
      dark: '#AEAFAD',
      light: Color.black,
      hcDark: Color.white,
      hcLight: '#0F4A85',
    });
    const editorCursorBackground = this._registerColor('editorCursor.background', null);
    const editorMultiCursorPrimaryForeground = this._registerColor(
      'editorMultiCursor.primary.foreground',
      editorCursorForeground
    );
    const editorMultiCursorPrimaryBackground = this._registerColor(
      'editorMultiCursor.primary.background',
      editorCursorBackground
    );
    const editorMultiCursorSecondaryForeground = this._registerColor(
      'editorMultiCursor.secondary.foreground',
      editorCursorForeground
    );
    const editorMultiCursorSecondaryBackground = this._registerColor(
      'editorMultiCursor.secondary.background',
      editorCursorBackground
    );
    const editorWhitespaces = this._registerColor('editorWhitespace.foreground', {
      dark: '#e3e4e229',
      light: '#33333333',
      hcDark: '#e3e4e229',
      hcLight: '#CCCCCC',
    });
    const editorLineNumbers = this._registerColor('editorLineNumber.foreground', {
      dark: '#858585',
      light: '#237893',
      hcDark: Color.white,
      hcLight: '#292929',
    });
    const deprecatedEditorIndentGuides = this._registerColor(
      'editorIndentGuide.background',
      editorWhitespaces
    );
    const deprecatedEditorActiveIndentGuides = this._registerColor(
      'editorIndentGuide.activeBackground',
      editorWhitespaces
    );
    const editorIndentGuide1 = this._registerColor(
      'editorIndentGuide.background1',
      deprecatedEditorIndentGuides
    );
    const editorIndentGuide2 = this._registerColor('editorIndentGuide.background2', '#00000000');
    const editorIndentGuide3 = this._registerColor('editorIndentGuide.background3', '#00000000');
    const editorIndentGuide4 = this._registerColor('editorIndentGuide.background4', '#00000000');
    const editorIndentGuide5 = this._registerColor('editorIndentGuide.background5', '#00000000');
    const editorIndentGuide6 = this._registerColor('editorIndentGuide.background6', '#00000000');
    const editorActiveIndentGuide1 = this._registerColor(
      'editorIndentGuide.activeBackground1',
      deprecatedEditorActiveIndentGuides
    );
    const editorActiveIndentGuide2 = this._registerColor(
      'editorIndentGuide.activeBackground2',
      '#00000000'
    );
    const editorActiveIndentGuide3 = this._registerColor(
      'editorIndentGuide.activeBackground3',
      '#00000000'
    );
    const editorActiveIndentGuide4 = this._registerColor(
      'editorIndentGuide.activeBackground4',
      '#00000000'
    );
    const editorActiveIndentGuide5 = this._registerColor(
      'editorIndentGuide.activeBackground5',
      '#00000000'
    );
    const editorActiveIndentGuide6 = this._registerColor(
      'editorIndentGuide.activeBackground6',
      '#00000000'
    );
    const deprecatedEditorActiveLineNumber = this._registerColor(
      'editorActiveLineNumber.foreground',
      {
        dark: '#c6c6c6',
        light: '#0B216F',
        hcDark: activeContrastBorder,
        hcLight: activeContrastBorder,
      }
    );
    const editorActiveLineNumber = this._registerColor(
      'editorLineNumber.activeForeground',
      deprecatedEditorActiveLineNumber
    );
    const editorDimmedLineNumber = this._registerColor('editorLineNumber.dimmedForeground', null);
    const editorRuler = this._registerColor('editorRuler.foreground', {
      dark: '#5A5A5A',
      light: Color.lightgrey,
      hcDark: Color.white,
      hcLight: '#292929',
    });
    const editorCodeLensForeground = this._registerColor('editorCodeLens.foreground', {
      dark: '#999999',
      light: '#919191',
      hcDark: '#999999',
      hcLight: '#292929',
    });
    const editorBracketMatchBackground = this._registerColor('editorBracketMatch.background', {
      dark: '#0064001a',
      light: '#0064001a',
      hcDark: '#0064001a',
      hcLight: '#0000',
    });
    const editorBracketMatchBorder = this._registerColor('editorBracketMatch.border', {
      dark: '#888',
      light: '#B9B9B9',
      hcDark: contrastBorder,
      hcLight: contrastBorder,
    });
    const editorOverviewRulerBorder = this._registerColor('editorOverviewRuler.border', {
      dark: '#7f7f7f4d',
      light: '#7f7f7f4d',
      hcDark: '#7f7f7f4d',
      hcLight: '#666666',
    });
    const editorOverviewRulerBackground = this._registerColor(
      'editorOverviewRuler.background',
      null
    );
    const editorGutter = this._registerColor('editorGutter.background', editorBackground);
    const editorUnnecessaryCodeBorder = this._registerColor('editorUnnecessaryCode.border', {
      dark: null,
      light: null,
      hcDark: Color.fromHex('#fff').transparent(0.8),
      hcLight: contrastBorder,
    });
    const editorUnnecessaryCodeOpacity = this._registerColor('editorUnnecessaryCode.opacity', {
      dark: Color.fromHex('#000a'),
      light: Color.fromHex('#0007'),
      hcDark: null,
      hcLight: null,
    });
    const ghostTextBorder = this._registerColor('editorGhostText.border', {
      dark: null,
      light: null,
      hcDark: Color.fromHex('#fff').transparent(0.8),
      hcLight: Color.fromHex('#292929').transparent(0.8),
    });
    const ghostTextForeground = this._registerColor('editorGhostText.foreground', {
      dark: Color.fromHex('#ffffff56'),
      light: Color.fromHex('#0007'),
      hcDark: null,
      hcLight: null,
    });
    const ghostTextBackground = this._registerColor('editorGhostText.background', null);
    const rulerRangeDefault = new Color(new RGBA(0, 122, 204, 0.6));
    const overviewRulerRangeHighlight = this._registerColor(
      'editorOverviewRuler.rangeHighlightForeground',
      rulerRangeDefault,
      true
    );
    const overviewRulerError = this._registerColor('editorOverviewRuler.errorForeground', {
      dark: new Color(new RGBA(255, 18, 18, 0.7)),
      light: new Color(new RGBA(255, 18, 18, 0.7)),
      hcDark: new Color(new RGBA(255, 50, 50, 1)),
      hcLight: '#B5200D',
    });
    const overviewRulerWarning = this._registerColor('editorOverviewRuler.warningForeground', {
      dark: editorWarningForeground,
      light: editorWarningForeground,
      hcDark: editorWarningBorder,
      hcLight: editorWarningBorder,
    });
    const overviewRulerInfo = this._registerColor('editorOverviewRuler.infoForeground', {
      dark: editorInfoForeground,
      light: editorInfoForeground,
      hcDark: editorInfoBorder,
      hcLight: editorInfoBorder,
    });
    const editorBracketHighlightingForeground1 = this._registerColor(
      'editorBracketHighlight.foreground1',
      { dark: '#FFD700', light: '#0431FAFF', hcDark: '#FFD700', hcLight: '#0431FAFF' }
    );
    const editorBracketHighlightingForeground2 = this._registerColor(
      'editorBracketHighlight.foreground2',
      { dark: '#DA70D6', light: '#319331FF', hcDark: '#DA70D6', hcLight: '#319331FF' }
    );
    const editorBracketHighlightingForeground3 = this._registerColor(
      'editorBracketHighlight.foreground3',
      { dark: '#179FFF', light: '#7B3814FF', hcDark: '#87CEFA', hcLight: '#7B3814FF' }
    );
    const editorBracketHighlightingForeground4 = this._registerColor(
      'editorBracketHighlight.foreground4',
      '#00000000'
    );
    const editorBracketHighlightingForeground5 = this._registerColor(
      'editorBracketHighlight.foreground5',
      '#00000000'
    );
    const editorBracketHighlightingForeground6 = this._registerColor(
      'editorBracketHighlight.foreground6',
      '#00000000'
    );
    const editorBracketHighlightingUnexpectedBracketForeground = this._registerColor(
      'editorBracketHighlight.unexpectedBracket.foreground',
      {
        dark: new Color(new RGBA(255, 18, 18, 0.8)),
        light: new Color(new RGBA(255, 18, 18, 0.8)),
        hcDark: new Color(new RGBA(255, 50, 50, 1)),
        hcLight: '',
      }
    );
    const editorBracketPairGuideBackground1 = this._registerColor(
      'editorBracketPairGuide.background1',
      '#00000000'
    );
    const editorBracketPairGuideBackground2 = this._registerColor(
      'editorBracketPairGuide.background2',
      '#00000000'
    );
    const editorBracketPairGuideBackground3 = this._registerColor(
      'editorBracketPairGuide.background3',
      '#00000000'
    );
    const editorBracketPairGuideBackground4 = this._registerColor(
      'editorBracketPairGuide.background4',
      '#00000000'
    );
    const editorBracketPairGuideBackground5 = this._registerColor(
      'editorBracketPairGuide.background5',
      '#00000000'
    );
    const editorBracketPairGuideBackground6 = this._registerColor(
      'editorBracketPairGuide.background6',
      '#00000000'
    );
    const editorBracketPairGuideActiveBackground1 = this._registerColor(
      'editorBracketPairGuide.activeBackground1',
      '#00000000'
    );
    const editorBracketPairGuideActiveBackground2 = this._registerColor(
      'editorBracketPairGuide.activeBackground2',
      '#00000000'
    );
    const editorBracketPairGuideActiveBackground3 = this._registerColor(
      'editorBracketPairGuide.activeBackground3',
      '#00000000'
    );
    const editorBracketPairGuideActiveBackground4 = this._registerColor(
      'editorBracketPairGuide.activeBackground4',
      '#00000000'
    );
    const editorBracketPairGuideActiveBackground5 = this._registerColor(
      'editorBracketPairGuide.activeBackground5',
      '#00000000'
    );
    const editorBracketPairGuideActiveBackground6 = this._registerColor(
      'editorBracketPairGuide.activeBackground6',
      '#00000000'
    );
    const editorUnicodeHighlightBorder = this._registerColor(
      'editorUnicodeHighlight.border',
      editorWarningForeground
    );
    const editorUnicodeHighlightBackground = this._registerColor(
      'editorUnicodeHighlight.background',
      editorWarningBackground
    );

    // <-- https://github.com/microsoft/vscode/tree/1.91.1/src/vs/editor/contrib/folding/browser/foldingDecorations.ts -->

    const foldBackground = this._registerColor(
      'editor.foldBackground',
      {
        light: transparent(editorSelectionBackground, 0.3),
        dark: transparent(editorSelectionBackground, 0.3),
        hcDark: null,
        hcLight: null,
      },
      true
    );
    this._registerColor('editor.foldPlaceholderForeground', {
      light: '#808080',
      dark: '#808080',
      hcDark: null,
      hcLight: null,
    });
    this._registerColor('editorGutter.foldingControlForeground', iconForeground);

    // <-- https://github.com/microsoft/vscode/tree/1.91.1/src/vs/editor/contrib/bracketMatching/browser/bracketMatching.ts -->

    const overviewRulerBracketMatchForeground = this._registerColor(
      'editorOverviewRuler.bracketMatchForeground',
      '#A0A0A0'
    );

    // <-- https://github.com/microsoft/vscode/tree/1.91.1/src/vs/editor/browser/widget/multiDiffEditor/colors.ts -->

    const multiDiffEditorHeaderBackground = this._registerColor(
      'multiDiffEditor.headerBackground',
      {
        dark: '#262626',
        light: 'tab.inactiveBackground',
        hcDark: 'tab.inactiveBackground',
        hcLight: 'tab.inactiveBackground',
      }
    );
    const multiDiffEditorBackground = this._registerColor(
      'multiDiffEditor.background',
      'editorBackground'
    );
    const multiDiffEditorBorder = this._registerColor('multiDiffEditor.border', {
      dark: 'sideBarSectionHeader.border',
      light: '#cccccc',
      hcDark: 'sideBarSectionHeader.border',
      hcLight: '#cccccc',
    });

    // <-- https://github.com/microsoft/vscode/tree/1.91.1/src/vs/editor/browser/widget/diffEditor/registrations.contribution.ts -->

    const diffMoveBorder = this._registerColor('diffEditor.move.border', '#8b8b8b9c');
    const diffMoveBorderActive = this._registerColor('diffEditor.moveActive.border', '#FFA500');
    const diffEditorUnchangedRegionShadow = this._registerColor(
      'diffEditor.unchangedRegionShadow',
      { dark: '#000000', light: '#737373BF', hcDark: '#000000', hcLight: '#737373BF' }
    );

    // <-- https://github.com/microsoft/vscode/tree/1.91.1/src/vs/editor/contrib/gotoError/browser/gotoErrorWidget.ts -->

    const errorDefault = oneOf(editorErrorForeground, editorErrorBorder);
    const warningDefault = oneOf(editorWarningForeground, editorWarningBorder);
    const infoDefault = oneOf(editorInfoForeground, editorInfoBorder);
    const editorMarkerNavigationError = this._registerColor(
      'editorMarkerNavigationError.background',
      { dark: errorDefault, light: errorDefault, hcDark: contrastBorder, hcLight: contrastBorder }
    );
    const editorMarkerNavigationErrorHeader = this._registerColor(
      'editorMarkerNavigationError.headerBackground',
      {
        dark: transparent(editorMarkerNavigationError, 0.1),
        light: transparent(editorMarkerNavigationError, 0.1),
        hcDark: null,
        hcLight: null,
      }
    );
    const editorMarkerNavigationWarning = this._registerColor(
      'editorMarkerNavigationWarning.background',
      {
        dark: warningDefault,
        light: warningDefault,
        hcDark: contrastBorder,
        hcLight: contrastBorder,
      }
    );
    const editorMarkerNavigationWarningHeader = this._registerColor(
      'editorMarkerNavigationWarning.headerBackground',
      {
        dark: transparent(editorMarkerNavigationWarning, 0.1),
        light: transparent(editorMarkerNavigationWarning, 0.1),
        hcDark: '#0C141F',
        hcLight: transparent(editorMarkerNavigationWarning, 0.2),
      }
    );
    const editorMarkerNavigationInfo = this._registerColor(
      'editorMarkerNavigationInfo.background',
      { dark: infoDefault, light: infoDefault, hcDark: contrastBorder, hcLight: contrastBorder }
    );
    const editorMarkerNavigationInfoHeader = this._registerColor(
      'editorMarkerNavigationInfo.headerBackground',
      {
        dark: transparent(editorMarkerNavigationInfo, 0.1),
        light: transparent(editorMarkerNavigationInfo, 0.1),
        hcDark: null,
        hcLight: null,
      }
    );
    const editorMarkerNavigationBackground = this._registerColor(
      'editorMarkerNavigation.background',
      editorBackground
    );

    // <-- https://github.com/microsoft/vscode/tree/1.91.1/src/vs/editor/contrib/linkedEditing/browser/linkedEditing.ts -->

    const editorLinkedEditingBackground = this._registerColor('editor.linkedEditingBackground', {
      dark: Color.fromHex('#f00').transparent(0.3),
      light: Color.fromHex('#f00').transparent(0.3),
      hcDark: Color.fromHex('#f00').transparent(0.3),
      hcLight: Color.white,
    });
    // <-- https://github.com/microsoft/vscode/tree/1.91.1/src/vs/editor/contrib/parameterHintsWidget/browser/parameterHintsWidgetWidget.ts -->
    this._registerColor('editorHoverWidget.highlightForeground', listHighlightForeground);

    // <-- https://github.com/microsoft/vscode/tree/1.91.1/src/vs/editor/contrib/peekView/browser/peekView.ts -->
    const peekViewTitleBackground = this._registerColor('peekViewTitle.background', {
      dark: '#252526',
      light: '#F3F3F3',
      hcDark: Color.black,
      hcLight: Color.white,
    });
    const peekViewTitleForeground = this._registerColor('peekViewTitleLabel.foreground', {
      dark: Color.white,
      light: Color.black,
      hcDark: Color.white,
      hcLight: editorForeground,
    });
    const peekViewTitleInfoForeground = this._registerColor('peekViewTitleDescription.foreground', {
      dark: '#ccccccb3',
      light: '#616161',
      hcDark: '#FFFFFF99',
      hcLight: '#292929',
    });
    const peekViewBorder = this._registerColor('peekView.border', {
      dark: editorInfoForeground,
      light: editorInfoForeground,
      hcDark: contrastBorder,
      hcLight: contrastBorder,
    });
    const peekViewResultsBackground = this._registerColor('peekViewResult.background', {
      dark: '#252526',
      light: '#F3F3F3',
      hcDark: Color.black,
      hcLight: Color.white,
    });
    const peekViewResultsMatchForeground = this._registerColor('peekViewResult.lineForeground', {
      dark: '#bbbbbb',
      light: '#646465',
      hcDark: Color.white,
      hcLight: editorForeground,
    });
    const peekViewResultsFileForeground = this._registerColor('peekViewResult.fileForeground', {
      dark: Color.white,
      light: '#1E1E1E',
      hcDark: Color.white,
      hcLight: editorForeground,
    });
    const peekViewResultsSelectionBackground = this._registerColor(
      'peekViewResult.selectionBackground',
      { dark: '#3399ff33', light: '#3399ff33', hcDark: null, hcLight: null }
    );
    const peekViewResultsSelectionForeground = this._registerColor(
      'peekViewResult.selectionForeground',
      { dark: Color.white, light: '#6C6C6C', hcDark: Color.white, hcLight: editorForeground }
    );
    const peekViewEditorBackground = this._registerColor('peekViewEditor.background', {
      dark: '#001F33',
      light: '#F2F8FC',
      hcDark: Color.black,
      hcLight: Color.white,
    });
    const peekViewEditorGutterBackground = this._registerColor(
      'peekViewEditorGutter.background',
      peekViewEditorBackground
    );
    const peekViewEditorStickyScrollBackground = this._registerColor(
      'peekViewEditorStickyScroll.background',
      peekViewEditorBackground
    );

    const peekViewResultsMatchHighlight = this._registerColor(
      'peekViewResult.matchHighlightBackground',
      { dark: '#ea5c004d', light: '#ea5c004d', hcDark: null, hcLight: null }
    );
    const peekViewEditorMatchHighlight = this._registerColor(
      'peekViewEditor.matchHighlightBackground',
      { dark: '#ff8f0099', light: '#f5d802de', hcDark: null, hcLight: null }
    );
    const peekViewEditorMatchHighlightBorder = this._registerColor(
      'peekViewEditor.matchHighlightBorder',
      { dark: null, light: null, hcDark: activeContrastBorder, hcLight: activeContrastBorder }
    );

    // <-- https://github.com/microsoft/vscode/tree/1.91.1/src/vs/editor/contrib/placeholderText/browser/placeholderText.contribution.ts -->

    this._registerColor('editor.placeholder.foreground', {
      dark: ghostTextForeground,
      light: ghostTextForeground,
      hcDark: ghostTextForeground,
      hcLight: ghostTextForeground,
    });

    // <-- https://github.com/microsoft/vscode/tree/1.91.1/src/vs/editor/contrib/suggest/browser/suggestWidget.ts -->

    this._registerColor('editorSuggestWidget.background', editorWidgetBackground);
    this._registerColor('editorSuggestWidget.border', editorWidgetBorder);
    const editorSuggestWidgetForeground = this._registerColor(
      'editorSuggestWidget.foreground',
      editorForeground
    );
    this._registerColor('editorSuggestWidget.selectedForeground', quickInputListFocusForeground);
    this._registerColor(
      'editorSuggestWidget.selectedIconForeground',
      quickInputListFocusIconForeground
    );
    const editorSuggestWidgetSelectedBackground = this._registerColor(
      'editorSuggestWidget.selectedBackground',
      quickInputListFocusBackground
    );
    this._registerColor('editorSuggestWidget.highlightForeground', listHighlightForeground);
    this._registerColor(
      'editorSuggestWidget.focusHighlightForeground',
      listFocusHighlightForeground
    );
    this._registerColor(
      'editorSuggestWidgetStatus.foreground',
      transparent(editorSuggestWidgetForeground, 0.5)
    );

    // <-- https://github.com/microsoft/vscode/tree/1.91.1/src/vs/editor/contrib/simbolIcons/browser/simbolIcons.ts -->

    const SYMBOL_ICON_ARRAY_FOREGROUND = this._registerColor(
      'symbolIcon.arrayForeground',
      foreground
    );
    const SYMBOL_ICON_BOOLEAN_FOREGROUND = this._registerColor(
      'symbolIcon.booleanForeground',
      foreground
    );
    const SYMBOL_ICON_CLASS_FOREGROUND = this._registerColor('symbolIcon.classForeground', {
      dark: '#EE9D28',
      light: '#D67E00',
      hcDark: '#EE9D28',
      hcLight: '#D67E00',
    });
    const SYMBOL_ICON_COLOR_FOREGROUND = this._registerColor(
      'symbolIcon.colorForeground',
      foreground
    );
    const SYMBOL_ICON_CONSTANT_FOREGROUND = this._registerColor(
      'symbolIcon.constantForeground',
      foreground
    );
    const SYMBOL_ICON_CONSTRUCTOR_FOREGROUND = this._registerColor(
      'symbolIcon.constructorForeground',
      { dark: '#B180D7', light: '#652D90', hcDark: '#B180D7', hcLight: '#652D90' }
    );
    const SYMBOL_ICON_ENUMERATOR_FOREGROUND = this._registerColor(
      'symbolIcon.enumeratorForeground',
      { dark: '#EE9D28', light: '#D67E00', hcDark: '#EE9D28', hcLight: '#D67E00' }
    );
    const SYMBOL_ICON_ENUMERATOR_MEMBER_FOREGROUND = this._registerColor(
      'symbolIcon.enumeratorMemberForeground',
      { dark: '#75BEFF', light: '#007ACC', hcDark: '#75BEFF', hcLight: '#007ACC' }
    );
    const SYMBOL_ICON_EVENT_FOREGROUND = this._registerColor('symbolIcon.eventForeground', {
      dark: '#EE9D28',
      light: '#D67E00',
      hcDark: '#EE9D28',
      hcLight: '#D67E00',
    });
    const SYMBOL_ICON_FIELD_FOREGROUND = this._registerColor('symbolIcon.fieldForeground', {
      dark: '#75BEFF',
      light: '#007ACC',
      hcDark: '#75BEFF',
      hcLight: '#007ACC',
    });
    const SYMBOL_ICON_FILE_FOREGROUND = this._registerColor(
      'symbolIcon.fileForeground',
      foreground
    );
    const SYMBOL_ICON_FOLDER_FOREGROUND = this._registerColor(
      'symbolIcon.folderForeground',
      foreground
    );
    const SYMBOL_ICON_FUNCTION_FOREGROUND = this._registerColor('symbolIcon.functionForeground', {
      dark: '#B180D7',
      light: '#652D90',
      hcDark: '#B180D7',
      hcLight: '#652D90',
    });
    const SYMBOL_ICON_INTERFACE_FOREGROUND = this._registerColor('symbolIcon.interfaceForeground', {
      dark: '#75BEFF',
      light: '#007ACC',
      hcDark: '#75BEFF',
      hcLight: '#007ACC',
    });
    const SYMBOL_ICON_KEY_FOREGROUND = this._registerColor('symbolIcon.keyForeground', foreground);
    const SYMBOL_ICON_KEYWORD_FOREGROUND = this._registerColor(
      'symbolIcon.keywordForeground',
      foreground
    );
    const SYMBOL_ICON_METHOD_FOREGROUND = this._registerColor('symbolIcon.methodForeground', {
      dark: '#B180D7',
      light: '#652D90',
      hcDark: '#B180D7',
      hcLight: '#652D90',
    });
    const SYMBOL_ICON_MODULE_FOREGROUND = this._registerColor(
      'symbolIcon.moduleForeground',
      foreground
    );
    const SYMBOL_ICON_NAMESPACE_FOREGROUND = this._registerColor(
      'symbolIcon.namespaceForeground',
      foreground
    );
    const SYMBOL_ICON_NULL_FOREGROUND = this._registerColor(
      'symbolIcon.nullForeground',
      foreground
    );
    const SYMBOL_ICON_NUMBER_FOREGROUND = this._registerColor(
      'symbolIcon.numberForeground',
      foreground
    );
    const SYMBOL_ICON_OBJECT_FOREGROUND = this._registerColor(
      'symbolIcon.objectForeground',
      foreground
    );
    const SYMBOL_ICON_OPERATOR_FOREGROUND = this._registerColor(
      'symbolIcon.operatorForeground',
      foreground
    );
    const SYMBOL_ICON_PACKAGE_FOREGROUND = this._registerColor(
      'symbolIcon.packageForeground',
      foreground
    );
    const SYMBOL_ICON_PROPERTY_FOREGROUND = this._registerColor(
      'symbolIcon.propertyForeground',
      foreground
    );
    const SYMBOL_ICON_REFERENCE_FOREGROUND = this._registerColor(
      'symbolIcon.referenceForeground',
      foreground
    );
    const SYMBOL_ICON_SNIPPET_FOREGROUND = this._registerColor(
      'symbolIcon.snippetForeground',
      foreground
    );
    const SYMBOL_ICON_STRING_FOREGROUND = this._registerColor(
      'symbolIcon.stringForeground',
      foreground
    );
    const SYMBOL_ICON_STRUCT_FOREGROUND = this._registerColor(
      'symbolIcon.structForeground',
      foreground
    );
    const SYMBOL_ICON_TEXT_FOREGROUND = this._registerColor(
      'symbolIcon.textForeground',
      foreground
    );
    const SYMBOL_ICON_TYPEPARAMETER_FOREGROUND = this._registerColor(
      'symbolIcon.typeParameterForeground',
      foreground
    );
    const SYMBOL_ICON_UNIT_FOREGROUND = this._registerColor(
      'symbolIcon.unitForeground',
      foreground
    );
    const SYMBOL_ICON_VARIABLE_FOREGROUND = this._registerColor('symbolIcon.variableForeground', {
      dark: '#75BEFF',
      light: '#007ACC',
      hcDark: '#75BEFF',
      hcLight: '#007ACC',
    });

    // <-- https://github.com/microsoft/vscode/tree/1.91.1/src/vs/editor/contrib/wordHighlighter/browser/highlightDecorations.ts -->

    const wordHighlightBackground = this._registerColor(
      'editor.wordHighlightBackground',
      { dark: '#575757B8', light: '#57575740', hcDark: null, hcLight: null },
      true
    );
    this._registerColor(
      'editor.wordHighlightStrongBackground',
      { dark: '#004972B8', light: '#0e639c40', hcDark: null, hcLight: null },
      true
    );
    this._registerColor('editor.wordHighlightTextBackground', wordHighlightBackground, true);
    const wordHighlightBorder = this._registerColor('editor.wordHighlightBorder', {
      light: null,
      dark: null,
      hcDark: activeContrastBorder,
      hcLight: activeContrastBorder,
    });
    this._registerColor('editor.wordHighlightStrongBorder', {
      light: null,
      dark: null,
      hcDark: activeContrastBorder,
      hcLight: activeContrastBorder,
    });
    this._registerColor('editor.wordHighlightTextBorder', wordHighlightBorder);
    const overviewRulerWordHighlightForeground = this._registerColor(
      'editorOverviewRuler.wordHighlightForeground',
      '#A0A0A0CC',
      true
    );
    const overviewRulerWordHighlightStrongForeground = this._registerColor(
      'editorOverviewRuler.wordHighlightStrongForeground',
      '#C0A0C0CC',
      true
    );
    const overviewRulerWordHighlightTextForeground = this._registerColor(
      'editorOverviewRuler.wordHighlightTextForeground',
      overviewRulerSelectionHighlightForeground,
      true
    );

    // <-- https://github.com/microsoft/vscode/tree/1.91.1/src/vs/platform/actionWidget/browser/actionWidget.ts -->

    this._registerColor('actionBar.toggledBackground', inputActiveOptionBackground);

    // <-- https://github.com/microsoft/vscode/tree/1.91.1/src/vs/workbench/browser/parts/editor/editorGroupWatermark.ts -->

    this._registerColor('editorWatermark.foreground', {
      dark: transparent(editorForeground, 0.6),
      light: transparent(editorForeground, 0.68),
      hcDark: editorForeground,
      hcLight: editorForeground,
    });

    // <-- https://github.com/microsoft/vscode/tree/1.91.1/src/vs/workbench/common/theme.ts -->

    const TAB_ACTIVE_BACKGROUND = this._registerColor('tab.activeBackground', editorBackground);
    const TAB_UNFOCUSED_ACTIVE_BACKGROUND = this._registerColor(
      'tab.unfocusedActiveBackground',
      TAB_ACTIVE_BACKGROUND
    );
    const TAB_INACTIVE_BACKGROUND = this._registerColor('tab.inactiveBackground', {
      dark: '#2D2D2D',
      light: '#ECECEC',
      hcDark: null,
      hcLight: null,
    });
    const TAB_UNFOCUSED_INACTIVE_BACKGROUND = this._registerColor(
      'tab.unfocusedInactiveBackground',
      TAB_INACTIVE_BACKGROUND
    );
    const TAB_ACTIVE_FOREGROUND = this._registerColor('tab.activeForeground', {
      dark: Color.white,
      light: '#333333',
      hcDark: Color.white,
      hcLight: '#292929',
    });
    const TAB_INACTIVE_FOREGROUND = this._registerColor('tab.inactiveForeground', {
      dark: transparent(TAB_ACTIVE_FOREGROUND, 0.5),
      light: transparent(TAB_ACTIVE_FOREGROUND, 0.7),
      hcDark: Color.white,
      hcLight: '#292929',
    });
    const TAB_UNFOCUSED_ACTIVE_FOREGROUND = this._registerColor('tab.unfocusedActiveForeground', {
      dark: transparent(TAB_ACTIVE_FOREGROUND, 0.5),
      light: transparent(TAB_ACTIVE_FOREGROUND, 0.7),
      hcDark: Color.white,
      hcLight: '#292929',
    });
    const TAB_UNFOCUSED_INACTIVE_FOREGROUND = this._registerColor(
      'tab.unfocusedInactiveForeground',
      {
        dark: transparent(TAB_INACTIVE_FOREGROUND, 0.5),
        light: transparent(TAB_INACTIVE_FOREGROUND, 0.5),
        hcDark: Color.white,
        hcLight: '#292929',
      }
    );
    const TAB_HOVER_BACKGROUND = this._registerColor('tab.hoverBackground', null);
    const TAB_UNFOCUSED_HOVER_BACKGROUND = this._registerColor('tab.unfocusedHoverBackground', {
      dark: transparent(TAB_HOVER_BACKGROUND, 0.5),
      light: transparent(TAB_HOVER_BACKGROUND, 0.7),
      hcDark: null,
      hcLight: null,
    });
    const TAB_HOVER_FOREGROUND = this._registerColor('tab.hoverForeground', null);
    const TAB_UNFOCUSED_HOVER_FOREGROUND = this._registerColor('tab.unfocusedHoverForeground', {
      dark: transparent(TAB_HOVER_FOREGROUND, 0.5),
      light: transparent(TAB_HOVER_FOREGROUND, 0.5),
      hcDark: null,
      hcLight: null,
    });
    const TAB_BORDER = this._registerColor('tab.border', {
      dark: '#252526',
      light: '#F3F3F3',
      hcDark: contrastBorder,
      hcLight: contrastBorder,
    });
    const TAB_LAST_PINNED_BORDER = this._registerColor('tab.lastPinnedBorder', {
      dark: treeIndentGuidesStroke,
      light: treeIndentGuidesStroke,
      hcDark: contrastBorder,
      hcLight: contrastBorder,
    });
    const TAB_ACTIVE_BORDER = this._registerColor('tab.activeBorder', null);
    const TAB_UNFOCUSED_ACTIVE_BORDER = this._registerColor('tab.unfocusedActiveBorder', {
      dark: transparent(TAB_ACTIVE_BORDER, 0.5),
      light: transparent(TAB_ACTIVE_BORDER, 0.7),
      hcDark: null,
      hcLight: null,
    });
    const TAB_ACTIVE_BORDER_TOP = this._registerColor('tab.activeBorderTop', {
      dark: null,
      light: null,
      hcDark: null,
      hcLight: '#B5200D',
    });
    const TAB_UNFOCUSED_ACTIVE_BORDER_TOP = this._registerColor('tab.unfocusedActiveBorderTop', {
      dark: transparent(TAB_ACTIVE_BORDER_TOP, 0.5),
      light: transparent(TAB_ACTIVE_BORDER_TOP, 0.7),
      hcDark: null,
      hcLight: '#B5200D',
    });
    const TAB_SELECTED_BORDER_TOP = this._registerColor(
      'tab.selectedBorderTop',
      TAB_ACTIVE_BORDER_TOP
    );
    const TAB_SELECTED_BACKGROUND = this._registerColor(
      'tab.selectedBackground',
      TAB_ACTIVE_BACKGROUND
    );
    const TAB_SELECTED_FOREGROUND = this._registerColor(
      'tab.selectedForeground',
      TAB_ACTIVE_FOREGROUND
    );
    const TAB_HOVER_BORDER = this._registerColor('tab.hoverBorder', null);
    const TAB_UNFOCUSED_HOVER_BORDER = this._registerColor('tab.unfocusedHoverBorder', {
      dark: transparent(TAB_HOVER_BORDER, 0.5),
      light: transparent(TAB_HOVER_BORDER, 0.7),
      hcDark: null,
      hcLight: contrastBorder,
    });
    const TAB_DRAG_AND_DROP_BORDER = this._registerColor('tab.dragAndDropBorder', {
      dark: TAB_ACTIVE_FOREGROUND,
      light: TAB_ACTIVE_FOREGROUND,
      hcDark: activeContrastBorder,
      hcLight: activeContrastBorder,
    });
    const TAB_ACTIVE_MODIFIED_BORDER = this._registerColor('tab.activeModifiedBorder', {
      dark: '#3399CC',
      light: '#33AAEE',
      hcDark: null,
      hcLight: contrastBorder,
    });
    const TAB_INACTIVE_MODIFIED_BORDER = this._registerColor('tab.inactiveModifiedBorder', {
      dark: transparent(TAB_ACTIVE_MODIFIED_BORDER, 0.5),
      light: transparent(TAB_ACTIVE_MODIFIED_BORDER, 0.5),
      hcDark: Color.white,
      hcLight: contrastBorder,
    });
    const TAB_UNFOCUSED_ACTIVE_MODIFIED_BORDER = this._registerColor(
      'tab.unfocusedActiveModifiedBorder',
      {
        dark: transparent(TAB_ACTIVE_MODIFIED_BORDER, 0.5),
        light: transparent(TAB_ACTIVE_MODIFIED_BORDER, 0.7),
        hcDark: Color.white,
        hcLight: contrastBorder,
      }
    );
    const TAB_UNFOCUSED_INACTIVE_MODIFIED_BORDER = this._registerColor(
      'tab.unfocusedInactiveModifiedBorder',
      {
        dark: transparent(TAB_INACTIVE_MODIFIED_BORDER, 0.5),
        light: transparent(TAB_INACTIVE_MODIFIED_BORDER, 0.5),
        hcDark: Color.white,
        hcLight: contrastBorder,
      }
    );
    const EDITOR_PANE_BACKGROUND = this._registerColor('editorPane.background', editorBackground);
    const EDITOR_GROUP_EMPTY_BACKGROUND = this._registerColor('editorGroup.emptyBackground', null);
    const EDITOR_GROUP_FOCUSED_EMPTY_BORDER = this._registerColor(
      'editorGroup.focusedEmptyBorder',
      { dark: null, light: null, hcDark: focusBorder, hcLight: focusBorder }
    );
    const EDITOR_GROUP_HEADER_TABS_BACKGROUND = this._registerColor(
      'editorGroupHeader.tabsBackground',
      { dark: '#252526', light: '#F3F3F3', hcDark: null, hcLight: null }
    );
    const EDITOR_GROUP_HEADER_TABS_BORDER = this._registerColor(
      'editorGroupHeader.tabsBorder',
      null
    );
    const EDITOR_GROUP_HEADER_NO_TABS_BACKGROUND = this._registerColor(
      'editorGroupHeader.noTabsBackground',
      editorBackground
    );
    const EDITOR_GROUP_HEADER_BORDER = this._registerColor('editorGroupHeader.border', {
      dark: null,
      light: null,
      hcDark: contrastBorder,
      hcLight: contrastBorder,
    });
    const EDITOR_GROUP_BORDER = this._registerColor('editorGroup.border', {
      dark: '#444444',
      light: '#E7E7E7',
      hcDark: contrastBorder,
      hcLight: contrastBorder,
    });
    const EDITOR_DRAG_AND_DROP_BACKGROUND = this._registerColor('editorGroup.dropBackground', {
      dark: Color.fromHex('#53595D').transparent(0.5),
      light: Color.fromHex('#2677CB').transparent(0.18),
      hcDark: null,
      hcLight: Color.fromHex('#0F4A85').transparent(0.5),
    });
    const EDITOR_DROP_INTO_PROMPT_FOREGROUND = this._registerColor(
      'editorGroup.dropIntoPromptForeground',
      editorWidgetForeground
    );
    const EDITOR_DROP_INTO_PROMPT_BACKGROUND = this._registerColor(
      'editorGroup.dropIntoPromptBackground',
      editorWidgetBackground
    );
    const EDITOR_DROP_INTO_PROMPT_BORDER = this._registerColor('editorGroup.dropIntoPromptBorder', {
      dark: null,
      light: null,
      hcDark: contrastBorder,
      hcLight: contrastBorder,
    });
    const SIDE_BY_SIDE_EDITOR_HORIZONTAL_BORDER = this._registerColor(
      'sideBySideEditor.horizontalBorder',
      EDITOR_GROUP_BORDER
    );
    const SIDE_BY_SIDE_EDITOR_VERTICAL_BORDER = this._registerColor(
      'sideBySideEditor.verticalBorder',
      EDITOR_GROUP_BORDER
    );
    const PANEL_BACKGROUND = this._registerColor('panel.background', editorBackground);
    const PANEL_BORDER = this._registerColor('panel.border', {
      dark: Color.fromHex('#808080').transparent(0.35),
      light: Color.fromHex('#808080').transparent(0.35),
      hcDark: contrastBorder,
      hcLight: contrastBorder,
    });
    const PANEL_ACTIVE_TITLE_FOREGROUND = this._registerColor('panelTitle.activeForeground', {
      dark: '#E7E7E7',
      light: '#424242',
      hcDark: Color.white,
      hcLight: editorForeground,
    });
    const PANEL_INACTIVE_TITLE_FOREGROUND = this._registerColor('panelTitle.inactiveForeground', {
      dark: transparent(PANEL_ACTIVE_TITLE_FOREGROUND, 0.6),
      light: transparent(PANEL_ACTIVE_TITLE_FOREGROUND, 0.75),
      hcDark: Color.white,
      hcLight: editorForeground,
    });
    const PANEL_ACTIVE_TITLE_BORDER = this._registerColor('panelTitle.activeBorder', {
      dark: PANEL_ACTIVE_TITLE_FOREGROUND,
      light: PANEL_ACTIVE_TITLE_FOREGROUND,
      hcDark: contrastBorder,
      hcLight: '#B5200D',
    });
    const PANEL_INPUT_BORDER = this._registerColor('panelInput.border', {
      dark: inputBorder,
      light: Color.fromHex('#ddd'),
      hcDark: inputBorder,
      hcLight: inputBorder,
    });
    const PANEL_DRAG_AND_DROP_BORDER = this._registerColor(
      'panel.dropBorder',
      PANEL_ACTIVE_TITLE_FOREGROUND
    );
    const PANEL_SECTION_DRAG_AND_DROP_BACKGROUND = this._registerColor(
      'panelSection.dropBackground',
      EDITOR_DRAG_AND_DROP_BACKGROUND
    );
    const PANEL_SECTION_HEADER_BACKGROUND = this._registerColor('panelSectionHeader.background', {
      dark: Color.fromHex('#808080').transparent(0.2),
      light: Color.fromHex('#808080').transparent(0.2),
      hcDark: null,
      hcLight: null,
    });
    const PANEL_SECTION_HEADER_FOREGROUND = this._registerColor(
      'panelSectionHeader.foreground',
      null
    );
    const PANEL_SECTION_HEADER_BORDER = this._registerColor(
      'panelSectionHeader.border',
      contrastBorder
    );
    const PANEL_SECTION_BORDER = this._registerColor('panelSection.border', PANEL_BORDER);
    const PANEL_STICKY_SCROLL_BACKGROUND = this._registerColor(
      'panelStickyScroll.background',
      PANEL_BACKGROUND
    );
    const PANEL_STICKY_SCROLL_BORDER = this._registerColor('panelStickyScroll.border', null);
    const PANEL_STICKY_SCROLL_SHADOW = this._registerColor(
      'panelStickyScroll.shadow',
      scrollbarShadow
    );
    const OUTPUT_VIEW_BACKGROUND = this._registerColor('outputView.background', null);
    this._registerColor('outputViewStickyScroll.background', OUTPUT_VIEW_BACKGROUND);
    const BANNER_BACKGROUND = this._registerColor('banner.background', {
      dark: listActiveSelectionBackground,
      light: darken(listActiveSelectionBackground, 0.3),
      hcDark: listActiveSelectionBackground,
      hcLight: listActiveSelectionBackground,
    });
    const BANNER_FOREGROUND = this._registerColor(
      'banner.foreground',
      listActiveSelectionForeground
    );
    const BANNER_ICON_FOREGROUND = this._registerColor(
      'banner.iconForeground',
      editorInfoForeground
    );
    const STATUS_BAR_FOREGROUND = this._registerColor('statusBar.foreground', {
      dark: '#FFFFFF',
      light: '#FFFFFF',
      hcDark: '#FFFFFF',
      hcLight: editorForeground,
    });
    const STATUS_BAR_NO_FOLDER_FOREGROUND = this._registerColor(
      'statusBar.noFolderForeground',
      STATUS_BAR_FOREGROUND
    );
    const STATUS_BAR_BACKGROUND = this._registerColor('statusBar.background', {
      dark: '#007ACC',
      light: '#007ACC',
      hcDark: null,
      hcLight: null,
    });
    const STATUS_BAR_NO_FOLDER_BACKGROUND = this._registerColor('statusBar.noFolderBackground', {
      dark: '#68217A',
      light: '#68217A',
      hcDark: null,
      hcLight: null,
    });
    const STATUS_BAR_BORDER = this._registerColor('statusBar.border', {
      dark: null,
      light: null,
      hcDark: contrastBorder,
      hcLight: contrastBorder,
    });
    const STATUS_BAR_FOCUS_BORDER = this._registerColor('statusBar.focusBorder', {
      dark: STATUS_BAR_FOREGROUND,
      light: STATUS_BAR_FOREGROUND,
      hcDark: null,
      hcLight: STATUS_BAR_FOREGROUND,
    });
    const STATUS_BAR_NO_FOLDER_BORDER = this._registerColor(
      'statusBar.noFolderBorder',
      STATUS_BAR_BORDER
    );
    const STATUS_BAR_ITEM_ACTIVE_BACKGROUND = this._registerColor(
      'statusBarItem.activeBackground',
      {
        dark: Color.white.transparent(0.18),
        light: Color.white.transparent(0.18),
        hcDark: Color.white.transparent(0.18),
        hcLight: Color.black.transparent(0.18),
      }
    );
    const STATUS_BAR_ITEM_FOCUS_BORDER = this._registerColor('statusBarItem.focusBorder', {
      dark: STATUS_BAR_FOREGROUND,
      light: STATUS_BAR_FOREGROUND,
      hcDark: null,
      hcLight: activeContrastBorder,
    });
    const STATUS_BAR_ITEM_HOVER_BACKGROUND = this._registerColor('statusBarItem.hoverBackground', {
      dark: Color.white.transparent(0.12),
      light: Color.white.transparent(0.12),
      hcDark: Color.white.transparent(0.12),
      hcLight: Color.black.transparent(0.12),
    });
    const STATUS_BAR_ITEM_HOVER_FOREGROUND = this._registerColor(
      'statusBarItem.hoverForeground',
      STATUS_BAR_FOREGROUND
    );
    const STATUS_BAR_ITEM_COMPACT_HOVER_BACKGROUND = this._registerColor(
      'statusBarItem.compactHoverBackground',
      {
        dark: Color.white.transparent(0.2),
        light: Color.white.transparent(0.2),
        hcDark: Color.white.transparent(0.2),
        hcLight: Color.black.transparent(0.2),
      }
    );
    const STATUS_BAR_PROMINENT_ITEM_FOREGROUND = this._registerColor(
      'statusBarItem.prominentForeground',
      STATUS_BAR_FOREGROUND
    );
    const STATUS_BAR_PROMINENT_ITEM_BACKGROUND = this._registerColor(
      'statusBarItem.prominentBackground',
      Color.black.transparent(0.5)
    );
    const STATUS_BAR_PROMINENT_ITEM_HOVER_FOREGROUND = this._registerColor(
      'statusBarItem.prominentHoverForeground',
      STATUS_BAR_ITEM_HOVER_FOREGROUND
    );
    const STATUS_BAR_PROMINENT_ITEM_HOVER_BACKGROUND = this._registerColor(
      'statusBarItem.prominentHoverBackground',
      {
        dark: Color.black.transparent(0.3),
        light: Color.black.transparent(0.3),
        hcDark: Color.black.transparent(0.3),
        hcLight: null,
      }
    );
    const STATUS_BAR_ERROR_ITEM_BACKGROUND = this._registerColor('statusBarItem.errorBackground', {
      dark: darken(errorForeground, 0.4),
      light: darken(errorForeground, 0.4),
      hcDark: null,
      hcLight: '#B5200D',
    });
    const STATUS_BAR_ERROR_ITEM_FOREGROUND = this._registerColor(
      'statusBarItem.errorForeground',
      Color.white
    );
    const STATUS_BAR_ERROR_ITEM_HOVER_FOREGROUND = this._registerColor(
      'statusBarItem.errorHoverForeground',
      STATUS_BAR_ITEM_HOVER_FOREGROUND
    );
    const STATUS_BAR_ERROR_ITEM_HOVER_BACKGROUND = this._registerColor(
      'statusBarItem.errorHoverBackground',
      STATUS_BAR_ITEM_HOVER_BACKGROUND
    );
    const STATUS_BAR_WARNING_ITEM_BACKGROUND = this._registerColor(
      'statusBarItem.warningBackground',
      {
        dark: darken(editorWarningForeground, 0.4),
        light: darken(editorWarningForeground, 0.4),
        hcDark: null,
        hcLight: '#895503',
      }
    );
    const STATUS_BAR_WARNING_ITEM_FOREGROUND = this._registerColor(
      'statusBarItem.warningForeground',
      Color.white
    );
    const STATUS_BAR_WARNING_ITEM_HOVER_FOREGROUND = this._registerColor(
      'statusBarItem.warningHoverForeground',
      STATUS_BAR_ITEM_HOVER_FOREGROUND
    );
    const STATUS_BAR_WARNING_ITEM_HOVER_BACKGROUND = this._registerColor(
      'statusBarItem.warningHoverBackground',
      STATUS_BAR_ITEM_HOVER_BACKGROUND
    );
    const ACTIVITY_BAR_BACKGROUND = this._registerColor('activityBar.background', {
      dark: '#333333',
      light: '#2C2C2C',
      hcDark: '#000000',
      hcLight: '#FFFFFF',
    });
    const ACTIVITY_BAR_FOREGROUND = this._registerColor('activityBar.foreground', {
      dark: Color.white,
      light: Color.white,
      hcDark: Color.white,
      hcLight: editorForeground,
    });
    const ACTIVITY_BAR_INACTIVE_FOREGROUND = this._registerColor('activityBar.inactiveForeground', {
      dark: transparent(ACTIVITY_BAR_FOREGROUND, 0.4),
      light: transparent(ACTIVITY_BAR_FOREGROUND, 0.4),
      hcDark: Color.white,
      hcLight: editorForeground,
    });
    const ACTIVITY_BAR_BORDER = this._registerColor('activityBar.border', {
      dark: null,
      light: null,
      hcDark: contrastBorder,
      hcLight: contrastBorder,
    });
    const ACTIVITY_BAR_ACTIVE_BORDER = this._registerColor('activityBar.activeBorder', {
      dark: ACTIVITY_BAR_FOREGROUND,
      light: ACTIVITY_BAR_FOREGROUND,
      hcDark: contrastBorder,
      hcLight: contrastBorder,
    });
    const ACTIVITY_BAR_ACTIVE_FOCUS_BORDER = this._registerColor('activityBar.activeFocusBorder', {
      dark: null,
      light: null,
      hcDark: null,
      hcLight: '#B5200D',
    });
    const ACTIVITY_BAR_ACTIVE_BACKGROUND = this._registerColor(
      'activityBar.activeBackground',
      null
    );
    const ACTIVITY_BAR_DRAG_AND_DROP_BORDER = this._registerColor('activityBar.dropBorder', {
      dark: ACTIVITY_BAR_FOREGROUND,
      light: ACTIVITY_BAR_FOREGROUND,
      hcDark: null,
      hcLight: null,
    });
    const ACTIVITY_BAR_BADGE_BACKGROUND = this._registerColor('activityBarBadge.background', {
      dark: '#007ACC',
      light: '#007ACC',
      hcDark: '#000000',
      hcLight: '#0F4A85',
    });
    const ACTIVITY_BAR_BADGE_FOREGROUND = this._registerColor(
      'activityBarBadge.foreground',
      Color.white
    );
    const ACTIVITY_BAR_TOP_FOREGROUND = this._registerColor('activityBarTop.foreground', {
      dark: '#E7E7E7',
      light: '#424242',
      hcDark: Color.white,
      hcLight: editorForeground,
    });
    const ACTIVITY_BAR_TOP_ACTIVE_BORDER = this._registerColor('activityBarTop.activeBorder', {
      dark: ACTIVITY_BAR_TOP_FOREGROUND,
      light: ACTIVITY_BAR_TOP_FOREGROUND,
      hcDark: contrastBorder,
      hcLight: '#B5200D',
    });
    const ACTIVITY_BAR_TOP_ACTIVE_BACKGROUND = this._registerColor(
      'activityBarTop.activeBackground',
      null
    );
    const ACTIVITY_BAR_TOP_INACTIVE_FOREGROUND = this._registerColor(
      'activityBarTop.inactiveForeground',
      {
        dark: transparent(ACTIVITY_BAR_TOP_FOREGROUND, 0.6),
        light: transparent(ACTIVITY_BAR_TOP_FOREGROUND, 0.75),
        hcDark: Color.white,
        hcLight: editorForeground,
      }
    );
    const ACTIVITY_BAR_TOP_DRAG_AND_DROP_BORDER = this._registerColor(
      'activityBarTop.dropBorder',
      ACTIVITY_BAR_TOP_FOREGROUND
    );
    const ACTIVITY_BAR_TOP_BACKGROUND = this._registerColor('activityBarTop.background', null);
    const PROFILE_BADGE_BACKGROUND = this._registerColor('profileBadge.background', {
      dark: '#4D4D4D',
      light: '#C4C4C4',
      hcDark: Color.white,
      hcLight: Color.black,
    });
    const PROFILE_BADGE_FOREGROUND = this._registerColor('profileBadge.foreground', {
      dark: Color.white,
      light: '#333333',
      hcDark: Color.black,
      hcLight: Color.white,
    });
    const STATUS_BAR_REMOTE_ITEM_BACKGROUND = this._registerColor(
      'statusBarItem.remoteBackground',
      ACTIVITY_BAR_BADGE_BACKGROUND
    );
    const STATUS_BAR_REMOTE_ITEM_FOREGROUND = this._registerColor(
      'statusBarItem.remoteForeground',
      ACTIVITY_BAR_BADGE_FOREGROUND
    );
    const STATUS_BAR_REMOTE_ITEM_HOVER_FOREGROUND = this._registerColor(
      'statusBarItem.remoteHoverForeground',
      STATUS_BAR_ITEM_HOVER_FOREGROUND
    );
    const STATUS_BAR_REMOTE_ITEM_HOVER_BACKGROUND = this._registerColor(
      'statusBarItem.remoteHoverBackground',
      {
        dark: STATUS_BAR_ITEM_HOVER_BACKGROUND,
        light: STATUS_BAR_ITEM_HOVER_BACKGROUND,
        hcDark: STATUS_BAR_ITEM_HOVER_BACKGROUND,
        hcLight: null,
      }
    );
    const STATUS_BAR_OFFLINE_ITEM_BACKGROUND = this._registerColor(
      'statusBarItem.offlineBackground',
      '#6c1717'
    );
    const STATUS_BAR_OFFLINE_ITEM_FOREGROUND = this._registerColor(
      'statusBarItem.offlineForeground',
      STATUS_BAR_REMOTE_ITEM_FOREGROUND
    );
    const STATUS_BAR_OFFLINE_ITEM_HOVER_FOREGROUND = this._registerColor(
      'statusBarItem.offlineHoverForeground',
      STATUS_BAR_ITEM_HOVER_FOREGROUND
    );
    const STATUS_BAR_OFFLINE_ITEM_HOVER_BACKGROUND = this._registerColor(
      'statusBarItem.offlineHoverBackground',
      {
        dark: STATUS_BAR_ITEM_HOVER_BACKGROUND,
        light: STATUS_BAR_ITEM_HOVER_BACKGROUND,
        hcDark: STATUS_BAR_ITEM_HOVER_BACKGROUND,
        hcLight: null,
      }
    );
    const EXTENSION_BADGE_REMOTE_BACKGROUND = this._registerColor(
      'extensionBadge.remoteBackground',
      ACTIVITY_BAR_BADGE_BACKGROUND
    );
    const EXTENSION_BADGE_REMOTE_FOREGROUND = this._registerColor(
      'extensionBadge.remoteForeground',
      ACTIVITY_BAR_BADGE_FOREGROUND
    );
    const SIDE_BAR_BACKGROUND = this._registerColor('sideBar.background', {
      dark: '#252526',
      light: '#F3F3F3',
      hcDark: '#000000',
      hcLight: '#FFFFFF',
    });
    const SIDE_BAR_FOREGROUND = this._registerColor('sideBar.foreground', null);
    const SIDE_BAR_BORDER = this._registerColor('sideBar.border', {
      dark: null,
      light: null,
      hcDark: contrastBorder,
      hcLight: contrastBorder,
    });
    const SIDE_BAR_TITLE_BACKGROUND = this._registerColor(
      'sideBarTitle.background',
      SIDE_BAR_BACKGROUND
    );
    const SIDE_BAR_TITLE_FOREGROUND = this._registerColor(
      'sideBarTitle.foreground',
      SIDE_BAR_FOREGROUND
    );
    const SIDE_BAR_DRAG_AND_DROP_BACKGROUND = this._registerColor(
      'sideBar.dropBackground',
      EDITOR_DRAG_AND_DROP_BACKGROUND
    );
    const SIDE_BAR_SECTION_HEADER_BACKGROUND = this._registerColor(
      'sideBarSectionHeader.background',
      {
        dark: Color.fromHex('#808080').transparent(0.2),
        light: Color.fromHex('#808080').transparent(0.2),
        hcDark: null,
        hcLight: null,
      }
    );
    const SIDE_BAR_SECTION_HEADER_FOREGROUND = this._registerColor(
      'sideBarSectionHeader.foreground',
      SIDE_BAR_FOREGROUND
    );
    const SIDE_BAR_SECTION_HEADER_BORDER = this._registerColor(
      'sideBarSectionHeader.border',
      contrastBorder
    );
    const ACTIVITY_BAR_TOP_BORDER = this._registerColor(
      'sideBarActivityBarTop.border',
      SIDE_BAR_SECTION_HEADER_BORDER
    );
    const SIDE_BAR_STICKY_SCROLL_BACKGROUND = this._registerColor(
      'sideBarStickyScroll.background',
      SIDE_BAR_BACKGROUND
    );
    const SIDE_BAR_STICKY_SCROLL_BORDER = this._registerColor('sideBarStickyScroll.border', null);
    const SIDE_BAR_STICKY_SCROLL_SHADOW = this._registerColor(
      'sideBarStickyScroll.shadow',
      scrollbarShadow
    );
    const TITLE_BAR_ACTIVE_FOREGROUND = this._registerColor('titleBar.activeForeground', {
      dark: '#CCCCCC',
      light: '#333333',
      hcDark: '#FFFFFF',
      hcLight: '#292929',
    });
    const TITLE_BAR_INACTIVE_FOREGROUND = this._registerColor('titleBar.inactiveForeground', {
      dark: transparent(TITLE_BAR_ACTIVE_FOREGROUND, 0.6),
      light: transparent(TITLE_BAR_ACTIVE_FOREGROUND, 0.6),
      hcDark: null,
      hcLight: '#292929',
    });
    const TITLE_BAR_ACTIVE_BACKGROUND = this._registerColor('titleBar.activeBackground', {
      dark: '#3C3C3C',
      light: '#DDDDDD',
      hcDark: '#000000',
      hcLight: '#FFFFFF',
    });
    const TITLE_BAR_INACTIVE_BACKGROUND = this._registerColor('titleBar.inactiveBackground', {
      dark: transparent(TITLE_BAR_ACTIVE_BACKGROUND, 0.6),
      light: transparent(TITLE_BAR_ACTIVE_BACKGROUND, 0.6),
      hcDark: null,
      hcLight: null,
    });
    const TITLE_BAR_BORDER = this._registerColor('titleBar.border', {
      dark: null,
      light: null,
      hcDark: contrastBorder,
      hcLight: contrastBorder,
    });
    const MENUBAR_SELECTION_FOREGROUND = this._registerColor(
      'menubar.selectionForeground',
      TITLE_BAR_ACTIVE_FOREGROUND
    );
    const MENUBAR_SELECTION_BACKGROUND = this._registerColor('menubar.selectionBackground', {
      dark: toolbarHoverBackground,
      light: toolbarHoverBackground,
      hcDark: null,
      hcLight: null,
    });
    const MENUBAR_SELECTION_BORDER = this._registerColor('menubar.selectionBorder', {
      dark: null,
      light: null,
      hcDark: activeContrastBorder,
      hcLight: activeContrastBorder,
    });
    const COMMAND_CENTER_FOREGROUND = this._registerColor(
      'commandCenter.foreground',
      TITLE_BAR_ACTIVE_FOREGROUND
    );
    const COMMAND_CENTER_ACTIVEFOREGROUND = this._registerColor(
      'commandCenter.activeForeground',
      MENUBAR_SELECTION_FOREGROUND
    );
    const COMMAND_CENTER_INACTIVEFOREGROUND = this._registerColor(
      'commandCenter.inactiveForeground',
      TITLE_BAR_INACTIVE_FOREGROUND
    );
    const COMMAND_CENTER_BACKGROUND = this._registerColor('commandCenter.background', {
      dark: Color.white.transparent(0.05),
      hcDark: null,
      light: Color.black.transparent(0.05),
      hcLight: null,
    });
    const COMMAND_CENTER_ACTIVEBACKGROUND = this._registerColor('commandCenter.activeBackground', {
      dark: Color.white.transparent(0.08),
      hcDark: MENUBAR_SELECTION_BACKGROUND,
      light: Color.black.transparent(0.08),
      hcLight: MENUBAR_SELECTION_BACKGROUND,
    });
    const COMMAND_CENTER_BORDER = this._registerColor('commandCenter.border', {
      dark: transparent(TITLE_BAR_ACTIVE_FOREGROUND, 0.2),
      hcDark: contrastBorder,
      light: transparent(TITLE_BAR_ACTIVE_FOREGROUND, 0.2),
      hcLight: contrastBorder,
    });
    const COMMAND_CENTER_ACTIVEBORDER = this._registerColor('commandCenter.activeBorder', {
      dark: transparent(TITLE_BAR_ACTIVE_FOREGROUND, 0.3),
      hcDark: TITLE_BAR_ACTIVE_FOREGROUND,
      light: transparent(TITLE_BAR_ACTIVE_FOREGROUND, 0.3),
      hcLight: TITLE_BAR_ACTIVE_FOREGROUND,
    });
    const COMMAND_CENTER_INACTIVEBORDER = this._registerColor(
      'commandCenter.inactiveBorder',
      transparent(TITLE_BAR_INACTIVE_FOREGROUND, 0.25)
    );
    const NOTIFICATIONS_CENTER_BORDER = this._registerColor('notificationCenter.border', {
      dark: widgetBorder,
      light: widgetBorder,
      hcDark: contrastBorder,
      hcLight: contrastBorder,
    });
    const NOTIFICATIONS_TOAST_BORDER = this._registerColor('notificationToast.border', {
      dark: widgetBorder,
      light: widgetBorder,
      hcDark: contrastBorder,
      hcLight: contrastBorder,
    });
    const NOTIFICATIONS_FOREGROUND = this._registerColor(
      'notifications.foreground',
      editorWidgetForeground
    );
    const NOTIFICATIONS_BACKGROUND = this._registerColor(
      'notifications.background',
      editorWidgetBackground
    );
    const NOTIFICATIONS_LINKS = this._registerColor(
      'notificationLink.foreground',
      textLinkForeground
    );
    const NOTIFICATIONS_CENTER_HEADER_FOREGROUND = this._registerColor(
      'notificationCenterHeader.foreground',
      null
    );
    const NOTIFICATIONS_CENTER_HEADER_BACKGROUND = this._registerColor(
      'notificationCenterHeader.background',
      {
        dark: lighten(NOTIFICATIONS_BACKGROUND, 0.3),
        light: darken(NOTIFICATIONS_BACKGROUND, 0.05),
        hcDark: NOTIFICATIONS_BACKGROUND,
        hcLight: NOTIFICATIONS_BACKGROUND,
      }
    );
    const NOTIFICATIONS_BORDER = this._registerColor(
      'notifications.border',
      NOTIFICATIONS_CENTER_HEADER_BACKGROUND
    );
    const NOTIFICATIONS_ERROR_ICON_FOREGROUND = this._registerColor(
      'notificationsErrorIcon.foreground',
      editorErrorForeground
    );
    const NOTIFICATIONS_WARNING_ICON_FOREGROUND = this._registerColor(
      'notificationsWarningIcon.foreground',
      editorWarningForeground
    );
    const NOTIFICATIONS_INFO_ICON_FOREGROUND = this._registerColor(
      'notificationsInfoIcon.foreground',
      editorInfoForeground
    );
    const WINDOW_ACTIVE_BORDER = this._registerColor('window.activeBorder', {
      dark: null,
      light: null,
      hcDark: contrastBorder,
      hcLight: contrastBorder,
    });
    const WINDOW_INACTIVE_BORDER = this._registerColor('window.inactiveBorder', {
      dark: null,
      light: null,
      hcDark: contrastBorder,
      hcLight: contrastBorder,
    });

    // <-- https://github.com/microsoft/vscode/tree/1.91.1/src/vs/workbench/contrib/chat/common/chatColors.ts -->

    const chatRequestBorder = this._registerColor('chat.requestBorder', {
      dark: new Color(new RGBA(255, 255, 255, 0.1)),
      light: new Color(new RGBA(0, 0, 0, 0.1)),
      hcDark: contrastBorder,
      hcLight: contrastBorder,
    });
    const chatRequestBackground = this._registerColor('chat.requestBackground', {
      dark: transparent(editorBackground, 0.62),
      light: transparent(editorBackground, 0.62),
      hcDark: editorWidgetBackground,
      hcLight: null,
    });
    const chatSlashCommandBackground = this._registerColor('chat.slashCommandBackground', {
      dark: '#34414b8f',
      light: '#d2ecff99',
      hcDark: Color.white,
      hcLight: badgeBackground,
    });
    const chatSlashCommandForeground = this._registerColor('chat.slashCommandForeground', {
      dark: '#40A6FF',
      light: '#306CA2',
      hcDark: Color.black,
      hcLight: badgeForeground,
    });
    const chatAvatarBackground = this._registerColor('chat.avatarBackground', {
      dark: '#1f1f1f',
      light: '#f2f2f2',
      hcDark: Color.black,
      hcLight: Color.white,
    });
    const chatAvatarForeground = this._registerColor('chat.avatarForeground', foreground);

    // <-- https://github.com/microsoft/vscode/tree/1.91.1/src/vs/workbench/contrib/codeEditor/browser/find/simpleFindWidget.ts -->

    const simpleFindWidgetSashBorder = this._registerColor('simpleFindWidget.sashBorder', {
      dark: '#454545',
      light: '#C8C8C8',
      hcDark: '#6FC3DF',
      hcLight: '#0F4A85',
    });

    // <-- https://github.com/microsoft/vscode/tree/1.91.1/src/vs/workbench/contrib/comments/browser/commentColors.ts -->

    const resolvedCommentViewIcon = this._registerColor('commentsView.resolvedIcon', {
      dark: disabledForeground,
      light: disabledForeground,
      hcDark: contrastBorder,
      hcLight: contrastBorder,
    });
    const unresolvedCommentViewIcon = this._registerColor('commentsView.unresolvedIcon', {
      dark: listFocusOutline,
      light: listFocusOutline,
      hcDark: contrastBorder,
      hcLight: contrastBorder,
    });
    this._registerColor('editorCommentsWidget.replyInputBackground', peekViewTitleBackground);
    const resolvedCommentBorder = this._registerColor('editorCommentsWidget.resolvedBorder', {
      dark: resolvedCommentViewIcon,
      light: resolvedCommentViewIcon,
      hcDark: contrastBorder,
      hcLight: contrastBorder,
    });
    const unresolvedCommentBorder = this._registerColor('editorCommentsWidget.unresolvedBorder', {
      dark: unresolvedCommentViewIcon,
      light: unresolvedCommentViewIcon,
      hcDark: contrastBorder,
      hcLight: contrastBorder,
    });
    const commentThreadRangeBackground = this._registerColor(
      'editorCommentsWidget.rangeBackground',
      transparent(unresolvedCommentBorder, 0.1)
    );
    const commentThreadRangeActiveBackground = this._registerColor(
      'editorCommentsWidget.rangeActiveBackground',
      transparent(unresolvedCommentBorder, 0.1)
    );

    // <-- https://github.com/microsoft/vscode/tree/1.91.1/src/vs/workbench/contrib/comments/browser/commentglyphWidget.ts -->

    const overviewRulerCommentingRangeForeground = this._registerColor(
      'editorGutter.commentRangeForeground',
      {
        dark: opaque(listInactiveSelectionBackground, editorBackground),
        light: darken(opaque(listInactiveSelectionBackground, editorBackground), 0.05),
        hcDark: Color.white,
        hcLight: Color.black,
      }
    );
    const overviewRulerCommentForeground = this._registerColor(
      'editorOverviewRuler.commentForeground',
      overviewRulerCommentingRangeForeground
    );
    const overviewRulerCommentUnresolvedForeground = this._registerColor(
      'editorOverviewRuler.commentUnresolvedForeground',
      overviewRulerCommentForeground
    );
    const editorGutterCommentGlyphForeground = this._registerColor(
      'editorGutter.commentGlyphForeground',
      { dark: editorForeground, light: editorForeground, hcDark: Color.black, hcLight: Color.white }
    );
    this._registerColor(
      'editorGutter.commentUnresolvedGlyphForeground',
      editorGutterCommentGlyphForeground
    );

    // <-- https://github.com/microsoft/vscode/tree/1.91.1/src/vs/workbench/contrib/debug/browser/breakpointEditorContribution.ts -->

    const debugIconBreakpointForeground = this._registerColor(
      'debugIcon.breakpointForeground',
      '#E51400'
    );
    const debugIconBreakpointDisabledForeground = this._registerColor(
      'debugIcon.breakpointDisabledForeground',
      '#848484'
    );
    const debugIconBreakpointUnverifiedForeground = this._registerColor(
      'debugIcon.breakpointUnverifiedForeground',
      '#848484'
    );
    const debugIconBreakpointCurrentStackframeForeground = this._registerColor(
      'debugIcon.breakpointCurrentStackframeForeground',
      { dark: '#FFCC00', light: '#BE8700', hcDark: '#FFCC00', hcLight: '#BE8700' }
    );
    const debugIconBreakpointStackframeForeground = this._registerColor(
      'debugIcon.breakpointStackframeForeground',
      '#89D185'
    );

    // <-- https://github.com/microsoft/vscode/tree/1.91.1/src/vs/workbench/contrib/debug/browser/callStackEditorContribution.ts -->

    const topStackFrameColor = this._registerColor('editor.stackFrameHighlightBackground', {
      dark: '#ffff0033',
      light: '#ffff6673',
      hcDark: '#ffff0033',
      hcLight: '#ffff6673',
    });
    const focusedStackFrameColor = this._registerColor(
      'editor.focusedStackFrameHighlightBackground',
      { dark: '#7abd7a4d', light: '#cee7ce73', hcDark: '#7abd7a4d', hcLight: '#cee7ce73' }
    );

    // <-- https://github.com/microsoft/vscode/tree/1.91.1/src/vs/workbench/contrib/debug/browser/debugColors.ts -->

    const debugToolBarBackground = this._registerColor('debugToolBar.background', {
      dark: '#333333',
      light: '#F3F3F3',
      hcDark: '#000000',
      hcLight: '#FFFFFF',
    });
    const debugToolBarBorder = this._registerColor('debugToolBar.border', null);
    const debugIconStartForeground = this._registerColor('debugIcon.startForeground', {
      dark: '#89D185',
      light: '#388A34',
      hcDark: '#89D185',
      hcLight: '#388A34',
    });
    const debugTokenExpressionName = this._registerColor('debugTokenExpression.name', {
      dark: '#c586c0',
      light: '#9b46b0',
      hcDark: foreground,
      hcLight: foreground,
    });
    const debugTokenExpressionType = this._registerColor('debugTokenExpression.type', {
      dark: '#4A90E2',
      light: '#4A90E2',
      hcDark: foreground,
      hcLight: foreground,
    });
    const debugTokenExpressionValue = this._registerColor('debugTokenExpression.value', {
      dark: '#cccccc99',
      light: '#6c6c6ccc',
      hcDark: foreground,
      hcLight: foreground,
    });
    const debugTokenExpressionString = this._registerColor('debugTokenExpression.string', {
      dark: '#ce9178',
      light: '#a31515',
      hcDark: '#f48771',
      hcLight: '#a31515',
    });
    const debugTokenExpressionBoolean = this._registerColor('debugTokenExpression.boolean', {
      dark: '#4e94ce',
      light: '#0000ff',
      hcDark: '#75bdfe',
      hcLight: '#0000ff',
    });
    const debugTokenExpressionNumber = this._registerColor('debugTokenExpression.number', {
      dark: '#b5cea8',
      light: '#098658',
      hcDark: '#89d185',
      hcLight: '#098658',
    });
    const debugTokenExpressionError = this._registerColor('debugTokenExpression.error', {
      dark: '#f48771',
      light: '#e51400',
      hcDark: '#f48771',
      hcLight: '#e51400',
    });
    const debugViewExceptionLabelForeground = this._registerColor(
      'debugView.exceptionLabelForeground',
      { dark: foreground, light: '#FFF', hcDark: foreground, hcLight: foreground }
    );
    const debugViewExceptionLabelBackground = this._registerColor(
      'debugView.exceptionLabelBackground',
      { dark: '#6C2022', light: '#A31515', hcDark: '#6C2022', hcLight: '#A31515' }
    );
    const debugViewStateLabelForeground = this._registerColor(
      'debugView.stateLabelForeground',
      foreground
    );
    const debugViewStateLabelBackground = this._registerColor(
      'debugView.stateLabelBackground',
      '#88888844'
    );
    const debugViewValueChangedHighlight = this._registerColor(
      'debugView.valueChangedHighlight',
      '#569CD6'
    );
    const debugConsoleInfoForeground = this._registerColor('debugConsole.infoForeground', {
      dark: editorInfoForeground,
      light: editorInfoForeground,
      hcDark: foreground,
      hcLight: foreground,
    });
    const debugConsoleWarningForeground = this._registerColor('debugConsole.warningForeground', {
      dark: editorWarningForeground,
      light: editorWarningForeground,
      hcDark: '#008000',
      hcLight: editorWarningForeground,
    });
    const debugConsoleErrorForeground = this._registerColor(
      'debugConsole.errorForeground',
      errorForeground
    );
    const debugConsoleSourceForeground = this._registerColor(
      'debugConsole.sourceForeground',
      foreground
    );
    const debugConsoleInputIconForeground = this._registerColor(
      'debugConsoleInputIcon.foreground',
      foreground
    );
    const debugIconPauseForeground = this._registerColor('debugIcon.pauseForeground', {
      dark: '#75BEFF',
      light: '#007ACC',
      hcDark: '#75BEFF',
      hcLight: '#007ACC',
    });
    const debugIconStopForeground = this._registerColor('debugIcon.stopForeground', {
      dark: '#F48771',
      light: '#A1260D',
      hcDark: '#F48771',
      hcLight: '#A1260D',
    });
    const debugIconDisconnectForeground = this._registerColor('debugIcon.disconnectForeground', {
      dark: '#F48771',
      light: '#A1260D',
      hcDark: '#F48771',
      hcLight: '#A1260D',
    });
    const debugIconRestartForeground = this._registerColor('debugIcon.restartForeground', {
      dark: '#89D185',
      light: '#388A34',
      hcDark: '#89D185',
      hcLight: '#388A34',
    });
    const debugIconStepOverForeground = this._registerColor('debugIcon.stepOverForeground', {
      dark: '#75BEFF',
      light: '#007ACC',
      hcDark: '#75BEFF',
      hcLight: '#007ACC',
    });
    const debugIconStepIntoForeground = this._registerColor('debugIcon.stepIntoForeground', {
      dark: '#75BEFF',
      light: '#007ACC',
      hcDark: '#75BEFF',
      hcLight: '#007ACC',
    });
    const debugIconStepOutForeground = this._registerColor('debugIcon.stepOutForeground', {
      dark: '#75BEFF',
      light: '#007ACC',
      hcDark: '#75BEFF',
      hcLight: '#007ACC',
    });
    const debugIconContinueForeground = this._registerColor('debugIcon.continueForeground', {
      dark: '#75BEFF',
      light: '#007ACC',
      hcDark: '#75BEFF',
      hcLight: '#007ACC',
    });
    const debugIconStepBackForeground = this._registerColor('debugIcon.stepBackForeground', {
      dark: '#75BEFF',
      light: '#007ACC',
      hcDark: '#75BEFF',
      hcLight: '#007ACC',
    });

    // <-- https://github.com/microsoft/vscode/tree/1.91.1/src/vs/workbench/contrib/debug/browser/debugEditorContribution.ts -->

    const debugInlineForeground = this._registerColor('editor.inlineValuesForeground', {
      dark: '#ffffff80',
      light: '#00000080',
      hcDark: '#ffffff80',
      hcLight: '#00000080',
    });
    const debugInlineBackground = this._registerColor('editor.inlineValuesBackground', '#ffc80033');

    // <-- https://github.com/microsoft/vscode/tree/1.91.1/src/vs/workbench/contrib/debug/browser/exceptionWidget.ts -->

    const debugExceptionWidgetBorder = this._registerColor(
      'debugExceptionWidget.border',
      '#a31515'
    );
    const debugExceptionWidgetBackground = this._registerColor('debugExceptionWidget.background', {
      dark: '#420b0d',
      light: '#f1dfde',
      hcDark: '#420b0d',
      hcLight: '#f1dfde',
    });

    // <-- https://github.com/microsoft/vscode/tree/1.91.1/src/vs/workbench/contrib/debug/browser/statusbarColorProvider.ts -->

    const STATUS_BAR_DEBUGGING_BACKGROUND = this._registerColor('statusBar.debuggingBackground', {
      dark: '#CC6633',
      light: '#CC6633',
      hcDark: '#BA592C',
      hcLight: '#B5200D',
    });
    const STATUS_BAR_DEBUGGING_FOREGROUND = this._registerColor('statusBar.debuggingForeground', {
      dark: STATUS_BAR_FOREGROUND,
      light: STATUS_BAR_FOREGROUND,
      hcDark: STATUS_BAR_FOREGROUND,
      hcLight: '#FFFFFF',
    });
    const STATUS_BAR_DEBUGGING_BORDER = this._registerColor(
      'statusBar.debuggingBorder',
      STATUS_BAR_BORDER
    );
    const COMMAND_CENTER_DEBUGGING_BACKGROUND = this._registerColor(
      'commandCenter.debuggingBackground',
      transparent(STATUS_BAR_DEBUGGING_BACKGROUND, 0.258),
      true
    );

    // <-- https://github.com/microsoft/vscode/tree/1.91.1/src/vs/workbench/contrib/extension/browser/extensionsActions.ts -->

    this._registerColor('extensionButton.background', {
      dark: buttonBackground,
      light: buttonBackground,
      hcDark: null,
      hcLight: null,
    });
    this._registerColor('extensionButton.foreground', {
      dark: buttonForeground,
      light: buttonForeground,
      hcDark: null,
      hcLight: null,
    });
    this._registerColor('extensionButton.hoverBackground', {
      dark: buttonHoverBackground,
      light: buttonHoverBackground,
      hcDark: null,
      hcLight: null,
    });
    this._registerColor('extensionButton.separator', buttonSeparator);
    const extensionButtonProminentBackground = this._registerColor(
      'extensionButton.prominentBackground',
      { dark: buttonBackground, light: buttonBackground, hcDark: null, hcLight: null }
    );
    this._registerColor('extensionButton.prominentForeground', {
      dark: buttonForeground,
      light: buttonForeground,
      hcDark: null,
      hcLight: null,
    });
    this._registerColor('extensionButton.prominentHoverBackground', {
      dark: buttonHoverBackground,
      light: buttonHoverBackground,
      hcDark: null,
      hcLight: null,
    });

    // <-- https://github.com/microsoft/vscode/tree/1.91.1/src/vs/workbench/contrib/extension/browser/extensionsWidgets.ts -->

    const extensionRatingIconColor = this._registerColor(
      'extensionIcon.starForeground',
      { light: '#DF6100', dark: '#FF8E00', hcDark: '#FF8E00', hcLight: textLinkForeground },
      true
    );
    const extensionVerifiedPublisherIconColor = this._registerColor(
      'extensionIcon.verifiedForeground',
      textLinkForeground,
      true
    );
    const extensionPreReleaseIconColor = this._registerColor(
      'extensionIcon.preReleaseForeground',
      { dark: '#1d9271', light: '#1d9271', hcDark: '#1d9271', hcLight: textLinkForeground },
      true
    );
    const extensionSponsorIconColor = this._registerColor(
      'extensionIcon.sponsorForeground',
      { light: '#B51E78', dark: '#D758B3', hcDark: null, hcLight: '#B51E78' },
      true
    );

    // <-- https://github.com/microsoft/vscode/tree/1.91.1/src/vs/workbench/contrib/inlineChat/common/inlineChat.ts -->

    const inlineChatForeground = this._registerColor(
      'inlineChat.foreground',
      editorWidgetForeground
    );
    const inlineChatBackground = this._registerColor(
      'inlineChat.background',
      editorWidgetBackground
    );
    const inlineChatBorder = this._registerColor('inlineChat.border', editorWidgetBorder);
    const inlineChatShadow = this._registerColor('inlineChat.shadow', widgetShadow);
    const inlineChatInputBorder = this._registerColor('inlineChatInput.border', editorWidgetBorder);
    const inlineChatInputFocusBorder = this._registerColor(
      'inlineChatInput.focusBorder',
      focusBorder
    );
    const inlineChatInputPlaceholderForeground = this._registerColor(
      'inlineChatInput.placeholderForeground',
      inputPlaceholderForeground
    );
    const inlineChatInputBackground = this._registerColor(
      'inlineChatInput.background',
      inputBackground
    );
    const inlineChatDiffInserted = this._registerColor(
      'inlineChatDiff.inserted',
      transparent(diffInserted, 0.5)
    );
    const overviewRulerInlineChatDiffInserted = this._registerColor(
      'editorOverviewRuler.inlineChatInserted',
      {
        dark: transparent(diffInserted, 0.6),
        light: transparent(diffInserted, 0.8),
        hcDark: transparent(diffInserted, 0.6),
        hcLight: transparent(diffInserted, 0.8),
      }
    );
    const minimapInlineChatDiffInserted = this._registerColor(
      'editorOverviewRuler.inlineChatInserted',
      {
        dark: transparent(diffInserted, 0.6),
        light: transparent(diffInserted, 0.8),
        hcDark: transparent(diffInserted, 0.6),
        hcLight: transparent(diffInserted, 0.8),
      }
    );
    const inlineChatDiffRemoved = this._registerColor(
      'inlineChatDiff.removed',
      transparent(diffRemoved, 0.5)
    );
    const overviewRulerInlineChatDiffRemoved = this._registerColor(
      'editorOverviewRuler.inlineChatRemoved',
      {
        dark: transparent(diffRemoved, 0.6),
        light: transparent(diffRemoved, 0.8),
        hcDark: transparent(diffRemoved, 0.6),
        hcLight: transparent(diffRemoved, 0.8),
      }
    );

    // <-- https://github.com/microsoft/vscode/tree/1.91.1/src/vs/workbench/contrib/interactive/browser/interactive.contribution.ts -->

    this._registerColor('interactive.activeCodeBorder', {
      dark: ifDefinedThenElse(peekViewBorder, peekViewBorder, '#007acc'),
      light: ifDefinedThenElse(peekViewBorder, peekViewBorder, '#007acc'),
      hcDark: contrastBorder,
      hcLight: contrastBorder,
    });
    this._registerColor('interactive.inactiveCodeBorder', {
      dark: ifDefinedThenElse(
        listInactiveSelectionBackground,
        listInactiveSelectionBackground,
        '#37373D'
      ),
      light: ifDefinedThenElse(
        listInactiveSelectionBackground,
        listInactiveSelectionBackground,
        '#E4E6F1'
      ),
      hcDark: PANEL_BORDER,
      hcLight: PANEL_BORDER,
    });

    // <-- https://github.com/microsoft/vscode/tree/1.91.1/src/vs/workbench/contrib/mergeEditor/browser/view/colors.ts -->

    const diff = this._registerColor('mergeEditor.change.background', '#9bb95533');
    const diffWord = this._registerColor('mergeEditor.change.word.background', {
      dark: '#9ccc2c33',
      light: '#9ccc2c66',
      hcDark: '#9ccc2c33',
      hcLight: '#9ccc2c66',
    });
    const diffBase = this._registerColor('mergeEditor.changeBase.background', {
      dark: '#4B1818FF',
      light: '#FFCCCCFF',
      hcDark: '#4B1818FF',
      hcLight: '#FFCCCCFF',
    });
    const diffWordBase = this._registerColor('mergeEditor.changeBase.word.background', {
      dark: '#6F1313FF',
      light: '#FFA3A3FF',
      hcDark: '#6F1313FF',
      hcLight: '#FFA3A3FF',
    });
    const conflictBorderUnhandledUnfocused = this._registerColor(
      'mergeEditor.conflict.unhandledUnfocused.border',
      { dark: '#ffa6007a', light: '#ffa600FF', hcDark: '#ffa6007a', hcLight: '#ffa6007a' }
    );
    const conflictBorderUnhandledFocused = this._registerColor(
      'mergeEditor.conflict.unhandledFocused.border',
      '#ffa600'
    );
    const conflictBorderHandledUnfocused = this._registerColor(
      'mergeEditor.conflict.handledUnfocused.border',
      '#86868649'
    );
    const conflictBorderHandledFocused = this._registerColor(
      'mergeEditor.conflict.handledFocused.border',
      '#c1c1c1cc'
    );
    const handledConflictMinimapOverViewRulerColor = this._registerColor(
      'mergeEditor.conflict.handled.minimapOverViewRuler',
      '#adaca8ee'
    );
    const unhandledConflictMinimapOverViewRulerColor = this._registerColor(
      'mergeEditor.conflict.unhandled.minimapOverViewRuler',
      '#fcba03FF'
    );
    const conflictingLinesBackground = this._registerColor(
      'mergeEditor.conflictingLines.background',
      '#ffea0047'
    );
    const conflictInput1Background = this._registerColor(
      'mergeEditor.conflict.input1.background',
      transparent(mergeCurrentHeaderBackground, contentTransparency)
    );
    const conflictInput2Background = this._registerColor(
      'mergeEditor.conflict.input2.background',
      transparent(mergeIncomingHeaderBackground, contentTransparency)
    );

    // <-- https://github.com/microsoft/vscode/tree/1.91.1/src/vs/workbench/contrib/notebook/browser/notebookEditorWidget.ts -->

    const notebookCellBorder = this._registerColor('notebook.cellBorderColor', {
      dark: transparent(listInactiveSelectionBackground, 1),
      light: transparent(listInactiveSelectionBackground, 1),
      hcDark: PANEL_BORDER,
      hcLight: PANEL_BORDER,
    });
    const focusedEditorBorderColor = this._registerColor(
      'notebook.focusedEditorBorder',
      focusBorder
    );
    const cellStatusIconSuccess = this._registerColor(
      'notebookStatusSuccessIcon.foreground',
      debugIconStartForeground
    );
    const runningCellRulerDecorationColor = this._registerColor(
      'notebookEditorOverviewRuler.runningCellForeground',
      debugIconStartForeground
    );
    const cellStatusIconError = this._registerColor(
      'notebookStatusErrorIcon.foreground',
      errorForeground
    );
    const cellStatusIconRunning = this._registerColor(
      'notebookStatusRunningIcon.foreground',
      foreground
    );
    const notebookOutputContainerBorderColor = this._registerColor(
      'notebook.outputContainerBorderColor',
      null
    );
    const notebookOutputContainerColor = this._registerColor(
      'notebook.outputContainerBackgroundColor',
      null
    );
    const CELL_TOOLBAR_SEPERATOR = this._registerColor('notebook.cellToolbarSeparator', {
      dark: Color.fromHex('#808080').transparent(0.35),
      light: Color.fromHex('#808080').transparent(0.35),
      hcDark: contrastBorder,
      hcLight: contrastBorder,
    });
    const focusedCellBackground = this._registerColor('notebook.focusedCellBackground', null);
    const selectedCellBackground = this._registerColor('notebook.selectedCellBackground', {
      dark: listInactiveSelectionBackground,
      light: listInactiveSelectionBackground,
      hcDark: null,
      hcLight: null,
    });
    const cellHoverBackground = this._registerColor('notebook.cellHoverBackground', {
      dark: transparent(focusedCellBackground, 0.5),
      light: transparent(focusedCellBackground, 0.7),
      hcDark: null,
      hcLight: null,
    });
    const selectedCellBorder = this._registerColor('notebook.selectedCellBorder', {
      dark: notebookCellBorder,
      light: notebookCellBorder,
      hcDark: contrastBorder,
      hcLight: contrastBorder,
    });
    const inactiveSelectedCellBorder = this._registerColor('notebook.inactiveSelectedCellBorder', {
      dark: null,
      light: null,
      hcDark: focusBorder,
      hcLight: focusBorder,
    });
    const focusedCellBorder = this._registerColor('notebook.focusedCellBorder', focusBorder);
    const inactiveFocusedCellBorder = this._registerColor(
      'notebook.inactiveFocusedCellBorder',
      notebookCellBorder
    );
    const cellStatusBarItemHover = this._registerColor(
      'notebook.cellStatusBarItemHoverBackground',
      {
        light: new Color(new RGBA(0, 0, 0, 0.08)),
        dark: new Color(new RGBA(255, 255, 255, 0.15)),
        hcDark: new Color(new RGBA(255, 255, 255, 0.15)),
        hcLight: new Color(new RGBA(0, 0, 0, 0.08)),
      }
    );
    const cellInsertionIndicator = this._registerColor(
      'notebook.cellInsertionIndicator',
      focusBorder
    );
    const listScrollbarSliderBackground = this._registerColor(
      'notebookScrollbarSlider.background',
      scrollbarSliderBackground
    );
    const listScrollbarSliderHoverBackground = this._registerColor(
      'notebookScrollbarSlider.hoverBackground',
      scrollbarSliderHoverBackground
    );
    const listScrollbarSliderActiveBackground = this._registerColor(
      'notebookScrollbarSlider.activeBackground',
      scrollbarSliderActiveBackground
    );
    const cellSymbolHighlight = this._registerColor('notebook.symbolHighlightBackground', {
      dark: Color.fromHex('#ffffff0b'),
      light: Color.fromHex('#fdff0033'),
      hcDark: null,
      hcLight: null,
    });
    const cellEditorBackground = this._registerColor('notebook.cellEditorBackground', {
      light: SIDE_BAR_BACKGROUND,
      dark: SIDE_BAR_BACKGROUND,
      hcDark: null,
      hcLight: null,
    });
    const notebookEditorBackground = this._registerColor('notebook.editorBackground', {
      light: EDITOR_PANE_BACKGROUND,
      dark: EDITOR_PANE_BACKGROUND,
      hcDark: null,
      hcLight: null,
    });

    // <-- https://github.com/microsoft/vscode/tree/1.91.1/src/vs/workbench/contrib/preferences/browser/keybindingsEditor.ts -->

    this._registerColor('keybindingTable.headerBackground', tableOddRowsBackgroundColor);
    this._registerColor('keybindingTable.rowsBackground', tableOddRowsBackgroundColor);

    // <-- https://github.com/microsoft/vscode/tree/1.91.1/src/vs/workbench/contrib/preferences/browser/settingsEditorColorRegistry.ts -->

    const settingsHeaderForeground = this._registerColor('settings.headerForeground', {
      light: '#444444',
      dark: '#e7e7e7',
      hcDark: '#ffffff',
      hcLight: '#292929',
    });
    const settingsHeaderHoverForeground = this._registerColor(
      'settings.settingsHeaderHoverForeground',
      transparent(settingsHeaderForeground, 0.7)
    );
    const modifiedItemIndicator = this._registerColor('settings.modifiedItemIndicator', {
      light: new Color(new RGBA(102, 175, 224)),
      dark: new Color(new RGBA(12, 125, 157)),
      hcDark: new Color(new RGBA(0, 73, 122)),
      hcLight: new Color(new RGBA(102, 175, 224)),
    });
    const settingsHeaderBorder = this._registerColor('settings.headerBorder', PANEL_BORDER);
    const settingsSashBorder = this._registerColor('settings.sashBorder', PANEL_BORDER);
    const settingsSelectBackground = this._registerColor(
      `settings.dropdownBackground`,
      selectBackground
    );
    const settingsSelectForeground = this._registerColor(
      'settings.dropdownForeground',
      selectForeground
    );
    const settingsSelectBorder = this._registerColor('settings.dropdownBorder', selectBorder);
    const settingsSelectListBorder = this._registerColor(
      'settings.dropdownListBorder',
      editorWidgetBorder
    );
    const settingsCheckboxBackground = this._registerColor(
      'settings.checkboxBackground',
      checkboxBackground
    );
    const settingsCheckboxForeground = this._registerColor(
      'settings.checkboxForeground',
      checkboxForeground
    );
    const settingsCheckboxBorder = this._registerColor('settings.checkboxBorder', checkboxBorder);
    const settingsTextInputBackground = this._registerColor(
      'settings.textInputBackground',
      inputBackground
    );
    const settingsTextInputForeground = this._registerColor(
      'settings.textInputForeground',
      inputForeground
    );
    const settingsTextInputBorder = this._registerColor('settings.textInputBorder', inputBorder);
    const settingsNumberInputBackground = this._registerColor(
      'settings.numberInputBackground',
      inputBackground
    );
    const settingsNumberInputForeground = this._registerColor(
      'settings.numberInputForeground',
      inputForeground
    );
    const settingsNumberInputBorder = this._registerColor(
      'settings.numberInputBorder',
      inputBorder
    );
    const focusedRowBackground = this._registerColor('settings.focusedRowBackground', {
      dark: transparent(listHoverBackground, 0.6),
      light: transparent(listHoverBackground, 0.6),
      hcDark: null,
      hcLight: null,
    });
    const rowHoverBackground = this._registerColor('settings.rowHoverBackground', {
      dark: transparent(listHoverBackground, 0.3),
      light: transparent(listHoverBackground, 0.3),
      hcDark: null,
      hcLight: null,
    });
    const focusedRowBorder = this._registerColor('settings.focusedRowBorder', focusBorder);

    // <-- https://github.com/microsoft/vscode/tree/1.91.1/src/vs/workbench/contrib/remote/browser/tunnelView.ts -->

    this._registerColor('ports.iconRunningProcessForeground', STATUS_BAR_REMOTE_ITEM_BACKGROUND);

    // <-- https://github.com/microsoft/vscode/tree/1.91.1/src/vs/workbench/contrib/scm/browser/dirtydiffDecorator.ts -->

    const editorGutterModifiedBackground = this._registerColor('editorGutter.modifiedBackground', {
      dark: '#1B81A8',
      light: '#2090D3',
      hcDark: '#1B81A8',
      hcLight: '#2090D3',
    });
    const editorGutterAddedBackground = this._registerColor('editorGutter.addedBackground', {
      dark: '#487E02',
      light: '#48985D',
      hcDark: '#487E02',
      hcLight: '#48985D',
    });
    const editorGutterDeletedBackground = this._registerColor(
      'editorGutter.deletedBackground',
      editorErrorForeground
    );
    const minimapGutterModifiedBackground = this._registerColor(
      'minimapGutter.modifiedBackground',
      editorGutterModifiedBackground
    );
    const minimapGutterAddedBackground = this._registerColor(
      'minimapGutter.addedBackground',
      editorGutterAddedBackground
    );
    const minimapGutterDeletedBackground = this._registerColor(
      'minimapGutter.deletedBackground',
      editorGutterDeletedBackground
    );
    const overviewRulerModifiedForeground = this._registerColor(
      'editorOverviewRuler.modifiedForeground',
      transparent(editorGutterModifiedBackground, 0.6)
    );
    const overviewRulerAddedForeground = this._registerColor(
      'editorOverviewRuler.addedForeground',
      transparent(editorGutterAddedBackground, 0.6)
    );
    const overviewRulerDeletedForeground = this._registerColor(
      'editorOverviewRuler.deletedForeground',
      transparent(editorGutterDeletedBackground, 0.6)
    );

    // <-- https://github.com/microsoft/vscode/tree/1.91.1/src/vs/workbench/contrib/scm/browser/scmViewPane.ts -->

    this._registerColor(
      'scm.historyItemAdditionsForeground',
      'gitDecoration.addedResourceForeground'
    );
    this._registerColor(
      'scm.historyItemDeletionsForeground',
      'gitDecoration.deletedResourceForeground'
    );
    this._registerColor('scm.historyItemStatisticsBorder', transparent(foreground, 0.2));
    this._registerColor(
      'scm.historyItemSelectedStatisticsBorder',
      transparent(listActiveSelectionForeground, 0.2)
    );

    // <-- https://github.com/microsoft/vscode/tree/1.91.1/src/vs/workbench/contrib/searchEditor/browser/searchEditor.ts -->

    const searchEditorTextInputBorder = this._registerColor(
      'searchEditor.textInputBorder',
      inputBorder
    );

    // <-- https://github.com/microsoft/vscode/tree/1.91.1/src/vs/workbench/contrib/terminal/common/terminalColorRegistry.ts -->
    const TERMINAL_BACKGROUND_COLOR = this._registerColor('terminal.background', null);
    const TERMINAL_FOREGROUND_COLOR = this._registerColor('terminal.foreground', {
      light: '#333333',
      dark: '#CCCCCC',
      hcDark: '#FFFFFF',
      hcLight: '#292929',
    });
    const TERMINAL_CURSOR_FOREGROUND_COLOR = this._registerColor('terminalCursor.foreground', null);
    const TERMINAL_CURSOR_BACKGROUND_COLOR = this._registerColor('terminalCursor.background', null);
    const TERMINAL_SELECTION_BACKGROUND_COLOR = this._registerColor(
      'terminal.selectionBackground',
      editorSelectionBackground
    );
    const TERMINAL_INACTIVE_SELECTION_BACKGROUND_COLOR = this._registerColor(
      'terminal.inactiveSelectionBackground',
      {
        light: transparent(TERMINAL_SELECTION_BACKGROUND_COLOR, 0.5),
        dark: transparent(TERMINAL_SELECTION_BACKGROUND_COLOR, 0.5),
        hcDark: transparent(TERMINAL_SELECTION_BACKGROUND_COLOR, 0.7),
        hcLight: transparent(TERMINAL_SELECTION_BACKGROUND_COLOR, 0.5),
      }
    );
    const TERMINAL_SELECTION_FOREGROUND_COLOR = this._registerColor(
      'terminal.selectionForeground',
      { light: null, dark: null, hcDark: '#000000', hcLight: '#ffffff' }
    );
    const TERMINAL_COMMAND_DECORATION_DEFAULT_BACKGROUND_COLOR = this._registerColor(
      'terminalCommandDecoration.defaultBackground',
      { light: '#00000040', dark: '#ffffff40', hcDark: '#ffffff80', hcLight: '#00000040' }
    );
    const TERMINAL_COMMAND_DECORATION_SUCCESS_BACKGROUND_COLOR = this._registerColor(
      'terminalCommandDecoration.successBackground',
      { dark: '#1B81A8', light: '#2090D3', hcDark: '#1B81A8', hcLight: '#007100' }
    );
    const TERMINAL_COMMAND_DECORATION_ERROR_BACKGROUND_COLOR = this._registerColor(
      'terminalCommandDecoration.errorBackground',
      { dark: '#F14C4C', light: '#E51400', hcDark: '#F14C4C', hcLight: '#B5200D' }
    );
    const TERMINAL_OVERVIEW_RULER_CURSOR_FOREGROUND_COLOR = this._registerColor(
      'terminalOverviewRuler.cursorForeground',
      '#A0A0A0CC'
    );
    const TERMINAL_BORDER_COLOR = this._registerColor('terminal.border', PANEL_BORDER);
    const TERMINAL_FIND_MATCH_BACKGROUND_COLOR = this._registerColor(
      'terminal.findMatchBackground',
      { dark: editorFindMatch, light: editorFindMatch, hcDark: null, hcLight: '#0F4A85' },
      true
    );
    const TERMINAL_HOVER_HIGHLIGHT_BACKGROUND_COLOR = this._registerColor(
      'terminal.hoverHighlightBackground',
      transparent(editorHoverHighlight, 0.5)
    );
    const TERMINAL_FIND_MATCH_BORDER_COLOR = this._registerColor('terminal.findMatchBorder', {
      dark: null,
      light: null,
      hcDark: '#f38518',
      hcLight: '#0F4A85',
    });
    const TERMINAL_FIND_MATCH_HIGHLIGHT_BACKGROUND_COLOR = this._registerColor(
      'terminal.findMatchHighlightBackground',
      {
        dark: editorFindMatchHighlight,
        light: editorFindMatchHighlight,
        hcDark: null,
        hcLight: null,
      },
      true
    );
    const TERMINAL_FIND_MATCH_HIGHLIGHT_BORDER_COLOR = this._registerColor(
      'terminal.findMatchHighlightBorder',
      { dark: null, light: null, hcDark: '#f38518', hcLight: '#0F4A85' }
    );
    const TERMINAL_OVERVIEW_RULER_FIND_MATCH_FOREGROUND_COLOR = this._registerColor(
      'terminalOverviewRuler.findMatchForeground',
      {
        dark: overviewRulerFindMatchForeground,
        light: overviewRulerFindMatchForeground,
        hcDark: '#f38518',
        hcLight: '#0F4A85',
      }
    );
    const TERMINAL_DRAG_AND_DROP_BACKGROUND = this._registerColor(
      'terminal.dropBackground',
      EDITOR_DRAG_AND_DROP_BACKGROUND,
      true
    );
    const TERMINAL_TAB_ACTIVE_BORDER = this._registerColor(
      'terminal.tab.activeBorder',
      TAB_ACTIVE_BORDER
    );
    const TERMINAL_INITIAL_HINT_FOREGROUND = this._registerColor('terminal.initialHintForeground', {
      dark: '#ffffff56',
      light: '#0007',
      hcDark: null,
      hcLight: null,
    });
    this._registerColor('terminal.ansiBlack', {
      light: '#000000',
      dark: '#000000',
      hcDark: '#000000',
      hcLight: '#292929',
    });
    this._registerColor('terminal.ansiRed', {
      light: '#cd3131',
      dark: '#cd3131',
      hcDark: '#cd0000',
      hcLight: '#cd3131',
    });
    this._registerColor('terminal.ansiGreen', {
      light: '#107C10',
      dark: '#0DBC79',
      hcDark: '#00cd00',
      hcLight: '#136C13',
    });
    this._registerColor('terminal.ansiYellow', {
      light: '#949800',
      dark: '#e5e510',
      hcDark: '#cdcd00',
      hcLight: '#949800',
    });
    this._registerColor('terminal.ansiBlue', {
      light: '#0451a5',
      dark: '#2472c8',
      hcDark: '#0000ee',
      hcLight: '#0451a5',
    });
    this._registerColor('terminal.ansiMagenta', {
      light: '#bc05bc',
      dark: '#bc3fbc',
      hcDark: '#cd00cd',
      hcLight: '#bc05bc',
    });
    this._registerColor('terminal.ansiCyan', {
      light: '#0598bc',
      dark: '#11a8cd',
      hcDark: '#00cdcd',
      hcLight: '#0598bc',
    });
    this._registerColor('terminal.ansiWhite', {
      light: '#555555',
      dark: '#e5e5e5',
      hcDark: '#e5e5e5',
      hcLight: '#555555',
    });
    this._registerColor('terminal.ansiBrightBlack', {
      light: '#666666',
      dark: '#666666',
      hcDark: '#7f7f7f',
      hcLight: '#666666',
    });
    this._registerColor('terminal.ansiBrightRed', {
      light: '#cd3131',
      dark: '#f14c4c',
      hcDark: '#ff0000',
      hcLight: '#cd3131',
    });
    this._registerColor('terminal.ansiBrightGreen', {
      light: '#14CE14',
      dark: '#23d18b',
      hcDark: '#00ff00',
      hcLight: '#00bc00',
    });
    this._registerColor('terminal.ansiBrightYellow', {
      light: '#b5ba00',
      dark: '#f5f543',
      hcDark: '#ffff00',
      hcLight: '#b5ba00',
    });
    this._registerColor('terminal.ansiBrightBlue', {
      light: '#0451a5',
      dark: '#3b8eea',
      hcDark: '#5c5cff',
      hcLight: '#0451a5',
    });
    this._registerColor('terminal.ansiBrightMagenta', {
      light: '#bc05bc',
      dark: '#d670d6',
      hcDark: '#ff00ff',
      hcLight: '#bc05bc',
    });
    this._registerColor('terminal.ansiBrightCyan', {
      light: '#0598bc',
      dark: '#29b8db',
      hcDark: '#00ffff',
      hcLight: '#0598bc',
    });
    this._registerColor('terminal.ansiBrightWhite', {
      light: '#a5a5a5',
      dark: '#e5e5e5',
      hcDark: '#ffffff',
      hcLight: '#a5a5a5',
    });

    // <-- https://github.com/microsoft/vscode/tree/1.91.1/src/vs/workbench/contrib/terminalContrib/stickyScroll/browser/terminalStickyScrollColorRegistry.ts -->

    const terminalStickyScrollBackground = this._registerColor(
      'terminalStickyScroll.background',
      null
    );
    const terminalStickyScrollHoverBackground = this._registerColor(
      'terminalStickyScrollHover.background',
      { dark: '#2A2D2E', light: '#F0F0F0', hcDark: '#E48B39', hcLight: '#0f4a85' }
    );
    this._registerColor('terminalStickyScroll.border', {
      dark: null,
      light: null,
      hcDark: '#6fc3df',
      hcLight: '#0f4a85',
    });

    // <-- https://github.com/microsoft/vscode/tree/1.91.1/src/vs/workbench/contrib/testing/browser/theme.ts -->

    const testingColorIconFailed = this._registerColor('testing.iconFailed', {
      dark: '#f14c4c',
      light: '#f14c4c',
      hcDark: '#f14c4c',
      hcLight: '#B5200D',
    });
    const testingColorIconErrored = this._registerColor('testing.iconErrored', {
      dark: '#f14c4c',
      light: '#f14c4c',
      hcDark: '#f14c4c',
      hcLight: '#B5200D',
    });
    const testingColorIconPassed = this._registerColor('testing.iconPassed', {
      dark: '#73c991',
      light: '#73c991',
      hcDark: '#73c991',
      hcLight: '#007100',
    });
    const testingColorRunAction = this._registerColor('testing.runAction', testingColorIconPassed);
    const testingColorIconQueued = this._registerColor('testing.iconQueued', '#cca700');
    const testingColorIconUnset = this._registerColor('testing.iconUnset', '#848484');
    const testingColorIconSkipped = this._registerColor('testing.iconSkipped', '#848484');
    const testingPeekBorder = this._registerColor('testing.peekBorder', {
      dark: editorErrorForeground,
      light: editorErrorForeground,
      hcDark: contrastBorder,
      hcLight: contrastBorder,
    });
    const testingMessagePeekBorder = this._registerColor('testing.messagePeekBorder', {
      dark: editorInfoForeground,
      light: editorInfoForeground,
      hcDark: contrastBorder,
      hcLight: contrastBorder,
    });
    const testingPeekHeaderBackground = this._registerColor('testing.peekHeaderBackground', {
      dark: transparent(editorErrorForeground, 0.1),
      light: transparent(editorErrorForeground, 0.1),
      hcDark: null,
      hcLight: null,
    });
    const testingPeekMessageHeaderBackground = this._registerColor(
      'testing.messagePeekHeaderBackground',
      {
        dark: transparent(editorInfoForeground, 0.1),
        light: transparent(editorInfoForeground, 0.1),
        hcDark: null,
        hcLight: null,
      }
    );
    const testingCoveredBackground = this._registerColor('testing.coveredBackground', {
      dark: diffInserted,
      light: diffInserted,
      hcDark: null,
      hcLight: null,
    });
    const testingCoveredBorder = this._registerColor('testing.coveredBorder', {
      dark: transparent(testingCoveredBackground, 0.75),
      light: transparent(testingCoveredBackground, 0.75),
      hcDark: contrastBorder,
      hcLight: contrastBorder,
    });
    const testingCoveredGutterBackground = this._registerColor('testing.coveredGutterBackground', {
      dark: transparent(diffInserted, 0.6),
      light: transparent(diffInserted, 0.6),
      hcDark: chartsGreen,
      hcLight: chartsGreen,
    });
    const testingUncoveredBranchBackground = this._registerColor(
      'testing.uncoveredBranchBackground',
      {
        dark: opaque(transparent(diffRemoved, 2), editorBackground),
        light: opaque(transparent(diffRemoved, 2), editorBackground),
        hcDark: null,
        hcLight: null,
      }
    );
    const testingUncoveredBackground = this._registerColor('testing.uncoveredBackground', {
      dark: diffRemoved,
      light: diffRemoved,
      hcDark: null,
      hcLight: null,
    });
    const testingUncoveredBorder = this._registerColor('testing.uncoveredBorder', {
      dark: transparent(testingUncoveredBackground, 0.75),
      light: transparent(testingUncoveredBackground, 0.75),
      hcDark: contrastBorder,
      hcLight: contrastBorder,
    });
    const testingUncoveredGutterBackground = this._registerColor(
      'testing.uncoveredGutterBackground',
      {
        dark: transparent(diffRemoved, 1.5),
        light: transparent(diffRemoved, 1.5),
        hcDark: chartsRed,
        hcLight: chartsRed,
      }
    );
    const testingCoverCountBadgeBackground = this._registerColor(
      'testing.coverCountBadgeBackground',
      badgeBackground
    );
    const testingCoverCountBadgeForeground = this._registerColor(
      'testing.coverCountBadgeForeground',
      badgeForeground
    );
    this._registerColor('testing.message.error.decorationForeground', {
      dark: editorErrorForeground,
      light: editorErrorForeground,
      hcDark: editorForeground,
      hcLight: editorForeground,
    });
    this._registerColor('testing.message.error.lineBackground', {
      dark: new Color(new RGBA(255, 0, 0, 0.2)),
      light: new Color(new RGBA(255, 0, 0, 0.2)),
      hcDark: null,
      hcLight: null,
    });
    this._registerColor(
      'testing.message.info.decorationForeground',
      transparent(editorForeground, 0.5)
    );
    this._registerColor('testing.message.info.lineBackground', null);
    const testingRetiredColorIconErrored = this._registerColor(
      'testing.iconErrored.retired',
      transparent(testingColorIconErrored, 0.7)
    );
    const testingRetiredColorIconFailed = this._registerColor(
      'testing.iconFailed.retired',
      transparent(testingColorIconFailed, 0.7)
    );
    const testingRetiredColorIconPassed = this._registerColor(
      'testing.iconPassed.retired',
      transparent(testingColorIconPassed, 0.7)
    );
    const testingRetiredColorIconQueued = this._registerColor(
      'testing.iconQueued.retired',
      transparent(testingColorIconQueued, 0.7)
    );
    const testingRetiredColorIconUnset = this._registerColor(
      'testing.iconUnset.retired',
      transparent(testingColorIconUnset, 0.7)
    );
    const testingRetiredColorIconSkipped = this._registerColor(
      'testing.iconSkipped.retired',
      transparent(testingColorIconSkipped, 0.7)
    );

    // <-- https://github.com/microsoft/vscode/tree/1.91.1/src/vs/workbench/contrib/userDataProfile/browser/userDataProfileEditor.ts -->

    const profilesSashBorder = this._registerColor('profiles.sashBorder', PANEL_BORDER);

    // <-- https://github.com/microsoft/vscode/tree/1.91.1/src/vs/workbench/contrib/welcomeGettingStarted/browser/gettingStartedColors.ts -->

    const welcomePageBackground = this._registerColor('welcomePage.background', null);
    const welcomePageTileBackground = this._registerColor('welcomePage.tileBackground', {
      dark: editorWidgetBackground,
      light: editorWidgetBackground,
      hcDark: '#000',
      hcLight: editorWidgetBackground,
    });
    const welcomePageTileHoverBackground = this._registerColor('welcomePage.tileHoverBackground', {
      dark: lighten(editorWidgetBackground, 0.2),
      light: darken(editorWidgetBackground, 0.1),
      hcDark: null,
      hcLight: null,
    });
    const welcomePageTileBorder = this._registerColor('welcomePage.tileBorder', {
      dark: '#ffffff1a',
      light: '#0000001a',
      hcDark: contrastBorder,
      hcLight: contrastBorder,
    });
    const welcomePageProgressBackground = this._registerColor(
      'welcomePage.progress.background',
      inputBackground
    );
    const welcomePageProgressForeground = this._registerColor(
      'welcomePage.progress.foreground',
      textLinkForeground
    );
    const walkthroughStepTitleForeground = this._registerColor('walkthrough.stepTitle.foreground', {
      light: '#000000',
      dark: '#ffffff',
      hcDark: null,
      hcLight: null,
    });

    // <-- https://github.com/microsoft/vscode/tree/1.91.1/src/vs/workbench/contrib/welcomeWalkthrough/browser/walkThroughUtils.ts -->

    const embeddedEditorBackground = this._registerColor('walkThrough.embeddedEditorBackground', {
      dark: new Color(new RGBA(0, 0, 0, 0.4)),
      light: '#f4f4f4',
      hcDark: null,
      hcLight: null,
    });

    // <-- https://github.com/microsoft/vscode/tree/1.91.1/extensions/git/package.json -->

    this._registerColor('gitDecoration.addedResourceForeground', {
      light: '#587c0c',
      dark: '#81b88b',
      hcDark: '#a1e3ad',
      hcLight: '#374e06',
    });
    this._registerColor('gitDecoration.modifiedResourceForeground', {
      light: '#895503',
      dark: '#E2C08D',
      hcDark: '#E2C08D',
      hcLight: '#895503',
    });
    this._registerColor('gitDecoration.deletedResourceForeground', {
      light: '#ad0707',
      dark: '#c74e39',
      hcDark: '#c74e39',
      hcLight: '#ad0707',
    });
    this._registerColor('gitDecoration.renamedResourceForeground', {
      light: '#007100',
      dark: '#73C991',
      hcDark: '#73C991',
      hcLight: '#007100',
    });
    this._registerColor('gitDecoration.untrackedResourceForeground', {
      light: '#007100',
      dark: '#73C991',
      hcDark: '#73C991',
      hcLight: '#007100',
    });
    this._registerColor('gitDecoration.ignoredResourceForeground', {
      light: '#8E8E90',
      dark: '#8C8C8C',
      hcDark: '#A7A8A9',
      hcLight: '#8e8e90',
    });
    this._registerColor('gitDecoration.stageModifiedResourceForeground', {
      light: '#895503',
      dark: '#E2C08D',
      hcDark: '#E2C08D',
      hcLight: '#895503',
    });
    this._registerColor('gitDecoration.stageDeletedResourceForeground', {
      light: '#ad0707',
      dark: '#c74e39',
      hcDark: '#c74e39',
      hcLight: '#ad0707',
    });
    this._registerColor('gitDecoration.conflictingResourceForeground', {
      light: '#ad0707',
      dark: '#e4676b',
      hcDark: '#c74e39',
      hcLight: '#ad0707',
    });
    this._registerColor('gitDecoration.submoduleResourceForeground', {
      light: '#1258a7',
      dark: '#8db9e2',
      hcDark: '#8db9e2',
      hcLight: '#1258a7',
    });
  }

  private _registerColor(
    id: ColorIdentifier,
    defaults: IColorDefaults | ColorValue | null,
    needsTransparency?: boolean
  ): ColorIdentifier {
    this._defaults.set(id, defaults);
    return id;
  }

  private _executeTransform(
    transform: ColorTransform,
    type: VSCodeThemeColorType
  ): Color | undefined {
    switch (transform.op) {
      case ColorTransformType.Darken:
        return this._resolveColorValue(transform.value, type)?.darken(transform.factor);

      case ColorTransformType.Lighten:
        return this._resolveColorValue(transform.value, type)?.lighten(transform.factor);

      case ColorTransformType.Transparent:
        return this._resolveColorValue(transform.value, type)?.transparent(transform.factor);

      case ColorTransformType.Opaque: {
        const backgroundColor = this._resolveColorValue(transform.background, type);
        if (!backgroundColor) {
          return this._resolveColorValue(transform.value, type);
        }
        return this._resolveColorValue(transform.value, type)?.makeOpaque(backgroundColor);
      }

      case ColorTransformType.OneOf:
        for (const candidate of transform.values) {
          const color = this._resolveColorValue(candidate, type);
          if (color) {
            return color;
          }
        }
        return undefined;

      case ColorTransformType.IfDefinedThenElse:
        return this._resolveColorValue(
          this._defaults.get(transform.if) ? transform.then : transform.else,
          type
        );

      case ColorTransformType.LessProminent: {
        const from = this._resolveColorValue(transform.value, type);
        if (!from) {
          return undefined;
        }

        const backgroundColor = this._resolveColorValue(transform.background, type);
        if (!backgroundColor) {
          return from.transparent(transform.factor * transform.transparency);
        }

        return from.isDarkerThan(backgroundColor)
          ? Color.getLighterColor(from, backgroundColor, transform.factor).transparent(
              transform.transparency
            )
          : Color.getDarkerColor(from, backgroundColor, transform.factor).transparent(
              transform.transparency
            );
      }
      default:
        return undefined;
    }
  }

  private _resolveColorValue(
    colorValue: ColorValue | null,
    type: VSCodeThemeColorType
  ): Color | undefined {
    if (colorValue === null) return undefined;
    if (colorValue instanceof Color) return colorValue;

    if (isColorIdentifier(colorValue)) {
      const originColorValue = this._defaults.get(colorValue) ?? null;
      if (isColorDefaults(originColorValue)) {
        return this._resolveColorValue(originColorValue[type], type);
      }
      return this._resolveColorValue(originColorValue, type);
    }

    if (typeof colorValue === 'string' && colorValue.startsWith('#')) {
      return Color.fromHex(colorValue);
    }

    if (typeof colorValue === 'object' && 'op' in colorValue) {
      return this._executeTransform(colorValue, type);
    }

    return undefined;
  }

  public getThemeColor(themeColors: IVSCodeTheme['colors'], type: VSCodeThemeColorType) {
    const result: IVSCodeTheme['colors'] = {};
    const registry = new Map(this._defaults);
    Object.entries(themeColors).forEach(([key, color]) => {
      registry.set(key as ColorIdentifier, color);
    });

    registry.forEach((colorValue, key) => {
      const color = this._resolveColorValue(
        isColorDefaults(colorValue) ? colorValue[type] : colorValue,
        type
      );
      result[key] = color?.toString();
    });

    return result;
  }
}

export default ColorRegistry;
