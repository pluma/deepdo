# Synopsis

**deepdo** lets you mess with deeply nested objects.

[![license - MIT](http://b.repl.ca/v1/license-MIT-blue.png)](http://pluma.mit-license.org) [![Flattr this](https://api.flattr.com/button/flattr-badge-large.png)](https://flattr.com/submit/auto?user_id=pluma&url=https://github.com/pluma/deepdo)

[![Dependencies](https://david-dm.org/pluma/deepdo.png?theme=shields.io)](https://david-dm.org/pluma/deepdo)

[![NPM status](https://nodei.co/npm/deepdo.png?compact=true)](https://npmjs.org/package/deepdo)

# API

To support arbitrarily nested properties, keys can be defined as paths using the dot (`"."`) as path separator and the asterisk (`"*"`) as a wildcard to match any property name. If you need to use keys that would normally contain a dot or asterisk, you can escape these characters using the backslash (`"\\"`), i.e. `"\\."` and `"\\*"`.

## deepdo.pick(keys:Array, source):*

Returns a new object that is a copy of `source` with only the properties specified in `keys`.

If `source` is an array, a new array will be returned instead of an object.

If `keys` is a string, it will be wrapped in an array automatically.

**Examples**

```js
var noisyData = {
    success: true,
    data: {
        meta: true,
        secrets: 'interesting'
    },
    lies: 'filthy lies',
};
var whatWeWant = deepdo.pick(['data.secrets', 'lies'], noisyData);
console.log(whatWeWant);
/*
{
    data: {
        secrets: 'interesting'
    },
    lies: 'filthy lies'
}
*/
```

## deepdo.omit(keys:Array, source):*

Returns a new object that is a copy of `source` without the properties specified in `keys`.

If `source` is an array, a new array will be returned instead of an object.

If `keys` is a string, it will be wrapped in an array automatically.

**Examples**

```js
var noisyData = {
    success: true,
    data: {
        meta: true,
        secrets: 'interesting'
    },
    lies: 'filthy lies',
};
var whatWeWant = deepdo.omit(['data.meta', 'success'], noisyData);
console.log(whatWeWant);
/*
{
    data: {
        secrets: 'interesting'
    },
    lies: 'filthy lies'
}
*/
```

## deepdo.mutate(map, source):source

Applies the given transformation `map` on the `source` and modifies it in-place. Returns the modified `source`.

The `map` can be either an object mapping keys to functions that should be executed on each matching property or an array of key/function tuples.

**Examples**

```js
var thing = {
    names: ['foo', 'bar', 'qux'],
    color: 'blue',
    some: {
        deep: {stuff: 'here'},
        more: {stuff: 'also'}
    }
};
var result = deepdo.mutate({
    'names.*': function (str) {return str.toUpperCase();},
    'color': function () {return 'yellow';},
    'some.*.stuff': function () {return 'chicken';}
}, thing);
console.log(result === thing); // true
console.log(thing);
/*
{
    names: ['FOO', 'BAR', 'QUX'],
    color: 'yellow',
    some: {
        deep: {stuff: 'chicken'},
        more: {stuff: 'chicken'}
    }
}
*/
```

# License

The MIT/Expat license. For more information, see http://pluma.mit-license.org/ or the accompanying [LICENSE](https://github.com/pluma/deepdo/blob/master/LICENSE) file.