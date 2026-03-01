class priorityQueue<T> {
    private data: T[] = []
    private compare: (a: T, b: T) => number

    constructor(compare: (a: T, b: T) => number) {
        this.compare = compare
    }

    // same as enqueue
    add(value: T) {
        let left = 0
        let right = this.data.length

        // binary search insertion
        while (left < right) {
            const mid = Math.floor((left + right) / 2)
            if (this.compare(this.data[mid]!, value) < 0) {
                left = mid + 1
            } else {
                right = mid
            }
        }

        this.data.splice(left, 0, value)
    }

    // same as remove specific item (optional in PQ)
    delete(value: T) {
        const index = this.data.findIndex(v => this.compare(v, value) === 0)
        if (index !== -1) {
            this.data.splice(index, 1)
        }
    }

    // same as dequeue (highest priority)
    pop(): T | undefined {
        return this.data.shift()
    }

    // same as peek
    first(): T | undefined {
        return this.data[0]
    }

    values(): T[] {
        return this.data
    }

    size(): number {
        return this.data.length
    }
}

export default priorityQueue