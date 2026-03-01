class EventEmitter<T extends Record<string, any>> {
    private events: {
        [K in keyof T]?: ((data: T[K]) => void)[];
    } = {};

    on<K extends keyof T>(event: K, callback: (data: T[K]) => void) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event]!.push(callback);
    }

    emit<K extends keyof T>(event: K, data: T[K]) {
        this.events[event]?.forEach(cb => cb(data));
    }

    off<K extends keyof T>(event: K, callback: (data: T[K]) => void) {
        this.events[event] = this.events[event]?.filter(cb => cb !== callback);
    }
}

export default EventEmitter;