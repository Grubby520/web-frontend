// import sum from "../src/sum"
const sum = require('../src/sum');

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).not.toBe(4);
});


test('object assignment', () => {
  const data = { one: 1 };
  data['two'] = 2;
  expect(data).toEqual({ one: 1, two: 2 });
});

test('null', () => {
  const n = null;
  expect(n).toBeNull();
  expect(n).toBeDefined();
  expect(n).not.toBeUndefined();
  expect(n).not.toBeTruthy();
  expect(n).toBeFalsy();
});

test('zero', () => {
  const z = 0;
  expect(z).not.toBeNull();
  expect(z).toBeDefined();
  expect(z).not.toBeUndefined();
  expect(z).not.toBeTruthy();
  expect(z).toBeFalsy();
});

test('there is no I in team', () => {
  expect('team').not.toMatch(/I/);
});


test('but there is a "stop" in Chris', () => {
  expect('Chris').toMatch(/ris/);
});


test('the shopping list has milk on it', () => {
  const shoppingList = [
    'diapers',
    'kleenex',
    'trash bags',
    'paper towels',
    'milk',
  ];

  expect(shoppingList).toContain('trash bags');
  expect(new Set(shoppingList)).toContain('milk');
});

/* Question: 那么多 匹配器，咋个记得住？
 * 1.记住常用的即可；
 * 2.用一个，记几个，慢慢就积累起来了；
*/