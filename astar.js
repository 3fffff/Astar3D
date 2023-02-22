class A_3d {
  constructor() {
    this.w = 100;
    this.h = 100;
    this.map_data = new Uint8Array(this.w * this.h)
  }

  getMap() {
    return this.map_data;
  }

  setCode(code, x, y) {
    this.map_data[y * this.w + x] = code;
  }

  buildPathBySteps(start, goal, steps) {
    if (steps.length === 0) return;
    let result = [];
    let current = goal
    while (current !== start) {
      result.push(current);
      current = steps.get(current)
      if (!current) return
    }
    result.push(start);
    result = result.reverse();

    const lines = [];
    let from = result[0]
    let to;
    for (let i = 1; i < result.length; i++) {
      to = result[i]
      lines.push([from.x, from.y, to.x, to.y])
      from = to;
    }
    return lines;
  }

  newQueue() {
    class PriorityQueue {
      constructor() {
        this.data = []
      }

      notEmpty() {
        return this.data.length > 0
      }

      get() {
        this.data.sort((a, b) => (a.priority - b.priority));
        const result = this.data.shift().item
        return result;
      }

      put(item, priority) {
        this.data.push({ item, priority })
      }
    }

    return new PriorityQueue();
  }

  neighbors(current) {
    const result = []
    for (let dx = -1; dx <= 1; dx++)
      for (let dy = -1; dy <= 1; dy++)
        if (Math.abs(dx) != Math.abs(dy) && this.map_data[(current.y + dy) * this.width + current.x + dx] != 1)
          result.push({ x: current.x + dx, y: current.y + dy })
    return result;
  }

  cost(current, next) {
    return Math.abs(current.x - next.x) + Math.abs(current.y - next.y)
  }
  distance(from, to) {
    return Math.sqrt((from.x - to.x) * (from.x - to.x) + (from.y - to.y) * (from.y - to.y));
  }
  coordToId(coord) {
    return coord.y * this.w + coord.x
  }
  idToCoord(id) {
    const y = ~~(id / this.w)
    const x = id % this.w
    return { x, y }
  }

  findPath(start, goal) {
    const frontier = this.newQueue()
    const steps = new Map();
    const costSoFar = new Map();
    frontier.put(start, 0);
    steps.set(start, null);
    costSoFar.set(start, 0);
    while (frontier.notEmpty()) {
      const current = frontier.get();
      if (current.x == goal.x && current.y == goal.y)
        return this.buildPathBySteps(start, goal, steps);
      this.neighbors(current).forEach(currNeighbor => {
        const currCost = costSoFar.get(current)
        const new_cost = currCost + this.cost(current, currNeighbor)
        if (!costSoFar.has(currNeighbor) || new_cost < costSoFar.get(currNeighbor)) {
          costSoFar.set(currNeighbor, new_cost);
          frontier.put(currNeighbor, new_cost + this.cost(currNeighbor, goal))
          steps.set(currNeighbor, current);
        }
      })
    }
    console.log("Can't find the path to the goal");
    return;
  }
}
