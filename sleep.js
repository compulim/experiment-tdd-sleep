/**
 * Sleeps for an interval.
 *
 * If an AbortSignal is passed in and the sleep is being interrupted by the
 * signal, the function will reject.
 */
module.exports = function sleep(durationInMS, { signal } = {}) {
  return new Promise((resolve, reject) => {
    let timeout;

    signal?.addEventListener('abort', () => {
      clearTimeout(timeout);
      reject(new Error('Aborted.'));
    });

    timeout = setTimeout(resolve, durationInMS);
  });
};
