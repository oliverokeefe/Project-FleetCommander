


import type { comparator } from '../../../shared/src/types/types.js';

export class PriorityQueue {

    private _top = 0;
    private _parent = i => ((i + 1) >>> 1) - 1;
    private _left = i => (i << 1) + 1;
    private _right = i => (i + 1) << 1;
    private _heap: Array<any>;
    private _comparator: comparator;

    constructor(comparator: comparator = (a, b) => a > b) {
        this._heap = [];
        this._comparator = comparator;
    }

    private _greater(i, j) {
        return this._comparator(this._heap[i], this._heap[j]);
    }

    private _swap(i, j) {
        [this._heap[i], this._heap[j]] = [this._heap[j], this._heap[i]];
    }

    private _siftUp() {
        let node = this.size() - 1;
        while (node > this._top && this._greater(node, this._parent(node))) {
            this._swap(node, this._parent(node));
            node = this._parent(node);
        }
    }

    private _siftDown() {
        let node = this._top;
        while (
            (this._left(node) < this.size() && this._greater(this._left(node), node)) ||
            (this._right(node) < this.size() && this._greater(this._right(node), node))
        ) {
            let maxChild = (this._right(node) < this.size() && this._greater(this._right(node), this._left(node))) ? this._right(node) : this._left(node);
            this._swap(node, maxChild);
            node = maxChild;
        }
    }

    public size() {
        return this._heap.length;
    }

    public isEmpty() {
        return this.size() == 0;
    }

    public peek() {
        return this._heap[this._top];
    }

    public push(...values) {
        values.forEach(value => {
            this._heap.push(value);
            this._siftUp();
        });
        return this.size();
    }

    public pop() {
        const poppedValue = this.peek();
        const bottom = this.size() - 1;
        if (bottom > this._top) {
            this._swap(this._top, bottom);
        }
        this._heap.pop();
        this._siftDown();
        return poppedValue;
    }

    public replace(value) {
        const replacedValue = this.peek();
        this._heap[this._top] = value;
        this._siftDown();
        return replacedValue;
    }
}


