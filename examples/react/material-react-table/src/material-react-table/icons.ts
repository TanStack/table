import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import ArrowRightIcon from '@mui/icons-material/ArrowRight'
import CancelIcon from '@mui/icons-material/Cancel'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ClearAllIcon from '@mui/icons-material/ClearAll'
import CloseIcon from '@mui/icons-material/Close'
import ContentCopy from '@mui/icons-material/ContentCopy'
import DensityLargeIcon from '@mui/icons-material/DensityLarge'
import DensityMediumIcon from '@mui/icons-material/DensityMedium'
import DensitySmallIcon from '@mui/icons-material/DensitySmall'
import DragHandleIcon from '@mui/icons-material/DragHandle'
import DynamicFeedIcon from '@mui/icons-material/DynamicFeed'
import EditIcon from '@mui/icons-material/Edit'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import FilterAltIcon from '@mui/icons-material/FilterAlt'
import FilterListIcon from '@mui/icons-material/FilterList'
import FilterListOffIcon from '@mui/icons-material/FilterListOff'
import FirstPageIcon from '@mui/icons-material/FirstPage'
import FullscreenIcon from '@mui/icons-material/Fullscreen'
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit'
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown'
import LastPageIcon from '@mui/icons-material/LastPage'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import PushPinIcon from '@mui/icons-material/PushPin'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import SaveIcon from '@mui/icons-material/Save'
import SearchIcon from '@mui/icons-material/Search'
import SearchOffIcon from '@mui/icons-material/SearchOff'
import SortIcon from '@mui/icons-material/Sort'
import SyncAltIcon from '@mui/icons-material/SyncAlt'
import ViewColumnIcon from '@mui/icons-material/ViewColumn'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'

export const MRT_Default_Icons = {
  ArrowDownwardIcon,
  ArrowRightIcon,
  CancelIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClearAllIcon,
  CloseIcon,
  ContentCopy,
  DensityLargeIcon,
  DensityMediumIcon,
  DensitySmallIcon,
  DragHandleIcon,
  DynamicFeedIcon,
  EditIcon,
  ExpandMoreIcon,
  FilterAltIcon,
  FilterListIcon,
  FilterListOffIcon,
  FirstPageIcon,
  FullscreenExitIcon,
  FullscreenIcon,
  KeyboardDoubleArrowDownIcon,
  LastPageIcon,
  MoreHorizIcon,
  MoreVertIcon,
  PushPinIcon,
  RestartAltIcon,
  SaveIcon,
  SearchIcon,
  SearchOffIcon,
  SortIcon,
  SyncAltIcon,
  ViewColumnIcon,
  VisibilityOffIcon,
} as const

export type MRT_Icons = Record<keyof typeof MRT_Default_Icons, any>
