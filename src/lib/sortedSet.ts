class SortedSet<T> {
    private data: T[] = []
    private compare: (a: T, b: T) => number

    constructor(compare: (a: T, b: T) => number) {
        this.compare = compare
    }

    add(value: T) {
        let left = 0
        let right = this.data.length

        while (left < right) {
            const mid = Math.floor((left + right) / 2)
            if (this.compare(this.data[mid]!, value) < 0) left = mid + 1
            else right = mid
        }

        // avoid duplicates
        if (this.data[left] === undefined || this.compare(this.data[left]!, value) !== 0) {
            this.data.splice(left, 0, value)
        }
    }

    delete(value: T) {
        const index = this.data.findIndex(v => this.compare(v, value) === 0)
        if (index !== -1) {
            this.data.splice(index, 1)
        }
    }

    pop(): T | undefined {
        return this.data.shift()
    }

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

export default SortedSet