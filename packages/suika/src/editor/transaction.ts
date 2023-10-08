import { Graph } from './scene/graph';
import { Group } from './scene/group';

/**
 * 对图形的操作，本质是增删改
 * 所以我们其实可以统一用 updateSet、removedSet 来定义一个操作
 */
export class Transaction {
  private addedItems: Graph[] = [];
  private removedItems: (Graph | string)[] = []; // graph or id
  addItems(items: Graph[]) {
    this.addedItems.push(...items);
  }
  removeItems(items: Array<Graph | string>) {
    this.removedItems.push(...items);
  }
  commit(items: Graph[]) {
    // 删除
    const newItems: Graph[] = [];
    for (const item of items) {
      if (this.removedItems.includes(item)) {
        // 记录位置
        continue;
      }

      const groupItem = item as Group;
      if (groupItem.children && groupItem.children.length > 0) {
        // 如果是组合图形，需要递归删除
        this.commit(groupItem.children);
      }

      newItems.push(item);
    }

    // TODO: 返回一个 revertPatch
  }
}
