import { Editor } from '../editor';
import { ITool } from './type';

/**
 * pen tool
 */
export class PenTool implements ITool {
  static readonly type = 'pen';
  readonly type = 'pen';
  readonly hotkey = 'p';

  constructor(private editor: Editor) {}
  active() {
    this.editor.setCursor('');
  }
  inactive() {
    this.editor.setCursor('');
  }
  moveExcludeDrag() {
    // do nothing
  }
  start() {
    // do nothing
    /**
     * 创建一个 cur
     */
  }
  drag() {
    // do nothing
  }

  end(e: PointerEvent) {
    // ...
  }

  afterEnd() {
    // do nothing
  }
}
