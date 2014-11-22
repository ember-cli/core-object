module.exports = function setup() {
  if (this.distribution === 1) {
    this.data = {
      firstName: function() { }
    };
  } else if (this.distribution === 5) {
    this.data = {
      firstName:  function() { },
      lastName:   function() { },
      middleName: function() { },
      age:        function() { },
      sex:        function() { }
    };
  } else {
    throw new Error("OMG");
  }
};


