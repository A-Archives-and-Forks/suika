/**
 * UI 也要跟着更新，为此需要给 editor 对象加一个状态 isEditingCurve？
 * 算了，还是通过事件告知给 UI 层。UI 层显示正在编辑曲线中。。。
 *
 *
 * 历史记录处理。
 *
 * 撤销的时候，如果是是一个和贝塞尔曲线有关的命令，会进入到 “曲线编辑模式”
 *
 * **编辑曲线模式**
 *
 * 此时不能切换到其他工具，只能在 pen、pencil 和 select 工具之间切换
 *
 */

export class CurveEditor {
  private active = false;
}
