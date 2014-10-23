/*global describe, it */
'use strict';
var expect = require('expect.js');
var mutate = require('../').mutate;

function incr(x) {
  return x + 1;
}

describe('mutate(Array)', function () {
  it('*', function() {
    var data = [0, 1, 2, 3, 4];
    mutate({'*': incr}, data);
    expect(data).to.eql([1, 2, 3, 4, 5]);
  });
  it('*.x', function () {
    var data = [{x: 0, y: 0}, {x: 1, y: 1}, {x: 2, y: 2}];
    mutate({'*.x': incr}, data);
    expect(data).to.eql([{x: 1, y: 0}, {x: 2, y: 1}, {x: 3, y: 2}]);
  });
  it('*.1', function () {
    var data = [[0, 0], [1, 1], [2, 2]];
    mutate({'*.1': incr}, data);
    expect(data).to.eql([[0, 1], [1, 2], [2, 3]]);
  });
  it('0.*', function () {
    var data = [[0, 1, 2, 3], [0, 1, 2, 3]];
    mutate({'0.*': incr}, data);
    expect(data).to.eql([[1, 2, 3, 4], [0, 1, 2, 3]]);
  });
  it('0,2,4', function () {
    var data = [0, 1, 2, 3, 4, 5];
    mutate({0: incr, 2: incr, 4: incr}, data);
    expect(data).to.eql([1, 1, 3, 3, 5, 5]);
  });
});

describe('mutate(Object)', function () {
  it('*', function() {
    var data = {a: 0, b: 1, c: 2};
    mutate({'*': incr}, data);
    expect(data).to.eql({a: 1, b: 2, c: 3});
  });
  it('*.x', function () {
    var data = {a: {x: 0, y: 0}, b: {x: 1, y: 1}};
    mutate({'*.x': incr}, data);
    expect(data).to.eql({a: {x: 1, y: 0}, b: {x: 2, y: 1}});
  });
  it('*.1', function () {
    var data = {a: [0, 0], b: [1, 1], c: [2, 2]};
    mutate({'*.1': incr}, data);
    expect(data).to.eql({a: [0, 1], b: [1, 2], c: [2, 3]});
  });
  it('a.*', function () {
    var data = {a: [0, 1, 2, 3], b: [0, 1, 2, 3]};
    mutate({'a.*': incr}, data);
    expect(data).to.eql({a: [1, 2, 3, 4], b: [0, 1, 2, 3]});
  });
  it('a,c', function () {
    var data = {a: 0, b: 1, c: 2, d: 3};
    mutate({a: incr, c: incr}, data);
    expect(data).to.eql({a: 1, b: 1, c: 3, d: 3});
  });
});