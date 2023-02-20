  class Astar {
    constructor(width, height) {
      this.map_data = []
      this.width = width
      this.height = height
      for (let i = 0; i < width * height; i++)
        this.map_data.push(0)
    }

    setCode(code, x, y) {
      this.map_data[y * this.width + x] = code;
    }

    getCode(x, y) {
      return this.map_data[y * this.width + x];
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

    findPath(start, goal) {
      const frontier = this.newQueue()
      const steps = new Map();
      const costSoFar = new Map();
      frontier.put(start, 0);
      steps.set(start, null);
      costSoFar.set(start,0);
      while (frontier.notEmpty()) {
        const current = frontier.get();
        if (current.x == goal.x && current.y == goal.y)
          return 
        this.neighbors(current).forEach(currNeighbor => {
          const currCost = costSoFar.get(current)
          const new_cost = currCost + this.cost(current, currNeighbor)
          if (!costSoFar.has(currNeighbor) || new_cost < costSoFar.get(currNeighbor)) {
            costSoFar.set(currNeighbor,new_cost);
            frontier.put(currNeighbor, new_cost + this.cost(currNeighbor, goal))
            steps.set(currNeighbor, current);
          }
        })
      }
      console.log("Can't find the path to the goal");
      return;
    }
  }
