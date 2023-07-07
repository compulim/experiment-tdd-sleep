const sleep = require('./sleep.js');

(async function () {
  console.log(Date.now());

  await sleep(1_000);

  console.log(Date.now());
})();
