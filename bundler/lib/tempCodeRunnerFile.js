/* eslint-disable */
const objA = {
  a: 1,
  b: 2,
  c: 3,
  d: 4,
  e: 5,
}

const objB = {
  a: 'I',
  b: 'II',
  c: 'III',
  d: 'IV',
  e: 'V',
}

const objC = {
  ...objA,
  ...objB,
}

console.log(objC)
