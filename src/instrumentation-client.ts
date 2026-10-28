import { initBotId } from 'botid/client/core';

initBotId({
  protect: [
    { path: '/api/create-order', method: 'POST' },
  ],
});
