const sleep = require('./sleep');

async function hasResolved(promise) {
  const returns = Promise.race([
    promise.then(() => true),
    new Promise(resolve => {
      setTimeout(() => resolve(false), 0);
    })
  ]);

  await jest.advanceTimersByTimeAsync(0);

  return returns;
}

beforeEach(() => jest.useFakeTimers({ now: 0 }));
afterEach(() => jest.useRealTimers());

// GIVEN: A Promise returned by calling sleep(500).
describe('GIVEN: A Promise returned by calling sleep(500)', () => {
  let promise;

  beforeEach(() => {
    promise = sleep(500);
    promise.catch(() => {});
  });

  test('should not be resolved', () => expect(hasResolved(promise)).resolves.toBe(false));

  // WHEN: 0.5 seconds has passed.
  describe('WHEN: 0.5 seconds has passed', () => {
    beforeEach(() => jest.advanceTimersByTime(500));

    // THEN: The promise should be resolved.
    test('should be resolved', () => expect(hasResolved(promise)).resolves.toBe(true));
  });
});

describe('GIVEN: A Promise returned by calling sleep(500) with an AbortSignal', () => {
  let abortController;
  let promise;

  beforeEach(() => {
    abortController = new AbortController();
    promise = sleep(500, { signal: abortController.signal });
    promise.catch(() => {});
  });

  test('should have 1 pending timer', () => expect(jest.getTimerCount()).toBe(1));

  describe('WHEN: Signal is aborted', () => {
    beforeEach(() => abortController.abort());

    test('should be rejected', () => expect(() => promise).rejects.toThrow('Aborted.'));
    test('should have no pending timers', () => expect(jest.getTimerCount()).toBe(0));
  });
});
