'use strict';

var CoreObject = require('../core-object');
var assert     = require('assert');

describe('_super', function() {
  it('chain of inits is called in the correct order (post-order)', function() {
    var called = '';

    var Klass1 = CoreObject.extend({
      init: function() {
        this._super();
        called += '1';
      }
    });

    var Klass2 = Klass1.extend({
      init: function() {
        this._super();
        called += '2';
      }
    });

    var Klass3 = Klass2.extend({
      init: function() {
        this._super();
        called += '3';
      }
    });

    var instance = new Klass3();

    assert.equal(called, '123');
  });

  it('chain of super.init is called in the correct order (post-order)', function() {
    var called = '';

    var Klass1 = CoreObject.extend({
      init: function() {
        this._super.init.call(this);
        called += '1';
      }
    });

    var Klass2 = Klass1.extend({
      init: function() {
        this._super.init.call(this);
        called += '2';
      }
    });

    var Klass3 = Klass2.extend({
      init: function() {
        this._super.init.call(this);
        called += '3';
      }
    });

    var instance = new Klass3();

    assert.equal(called, '123');
  });

  it('chain of inits is called in the correct order (pre-order)', function() {
    var called = '';

    var Klass1 = CoreObject.extend({
      init: function() {
        called += '1';
        this._super();
      }
    });

    var Klass2 = Klass1.extend({
      init: function() {
        called += '2';
        this._super();
      }
    });

    var Klass3 = Klass2.extend({
      init: function() {
        called += '3';
        this._super();
      }
    });

    var instance = new Klass3();

    assert.equal(called, '321');
  });

  it('one super change calling another works (foo & toString)', function() {
    var fooCalled = false;
    var barCalled = false;
    var bazCalled = false;

    var Klass1 = CoreObject.extend({
      foo: function() {
        return 'klass1';
      },

      toString: function() {
        return 'klass1-' + this.id;
      }
    });

    var Klass2 = Klass1.extend({
      foo: function() {
        assert.equal(this.id, 4);
        return 'klass2,' + this._super();
      },

      toString: function() {
        return 'klass2-' + this.id + '.' + this._super();
      }
    });

    var Klass3 = Klass2.extend({
      init: function() {
        this.id = 4; // on the instance
      },

      toString: function() {
        assert.equal(this.foo(), 'klass2,klass1');
        return 'klass3-' + this.id + '.' + this._super();
      }
    });

    var instance = new Klass3();

    assert.equal(instance.toString(), 'klass3-4.klass2-4.klass1-4');
  });

  it('one super. change calling another works (foo & toString)', function() {
    var fooCalled = false;
    var barCalled = false;
    var bazCalled = false;

    var Klass1 = CoreObject.extend({
      init: function() {},
      foo: function() {
        return 'klass1';
      },

      toString: function() {
        return 'klass1-' + this.id;
      }
    });

    var Klass2 = Klass1.extend({
      foo: function() {
        assert.equal(this.id, 4);
        return 'klass2,' + this._super.foo.call(this);
      },

      toString: function() {
        return 'klass2-' + this.id + '.' + this._super.toString.call(this);
      }
    });

    var Klass3 = Klass2.extend({
      init: function() {
        this.id = 4; // on the instance
      },

      toString: function() {
        assert.equal(this.foo(), 'klass2,klass1');
        return 'klass3-' + this.id + '.' + this._super.toString.call(this);
      }
    });

    var instance = new Klass3();

    assert.equal(instance.toString(), 'klass3-4.klass2-4.klass1-4');
  });

  describe('forceSuper', function() {
    it('forces super if forgotten', function() {
      var wasCalled =  false;
      var Klass1 = CoreObject.extend({
        init: function() {
          this._super();
          wasCalled = true;
        },
      });

      var Klass2 = Klass1.extend({
        init: function() {

        }
      });

      assert.equal(wasCalled, false, 'expected init to not yet be called');

      new Klass2();

      assert.equal(wasCalled, true, 'expected init to be called');
    });

    it('forces super if forgotten (args)', function() {
      var wasCalled =  false;
      var wasCalledWith;

      var Klass1 = CoreObject.extend({
        init: function() {
          this._super();
          wasCalled = true;
          wasCalledWith = Array.prototype.slice.call(arguments);
        },
      });

      var Klass2 = Klass1.extend({
        init: function() {

        }
      });

      assert.equal(wasCalled, false, 'expected init to not yet be called');

      new Klass2(1,2,3);

      assert.equal(wasCalled, true, 'expected init to be called');
      assert.deepEqual(wasCalledWith, [1,2,3]);
    });


    it('forces super if forgotten (args but with arity)', function() {
      var wasCalled =  false;
      var wasCalledWith;

      var Klass1 = CoreObject.extend({
        init: function() {
          this._super();
          wasCalled = true;
          wasCalledWith = Array.prototype.slice.call(arguments);
        },
      });

      var Klass2 = Klass1.extend({
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
    var called = '';

    var Klass1 = CoreObject.extend({
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

    var Klass3 = Klass2.extend({
      init: function() {
        this._super.init.call(this);
        called += '3';
      }
    });

    var instance = new Klass3();

    assert.equal(called, '123');
  });
})
