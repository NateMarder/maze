/**
 * dfs module
 * @fileOverview ToDo: Add file description
 * @module dfs
 */
const dfs = () => {
  function dfs(mazeGraph) {
    this.solutionPath = [];
    this.mazeGraph = mazeGraph;
  }
  dfs.prototype.iterativedfs = function (startNodeKey, endNodeKey) {
    const alias = this;
    let isSovable = false;
    const v = this.mazeGraph.nodes[startNodeKey];
    const stack = [];
    stack.push(v);
    while (stack.length > 0) {
      const w = stack.pop();
      this.visit(w);
      if (w.isEnd) {
        isSovable = true;
        break;
      }
      for (let i = 0; i < w.siblings.length; i++) {
        const nextKey = w.siblings[i];
        const sibling = alias.mazeGraph.nodes[nextKey];
        if (!sibling.isVisited) {
          stack.push(sibling);
        }
      }
    }
    if (isSovable) {
      $('#path-found')
        .show()
        .fadeOut(5000);
    } else {
      $('#path-not-found')
        .show()
        .fadeOut(5000);
    }
    return isSovable;
  };
  dfs.prototype.visit = function (node) {
    node.isVisited = true;
    if (!node.isEnd && !node.isStart) {
      $(`#${node.key}`).hide();
      node.svg.setAttribute('class', 'mz-node visited-node');
      $(`#${node.key}`).fadeIn(5000);
    }
  };
  dfs.prototype.setUpRecursivedfs = function (startNodeKey, endNodeKey) {
    const v = this.mazeGraph.nodes[startNodeKey];
    const stack = [];
    stack.push(v);
    const canSolve = this.recursivedfs(startNodeKey, endNodeKey, stack);
    if (canSolve) {
      $('#path-found').fadeIn(500, function () {
        $(this).fadeOut(500);
      });
    } else {
      $('#path-not-found')
        .addClass('fa-spin')
        .fadeIn(500, function () {
          $(this).fadeOut(500);
        });
    }
  };
  dfs.prototype.recursivedfs = function (startNodeKey, endNodeKey, stack) {
    if (stack.length > 0) {
      const w = stack.pop();
      this.visit(w);
      if (w.isEnd) {
        return true;
      }
      for (let i = 0; i < w.siblings.length; i++) {
        const nextKey = w.siblings[i];
        const sibling = this.mazeGraph.nodes[nextKey];
        if (!sibling.isVisited) {
          stack.push(sibling);
        }
      }
      return this.recursivedfs(startNodeKey, endNodeKey, stack);
    }
    return false;
  };
  return dfs;
};
export { dfs };
