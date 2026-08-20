import { ChangeDetectionStrategy, Component } from '@angular/core'
import { CdkDragHandle } from '@angular/cdk/drag-drop'

@Component({
  selector: 'drag-handle-cell',
  template: ` <button cdkDragHandle>🟰</button> `,
  imports: [CdkDragHandle],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DragHandleCell {}
