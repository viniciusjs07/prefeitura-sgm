export interface GuinessCompatibleSpy extends jasmine.Spy {
  /** By chaining the spy with and.returnValue, all calls to the function will return a specific
   * value. */
  andReturn(val: any): void;
  /** By chaining the spy with and.callFake, all calls to the spy will delegate to the supplied
   * function. */
  andCallFake(fn: Function): GuinessCompatibleSpy;
  /** removes all recorded calls */
  reset();
}

export class SpyObject {

    static stub(object = null, config = null, overrides = null) {
        if (!(object instanceof SpyObject)) {
            overrides = config;
            config = object;
            object = new SpyObject();
        }

        const m__ = {};
        Object.keys(config).forEach((key) => (m__[key] = config[key]));
        Object.keys(overrides).forEach((key) => (m__[key] = overrides[key]));
        Object.keys(m__).forEach((key) => {
            object.spy(key).andReturn(m__[key]);
        });
        return object;
    }

    // eslint-disable-next-line @typescript-eslint/member-ordering
    constructor(type = null) {
        if (type) {
            Object.keys(type.prototype).forEach((prop) => {
                let m__ = null;
                try {
                    m__ = type.prototype[prop];
                } catch (exception) {
                    // As we are creating spys for abstract classes,
                    // these classes might have getters that throw when they are accessed.
                    // As we are only auto creating spys for methods, this
                    // should not matter.
                }
                if (typeof m__ === 'function') {
                    this.spy(prop);
                }
            });
        }
    }

    spy(name) {
        if (!this[name]) {
            this[name] = this._createGuinnessCompatibleSpy(name);
        }
        return this[name];
    }

    prop(name, value) {
        this[name] = value;
    }

    /** @internal */
    _createGuinnessCompatibleSpy(name): GuinessCompatibleSpy {
        const newSpy: GuinessCompatibleSpy = jasmine.createSpy(name) as any;
        newSpy.andCallFake = newSpy.and.callFake as any;
        newSpy.andReturn = newSpy.and.returnValue as any;
        newSpy.reset = newSpy.calls.reset as any;
        // revisit return null here (previously needed for rtts_assert).
        newSpy.and.returnValue(null);
        return newSpy;
    }

}
