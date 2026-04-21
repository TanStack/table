import { Match, Show, Switch } from 'solid-js'
import { Header, HeaderLogo, MainPanel, Select } from '@tanstack/devtools-ui'
import { useTableDevtoolsContext } from '../TableContextProvider'
import { useStyles } from '../styles/use-styles'
import { ColumnsPanel } from './ColumnsPanel'
import { FeaturesPanel } from './FeaturesPanel'
import { RowsPanel } from './RowsPanel'
import { StatePanel } from './StatePanel'
import { OptionsPanel } from './OptionsPanel'

const EMPTY_PANEL_KEY = '__table-devtools-empty__'

const tabs = [
  { id: 'features', label: 'Features' },
  { id: 'options', label: 'Options' },
  { id: 'state', label: 'State' },
  { id: 'rows', label: 'Rows' },
  { id: 'columns', label: 'Columns' },
] as const

export function Shell() {
  const styles = useStyles()
  const {
    activeTab,
    setActiveTab,
    selectedTargetId,
    setSelectedTargetId,
    table,
    targets,
  } = useTableDevtoolsContext()

  const tableOptions = () =>
    targets().map((target) => ({
      value: target.id,
      label: target.name ?? target.fallbackName,
    }))

  return (
    <MainPanel>
      <Header>
        <HeaderLogo
          flavor={{ light: '#06b6d4', dark: '#2563eb' }}
          onClick={() => {
            window.open('https://tanstack.com/table', '_blank')
          }}
        >
          TanStack Table
        </HeaderLogo>
      </Header>

      <div class={styles().mainContainer}>
        <Show when={tableOptions().length > 0}>
          <Show when={selectedTargetId() ?? EMPTY_PANEL_KEY} keyed>
            {(_selectedTargetId) => (
              <Select
                label="Table"
                options={tableOptions()}
                value={selectedTargetId()}
                onChange={(value) => setSelectedTargetId(value)}
              />
            )}
          </Show>
        </Show>

        <div class={styles().tabBar}>
          {tabs.map((tab) => (
            <button
              type="button"
              class={`${styles().tabButton} ${
                activeTab() === tab.id ? styles().tabButtonActive : ''
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div class={styles().contentArea}>
          <Show when={table() ?? EMPTY_PANEL_KEY} keyed>
            {(_table) => (
              <Switch>
                <Match when={activeTab() === 'features'}>
                  <FeaturesPanel />
                </Match>
                <Match when={activeTab() === 'state'}>
                  <StatePanel />
                </Match>
                <Match when={activeTab() === 'options'}>
                  <OptionsPanel />
                </Match>
                <Match when={activeTab() === 'rows'}>
                  <RowsPanel />
                </Match>
                <Match when={activeTab() === 'columns'}>
                  <ColumnsPanel />
                </Match>
              </Switch>
            )}
          </Show>
        </div>
      </div>
    </MainPanel>
  )
}
