  class a_star {
    constructor(width, height) {
      this.map_data = new Uint8Array(width * height)
      this.width = width
      this.height = height
    }

    setCode(code, x, y) {
      this.map_data[y * this.width + x] = code;
      pen.drawByCode(this.map_data[y * this.width + x], x, y)
    }

    getCode(x, y) {
      return this.map_data[y * this.width + x];
    }

    /*  reset() {
        for (let i = 0; i < this.width; i++) {
          for (let j = 0; j < this.height; j++) {
            pen.clearRect(i, j)
            pen.drawByCode(this.map_data[j * this.width + i], i, j)
          }
        }
      }*/

    newQueue() {
      class PriorityQueue {
        constructor() {
          this.data = []
          this.length = this.data.length;
          this.compare = function (a, b) { return a.priority - b.priority }
        }

        notEmpty() {
          return this.length > 0
        }

        get() {
          if (this.length === 0) return undefined;

          var top = this.data[0];
          this.length--;

          if (this.length > 0) {
            this.data[0] = this.data[this.length];
            this._down(0);
          }
          this.data.pop();

          return top.item;
        }

        put(item, priority) {
          this.data.push({ item, priority });
          this.length++;
          this._up(this.length - 1);
        }

        _up(pos) {
          var data = this.data;
          var item = data[pos];

          while (pos > 0) {
            var parent = (pos - 1) >> 1;
            var current = data[parent];
            if (this.compare(item, current) >= 0) break;
            data[pos] = current;

            pos = parent;
          }

          data[pos] = item;
        }

        _down(pos) {
          var data = this.data;
          var halfLength = this.length >> 1;
          var item = data[pos];
          while (pos < halfLength) {
            var left = (pos << 1) + 1;
            var right = left + 1;
            var best = data[left];

            if (right < this.length && this.compare(data[right], best) < 0) {
              left = right;
              best = data[right];
            }
            if (this.compare(best, item) >= 0) break;

            data[pos] = best;
            pos = left;
          }

          data[pos] = item;
        }
        updateItem(pos) {
          this._down(pos);
          this._up(pos);
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

    reconstructPath(searchState) {
      var path = [searchState.node];
      var parent = searchState.parent;

      while (parent) {
        path.push(parent.node);
        parent = parent.parent;
      }

      return path;
    }

    findPath(start, goal) {
      const openList = this.newQueue()
      const steps = [];
      const visited = new Uint8Array(this.width * this.height)
      openList.put(start, 0);
      steps.push({ parent: null, node: start });
      visited[start.y * this.width + start.x] = 0;
      console.time()
      while (openList.notEmpty()) {
        const current = openList.get();
        if (current.x == goal.x && current.y == goal.y) {
          console.timeEnd()
          return
        }
        //return this.reconstructPath(steps);
        this.neighbors(current).forEach(currNeighbor => {
          if (visited[currNeighbor.y * this.width + currNeighbor.x] == 0) {
            const newCost = visited[current.y * this.width + current.x] + this.cost(current, currNeighbor)
            //if (newCost >= visited[currNeighbor.y * this.width + currNeighbor.x]) return
            visited[currNeighbor.y * this.width + currNeighbor.x] = newCost
            openList.put(currNeighbor, newCost + this.cost(currNeighbor, goal))
            steps.push({ parent: current, node: currNeighbor });
            //openList.updateItem(currNeighbor.heapIndex);
          }
        })
      }
      console.log("Can't find the path to the goal");
      return;
    }
  }
