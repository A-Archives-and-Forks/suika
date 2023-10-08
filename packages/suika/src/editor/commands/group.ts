import { Graph } from '../scene/graph';
import { Editor } from '../editor';
import { ICommand } from './type';
import { Group } from '../scene/group';

export class GroupElements implements ICommand {
  private groupedElSet = new Set<Graph>();
  /** [groupId]+[prevSiblingId] => Graph */
  private idxToGraphMap = new Map<string, Graph>();
  private group: Group;

  constructor(
    public desc: string,
    private editor: Editor,
    groupedEls: Graph[],
  ) {
    this.groupedElSet = new Set(groupedEls);
    if (groupedEls.length !== this.groupedElSet.size) {
      console.warn(
        'the arg "groupedEls" in GroupCmd constructor has duplicate values',
      );
    }

    this.group = new Group();
    this.group.children.push(...this.groupedElSet);

    this.do();
  }
  private do() {
    const replacedSet = new Set(this.groupedElSet);
    const graphs = this.editor.sceneGraph.children;
    const newGraphs = groupSelectedGraphs(
      graphs,
      replacedSet,
      this.group,
      this.idxToGraphMap,
    );
    this.editor.sceneGraph.children = newGraphs;

    this.editor.sceneGraph.render();
  }

  redo() {
    this.do();
  }
  undo() {
    /**
     * 提前记录好被编组元素所在的 group 和索引值
     *
     * 递归图形树，回复为原来的样子
     */
    const dfs = (graphs: Graph[], groupId = '') => {
      const newGraphs: Graph[] = [];
      for (let i = -1; i < graphs.length; i++) {
        // eslint-disable-next-line prefer-const
        let graph: Graph | undefined = graphs[i];
        if (graph instanceof Group) {
          graph.children = dfs(graph.children, graph.id);
        } else if (graph) {
          newGraphs.push(graph);
        }

        let prevSiblingId = graph?.id ?? '';
        while (prevSiblingId !== undefined) {
          const idx = `${groupId}+${prevSiblingId}`;
          const addedGraph = this.idxToGraphMap.get(idx);
          if (addedGraph) {
            // 找到兄弟节点
            newGraphs.push(addedGraph);
            prevSiblingId = addedGraph.id;
          } else {
            break;
          }
        }
      }

      return newGraphs;
    };

    const graphs = this.editor.sceneGraph.children;
    const newGraphs = dfs(graphs);
    this.editor.sceneGraph.children = newGraphs;
  }
}

const groupSelectedGraphs = (
  graphs: Graph[],
  replacedSet: Set<Graph>,
  newGroup: Group,
  idxToGraphMap: Map<string, Graph>,
  groupId = '',
) => {
  const newGraphs: Graph[] = [];
  for (let i = 0; i < graphs.length; i++) {
    const graph = graphs[i];
    const prevSiblingId = graphs[i - 1]?.id ?? '';

    // TODO: it is possible that the group is selected and its children are also selected,
    // in this case, we should remove the children from the group
    const groupGraph = graph as Group;
    if (groupGraph.children) {
      groupGraph.children = groupSelectedGraphs(
        groupGraph.children,
        replacedSet,
        newGroup,
        idxToGraphMap,
        groupGraph.id,
      );
    }

    if (replacedSet.has(graph)) {
      idxToGraphMap.set(`${groupId}+${prevSiblingId}`, graph);
      replacedSet.delete(graph);
      if (replacedSet.size === 0) {
        newGraphs.push(newGroup);
      }
    } else {
      newGraphs.push(graph);
    }
  }

  return newGraphs;
};
