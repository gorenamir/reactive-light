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

const reactiveHandler = {
    get(obj, prop) {
        let deps = depsMap.get(obj);

        if (deps === undefined) {
            deps = new Deps();
            depsMap.set(obj, deps);
        }

        if (updaterFunction !== null) {
            deps.add(updaterFunction);
        }

        return obj[prop];
    },
    set(obj, prop, value) {
        if (value instanceof Object) {
            obj[prop] = reactive(value);
        } else {
            obj[prop] = value;
        }
        const deps = depsMap.get(obj);
        if (deps !== undefined) {
            deps.notify(obj);
        }
        return true;
    },
    deleteProperty(obj, prop) {
        if (obj.hasOwnProperty(prop)) {
            delete obj[prop];
            const deps = depsMap.get(obj);
            if (deps !== undefined) {
                deps.notify(obj);
            }
        }
        return true;
    }
};

function reactive(obj) {
    const objCopy = Object.assign({}, obj);
    for (const key in objCopy) {
        if (objCopy.hasOwnProperty(key) && (objCopy[key] instanceof Object)) {
            objCopy[key] = reactive(objCopy[key]);
        }
    }
    return new Proxy(objCopy, reactiveHandler);
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

export { ref, computed, reactive, watch, watchEffect };