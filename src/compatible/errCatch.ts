export async function errCatch1(asyncFunc:Function) {
  try {
    const res = await asyncFunc();
    return [null, res];
  } catch (error) {
    return [error, null];
  }
}

export function errCatch2(asyncFunc:Function): any[] {
  const value = new Array(2);
  asyncFunc()
    .catch((e:Error) => {
      value[0] = e;
    })
    .then((res: any) => {
      value[1] = res;
    });
  return value;
}

export function errCatch(asyncFunc:Function): [any, any] {
  let error;
  let result;
  asyncFunc()
    .catch((e: Error) => (error = e))
    .then((res: any) => (result = res));
  return [error, result];
}
