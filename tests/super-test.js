'use strict';

const CoreObject = require('../core-object');
const assert     = require('assert');

describe('_super', function() {
  it('chain of inits is called in the correct order (post-order)', function() {
    let called = '';

    let Klass1 = CoreObject.extend({
      init() {
        this._super();
        called += '1';
      }
    });

    let Klass2 = Klass1.extend({
      init() {
        this._super();
        called += '2';
      }
    });

    let Klass3 = Klass2.extend({
      init() {
        this._super();
        called += '3';
      }
    });

    let instance = new Klass3();

    assert.equal(called, '123');
  });

  it('chain of super.init is called in the correct order (post-order)', function() {
    let called = '';

    let Klass1 = CoreObject.extend({
      init() {
        this._super.init.call(this);
        called += '1';
      }
    });

    let Klass2 = Klass1.extend({
      init() {
        this._super.init.call(this);
        called += '2';
      }
    });

    let Klass3 = Klass2.extend({
      init() {
        this._super.init.call(this);
        called += '3';
      }
    });

    let instance = new Klass3();

    assert.equal(called, '123');
  });

  it('chain of inits is called in the correct order (pre-order)', function() {
    let called = '';

    let Klass1 = CoreObject.extend({
      init() {
        called += '1';
        this._super();
      }
    });

    let Klass2 = Klass1.extend({
      init() {
        called += '2';
        this._super();
      }
    });

    let Klass3 = Klass2.extend({
      init() {
        called += '3';
        this._super();
      }
    });

    let instance = new Klass3();

    assert.equal(called, '321');
  });

  it('one super change calling another works (foo & toString)', function() {
    let fooCalled = false;
    let barCalled = false;
    let bazCalled = false;

    let Klass1 = CoreObject.extend({
      foo() {
        return 'klass1';
      },

      toString() {
        return 'klass1-' + this.id;
      }
    });

    let Klass2 = Klass1.extend({
      foo() {
        assert.equal(this.id, 4);
        return 'klass2,' + this._super();
      },

      toString() {
        return 'klass2-' + this.id + '.' + this._super();
      }
    });

    let Klass3 = Klass2.extend({
      init() {
        this.id = 4; // on the instance
      },

      toString() {
        assert.equal(this.foo(), 'klass2,klass1');
        return 'klass3-' + this.id + '.' + this._super();
      }
    });

    let instance = new Klass3();

    assert.equal(instance.toString(), 'klass3-4.klass2-4.klass1-4');
  });

  it('one super. change calling another works (foo & toString)', function() {
    let fooCalled = false;
    let barCalled = false;
    let bazCalled = false;

    let Klass1 = CoreObject.extend({
      init() {},
      foo() {
        return 'klass1';
      },

      toString() {
        return 'klass1-' + this.id;
      }
    });

    let Klass2 = Klass1.extend({
      foo() {
        assert.equal(this.id, 4);
        return 'klass2,' + this._super.foo.call(this);
      },

      toString() {
        return 'klass2-' + this.id + '.' + this._super.toString.call(this);
      }
    });

    let Klass3 = Klass2.extend({
      init() {
        this.id = 4; // on the instance
      },

      toString() {
        assert.equal(this.foo(), 'klass2,klass1');
        return 'klass3-' + this.id + '.' + this._super.toString.call(this);
      }
    });

    let instance = new Klass3();

    assert.equal(instance.toString(), 'klass3-4.klass2-4.klass1-4');
  });

  describe('forceSuper', function() {
    it('forces super if forgotten', function() {
      let wasCalled =  false;
      let Klass1 = CoreObject.extend({
        init() {
          this._super();
          wasCalled = true;
        },
      });

      let Klass2 = Klass1.extend({
        init() {

        }
      });

      assert.equal(wasCalled, false, 'expected init to not yet be called');

      new Klass2();

      assert.equal(wasCalled, true, 'expected init to be called');
    });

    it('forces super if forgotten (args)', function() {
      let wasCalled =  false;
      let wasCalledWith;

      let Klass1 = CoreObject.extend({
        init() {
          this._super();
          wasCalled = true;
          wasCalledWith = Array.prototype.slice.call(arguments);
        },
      });

      let Klass2 = Klass1.extend({
        init() {

        }
      });

      assert.equal(wasCalled, false, 'expected init to not yet be called');

      new Klass2(1,2,3);

      assert.equal(wasCalled, true, 'expected init to be called');
      assert.deepEqual(wasCalledWith, [1,2,3]);
    });


    it('forces super if forgotten (args but with arity)', function() {
      let wasCalled =  false;
      let wasCalledWith;

      let Klass1 = CoreObject.extend({
        init() {
          this._super();
          wasCalled = true;
          wasCalledWith = Array.prototype.slice.call(arguments);
        },
      });

      let Klass2 = Klass1.extend({
        init: function(a) {

        }
      });

      assert.equal(wasCalled, false, 'expected init to not yet be called');

      new Klass2(1,2,3);

      assert.equal(wasCalled, true, 'expected init to be called');
      assert.deepEqual(wasCalledWith, []);
    });
  });
});

describe('es6 _super interopt', function() {
  it('chain of super.init is called in the correct order (post-order)', function() {
    let called = '';

    let Klass1 = CoreObject.extend({
      init() {
        this._super.init.call(this);
        called += '1';
      }
    });

    class Klass2 extends Klass1 {
      init() {
        super.init();
        called += '2';
      }
    };

    let Klass3 = Klass2.extend({
      init() {
        this._super.init.call(this);
        called += '3';
      }
    });

    let instance = new Klass3();

    assert.equal(called, '123');
  });
});
