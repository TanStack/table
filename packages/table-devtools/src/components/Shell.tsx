import { Match, Switch } from 'solid-js'
import { Header, HeaderLogo, MainPanel } from '@tanstack/devtools-ui'
import { useTableDevtoolsContext } from '../TableContextProvider'
import { useStyles } from '../styles/use-styles'
import { FeaturesPanel } from './FeaturesPanel'
import { RowsPanel } from './RowsPanel'
import { StatePanel } from './StatePanel'
import { OptionsPanel } from './OptionsPanel'

const tabs = [
  { id: 'features', label: 'Features' },
  { id: 'state', label: 'State' },
  { id: 'options', label: 'Options' },
  { id: 'rows', label: 'Rows' },
] as const

export function Shell() {
  const styles = useStyles()
  const { activeTab, setActiveTab } = useTableDevtoolsContext()

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
          </Switch>
        </div>
      </div>
    </MainPanel>
  )
}
