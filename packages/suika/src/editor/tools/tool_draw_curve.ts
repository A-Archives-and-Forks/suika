import { Editor } from '../editor';
import { ITool } from './type';

/**
 * Draw Curve Tool (Bezier Curve)
 */
export class DrawCurveTool implements ITool {
  static readonly type = 'drawCurve';
  readonly type = 'drawCurve';
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
    // 进入贝塞尔曲线编辑模式
    this.editor.bezierEditor.visible();
  }
  drag() {
    // do nothing
  }

  end() {
    // do nothing
  }

  afterEnd() {
    // do nothing
  }
}
