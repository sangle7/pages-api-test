export const compare = (a: object, b: object, name: string = "") => {
  if (typeof a !== typeof b) {
    console.error("typeof a !== typeof b", typeof a, typeof b,name);
  }else if (typeof a === 'object') {
    if (Array.isArray(a) && Array.isArray(b)) {
      // @ts-ignored
      a.forEach((elem, i) => compare(elem, b[i], `${name}[${i}]`));
    } else {
      for (let key in a) {
        // @ts-ignored
        compare(a[key], b[key], key);
      }
    }
  } else if (a !== b) {
    console.error(`${a} !==  ${b}, ${name}`);
  }
}