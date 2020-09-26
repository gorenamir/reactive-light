let updaterFunction = null;
const depsMap = new WeakMap();

class Deps {
    constructor() {
        this.deps = new Set();
    }

    add(f) {
        this.deps.add(f);
    }

    notify(obj) {
        this.deps.forEach(func => { func(obj); });
    }
}

class Ref {
    constructor(initialValue = null) {
        this.internalValue = initialValue;
    }

    get value() {
        let deps = depsMap.get(this);

        if (deps === undefined) {
            deps = new Deps();
            depsMap.set(this, deps);
        }

        if (updaterFunction !== null) {
            deps.add(updaterFunction);
        }

        return this.internalValue;
    }

    set value(newVal) {
        this.internalValue = newVal;
        const deps = depsMap.get(this);
        if (deps !== undefined) {
            deps.notify(this);
        }
        return true;
    }
}

function ref(initialValue = null) {
    return new Ref(initialValue);
}

class Computed {
    constructor(cb) {
        this.cb = cb;
        this.updaterFunction = null;
        this.cachedValue = null;
        this.calculated = false;
    }

    get value() {
        let deps = depsMap.get(this);

        if (deps === undefined) {
            deps = new Deps();
            depsMap.set(this, deps);
        }

        if (updaterFunction !== null) {
            deps.add(updaterFunction);
        }

        if (this.updaterFunction === null) {
            this.updaterFunction = () => {
                const newValue = this.cb();
                if (newValue !== this.cachedValue) {
                    this.cachedValue = newValue;
                    deps.notify(this);
                }
            };
        }

        const oldUpdaterFunction = updaterFunction;
        updaterFunction = this.updaterFunction;
        if (! this.calculated) {
            this.cachedValue = this.cb();
            this.calculated = true;
        }
        updaterFunction = oldUpdaterFunction;
        return this.cachedValue;
    }
}

function computed(cb) {
    return new Computed(cb);
}

function watchEffect(cb) {
    const oldUpdaterFunction = updaterFunction;
    updaterFunction = cb;
    cb();
    updaterFunction = oldUpdaterFunction;
}

function watch(whatToWatch, cb) {
    const oldUpdaterFunction = updaterFunction;
    updaterFunction = () => {
        const newVal = whatToWatch();
        if (newVal !== val) {
            cb(newVal, val);
            val = newVal;
        }
    };
    let val = whatToWatch();
    updaterFunction = oldUpdaterFunction;
}

export { ref, computed, watch, watchEffect };