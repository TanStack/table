import * as goober from 'goober'
import { createEffect, createSignal } from 'solid-js'
import { useTheme } from '@tanstack/devtools-ui'
import { tokens } from './tokens'

const stylesFactory = (theme: 'light' | 'dark') => {
  const { colors, size, border, font, alpha } = tokens
  const css = goober.css
  const t = (light: string, dark: string) => (theme === 'light' ? light : dark)

  return {
    mainContainer: css`
      display: flex;
      flex: 1;
      min-height: 0;
      flex-direction: column;
      overflow: hidden;
      padding: ${size[2]};
      gap: ${size[2]};
      font-family: ${font.family.sans};
    `,
    tabBar: css`
      display: flex;
      gap: ${size[2]};
      align-items: center;
      flex-wrap: wrap;
    `,
    tabButton: css`
      border: 1px solid ${t(colors.gray[300], colors.darkGray[600])};
      border-radius: ${border.radius.md};
      background: ${t(colors.gray[100], colors.darkGray[800])};
      color: ${t(colors.gray[700], colors.gray[200])};
      font-size: ${font.size.sm};
      font-weight: ${font.weight.semibold};
      padding: ${size[2]} ${size[3]};
      cursor: pointer;
      transition:
        background 0.15s ease,
        border-color 0.15s ease;

      &:hover {
        background: ${t(colors.gray[200], colors.darkGray[700])};
      }
    `,
    tabButtonActive: css`
      background: ${t(
        colors.red[500] + alpha[20],
        colors.red[700] + alpha[20],
      )};
      border-color: ${t(colors.red[500], colors.red[300])};
      color: ${t(colors.red[700], colors.red[300])};
    `,
    contentArea: css`
      flex: 1;
      min-height: 0;
      border: 1px solid ${t(colors.gray[200], colors.darkGray[700])};
      border-radius: ${border.radius.lg};
      background: ${t(colors.gray[100], colors.darkGray[800])};
      overflow: hidden;
    `,
    panelScroll: css`
      height: 100%;
      overflow: auto;
      padding: ${size[3]};
      display: flex;
      flex-direction: column;
      gap: ${size[3]};
    `,
    section: css`
      border: 1px solid ${t(colors.gray[200], colors.darkGray[700])};
      border-radius: ${border.radius.md};
      background: ${t(colors.white, colors.darkGray[900])};
      padding: ${size[3]};
    `,
    sectionTitle: css`
      font-size: ${font.size.md};
      font-weight: ${font.weight.bold};
      margin-bottom: ${size[2]};
      color: ${t(colors.gray[900], colors.gray[100])};
    `,
    tableWrapper: css`
      overflow: auto;
      border: 1px solid ${t(colors.gray[200], colors.darkGray[700])};
      border-radius: ${border.radius.sm};
    `,
    rowsTable: css`
      width: 100%;
      border-collapse: collapse;
      font-size: ${font.size.sm};
    `,
    headerCell: css`
      text-align: left;
      padding: ${size[2]};
      border-bottom: 1px solid ${t(colors.gray[200], colors.darkGray[700])};
      border-right: 1px solid ${t(colors.gray[200], colors.darkGray[700])};
      white-space: nowrap;
      background: ${t(colors.gray[100], colors.darkGray[800])};
      color: ${t(colors.gray[900], colors.gray[100])};
      font-weight: ${font.weight.semibold};
    `,
    bodyCell: css`
      padding: ${size[2]};
      border-bottom: 1px solid ${t(colors.gray[200], colors.darkGray[700])};
      border-right: 1px solid ${t(colors.gray[200], colors.darkGray[700])};
      color: ${t(colors.gray[900], colors.gray[100])};
      vertical-align: top;
      min-width: 120px;
      white-space: pre-wrap;
      word-break: break-word;
    `,
    bodyCellMono: css`
      padding: ${size[2]};
      border-bottom: 1px solid ${t(colors.gray[200], colors.darkGray[700])};
      border-right: 1px solid ${t(colors.gray[200], colors.darkGray[700])};
      color: ${t(colors.gray[700], colors.gray[300])};
      font-family: ${font.family.mono};
      vertical-align: top;
      white-space: nowrap;
    `,
    featuresSplitContainer: css`
      display: flex;
      flex-direction: row;
      flex: 1;
      min-height: 0;
      overflow: hidden;
      gap: ${size[3]};
    `,
    resizableSplitContainer: css`
      display: flex;
      flex-direction: row;
      flex: 1;
      min-height: 0;
      overflow: hidden;
    `,
    resizeHandle: css`
      flex: 0 0 6px;
      min-width: 6px;
      cursor: col-resize;
      background: ${t(colors.gray[200], colors.darkGray[700])};
      transition: background 0.15s ease;

      &:hover {
        background: ${t(colors.gray[300], colors.darkGray[600])};
      }

      &:active {
        background: ${t(colors.blue[500], colors.blue[500])};
      }
    `,
    featuresSection: css`
      flex: 1;
      min-width: 0;
      min-height: 0;
      overflow: auto;
    `,
    featureSubsection: css`
      margin-bottom: ${size[3]};
    `,
    featureSubsectionTitle: css`
      font-size: ${font.size.sm};
      font-weight: ${font.weight.semibold};
      margin-bottom: ${size[2]};
      color: ${t(colors.gray[700], colors.gray[300])};
    `,
    featureEstimateSummary: css`
      border: 1px solid ${t(colors.gray[200], colors.darkGray[700])};
      border-radius: ${border.radius.md};
      background: ${t(colors.white, colors.darkGray[900])};
      padding: ${size[3]};
      margin-bottom: ${size[3]};
      display: flex;
      flex-direction: column;
      gap: ${size[2]};
    `,
    featureEstimateSummaryTitle: css`
      font-size: ${font.size.sm};
      font-weight: ${font.weight.semibold};
      color: ${t(colors.gray[900], colors.gray[100])};
    `,
    featureEstimateSummaryRow: css`
      display: flex;
      justify-content: space-between;
      gap: ${size[3]};
      font-size: ${font.size.sm};
      color: ${t(colors.gray[700], colors.gray[200])};
      font-family: ${font.family.mono};
    `,
    featureEstimateSummaryTotal: css`
      display: flex;
      justify-content: space-between;
      gap: ${size[3]};
      padding-top: ${size[2]};
      border-top: 1px solid ${t(colors.gray[200], colors.darkGray[700])};
      font-size: ${font.size.sm};
      font-weight: ${font.weight.semibold};
      color: ${t(colors.gray[900], colors.gray[100])};
      font-family: ${font.family.mono};
    `,
    featureEstimateSummaryNote: css`
      font-size: ${font.size.xs};
      color: ${t(colors.gray[500], colors.darkGray[600])};
      line-height: 1.4;
    `,
    featureListItem: css`
      display: flex;
      align-items: center;
      gap: ${size[2]};
      padding: ${size[1]} 0;
      font-size: ${font.size.sm};
      font-family: ${font.family.mono};
      color: ${t(colors.gray[700], colors.gray[200])};
    `,
    featureLabel: css`
      flex: 1;
      min-width: 0;
    `,
    featureMeta: css`
      flex-shrink: 0;
      color: ${t(colors.gray[500], colors.gray[300])};
      font-size: ${font.size.xs};
      text-align: right;
    `,
    featureCheck: css`
      color: ${t('#16a34a', '#4ade80')};
      flex-shrink: 0;
    `,
    featureUncheck: css`
      color: ${t(colors.gray[500], colors.darkGray[600])};
      flex-shrink: 0;
    `,
    rowModelItem: css`
      display: flex;
      align-items: baseline;
      gap: ${size[2]};
      padding: ${size[1]} 0;
      font-size: ${font.size.sm};
      font-family: ${font.family.mono};
      color: ${t(colors.gray[700], colors.gray[200])};
    `,
    rowModelFnItem: css`
      padding: ${size[1]} 0 ${size[1]} ${size[4]};
      font-size: ${font.size.sm};
      font-family: ${font.family.mono};
      color: ${t(colors.gray[500], colors.gray[300])};
    `,
    rowModelExecutionOrder: css`
      margin-top: ${size[3]};
      padding-top: ${size[3]};
      border-top: 1px solid ${t(colors.gray[200], colors.darkGray[700])};
      font-size: ${font.size.xs};
      font-family: ${font.family.mono};
      color: ${t(colors.gray[500], colors.darkGray[600])};
      line-height: 1.5;
    `,
    rowModelExecutionOrderBold: css`
      font-weight: ${font.weight.bold};
      color: ${t(colors.gray[700], colors.gray[200])};
    `,
    rowModelSelectRow: css`
      display: flex;
      align-items: center;
      gap: ${size[2]};
      margin-bottom: ${size[2]};
    `,
    rowModelSelect: css`
      border: 1px solid ${t(colors.gray[300], colors.darkGray[600])};
      border-radius: ${border.radius.md};
      background: ${t(colors.gray[100], colors.darkGray[800])};
      color: ${t(colors.gray[700], colors.gray[200])};
      font-size: ${font.size.sm};
      font-family: ${font.family.mono};
      padding: ${size[2]} ${size[3]};
      cursor: pointer;
    `,
    rowLimitNote: css`
      font-weight: ${font.weight.normal};
      color: ${t(colors.gray[500], colors.darkGray[600])};
      font-size: ${font.size.sm};
    `,
    buttonRow: css`
      display: flex;
      gap: ${size[2]};
      margin-bottom: ${size[2]};
      flex-wrap: wrap;
    `,
    copyButton: css`
      border: 1px solid ${t(colors.gray[300], colors.darkGray[600])};
      border-radius: ${border.radius.md};
      background: ${t(colors.gray[100], colors.darkGray[800])};
      color: ${t(colors.gray[700], colors.gray[200])};
      font-size: ${font.size.sm};
      padding: ${size[1]} ${size[2]};
      cursor: pointer;

      &:hover {
        background: ${t(colors.gray[200], colors.darkGray[700])};
      }
    `,
    pasteButton: css`
      border: 1px solid ${t(colors.gray[300], colors.darkGray[600])};
      border-radius: ${border.radius.md};
      background: ${t(colors.gray[100], colors.darkGray[800])};
      color: ${t(colors.gray[700], colors.gray[200])};
      font-size: ${font.size.sm};
      padding: ${size[1]} ${size[2]};
      cursor: pointer;

      &:hover {
        background: ${t(colors.gray[200], colors.darkGray[700])};
      }
    `,
    resetButton: css`
      border: 1px solid ${t(colors.red[300], colors.red[700])};
      border-radius: ${border.radius.md};
      background: ${t(colors.gray[100], colors.darkGray[800])};
      color: ${t(colors.red[700], colors.red[300])};
      font-size: ${font.size.sm};
      padding: ${size[1]} ${size[2]};
      cursor: pointer;

      &:hover {
        background: ${t(colors.gray[200], colors.darkGray[700])};
      }
    `,
    summarySection: css`
      margin-bottom: ${size[3]};
    `,
    summaryItem: css`
      font-size: ${font.size.sm};
      color: ${t(colors.gray[700], colors.gray[200])};
      margin-bottom: ${size[1]};
    `,
    pasteError: css`
      font-size: ${font.size.sm};
      color: ${t(colors.red[700], colors.red[300])};
      margin-top: ${size[2]};
    `,
    atomRow: css`
      display: flex;
      flex-direction: column;
      gap: ${size[1]};
      padding: ${size[2]};
      border: 1px solid ${t(colors.gray[200], colors.darkGray[700])};
      border-radius: ${border.radius.sm};
      background: ${t(colors.white, colors.darkGray[900])};
      margin-bottom: ${size[2]};
    `,
    atomRowHeader: css`
      display: flex;
      align-items: center;
      gap: ${size[2]};
      flex-wrap: wrap;
    `,
    atomKey: css`
      font-size: ${font.size.sm};
      font-weight: ${font.weight.semibold};
      color: ${t(colors.gray[900], colors.gray[100])};
      font-family: ${font.family.mono};
      flex: 1;
      min-width: 0;
    `,
    atomBadge: css`
      display: inline-flex;
      align-items: center;
      gap: ${size[1]};
      font-size: ${font.size.xs};
      font-weight: ${font.weight.semibold};
      padding: 2px ${size[2]};
      border-radius: ${border.radius.sm};
      white-space: nowrap;
    `,
    atomBadgeInternal: css`
      color: ${t(colors.gray[700], colors.gray[200])};
      background: ${t(colors.gray[100], colors.darkGray[800])};
      border: 1px solid ${t(colors.gray[300], colors.darkGray[600])};
    `,
    atomBadgeExternalAtom: css`
      color: ${t(colors.blue[700], colors.blue[500])};
      background: ${t(
        colors.blue[500] + alpha[20],
        colors.blue[500] + alpha[20],
      )};
      border: 1px solid ${t(colors.blue[500], colors.blue[500])};
    `,
    atomBadgeExternalState: css`
      color: ${t('#a16207', '#facc15')};
      background: ${t('#fef9c3', '#422006')};
      border: 1px solid ${t('#eab308', '#facc15')};
    `,
    atomValue: css`
      font-family: ${font.family.mono};
      font-size: ${font.size.xs};
      color: ${t(colors.gray[700], colors.gray[300])};
      padding: ${size[1]} 0;
    `,
  }
}

export function useStyles() {
  const { theme } = useTheme()
  const [styles, setStyles] = createSignal(stylesFactory(theme()))

  createEffect(() => {
    setStyles(stylesFactory(theme()))
  })

  return styles
}
