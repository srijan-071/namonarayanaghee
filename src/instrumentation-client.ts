import { initBotId } from 'botid/client/core';

initBotId({
  protect: [
    { path: '/api/create-order', method: 'POST' },
    { path: '/api/razorpay/*', method: 'POST' },
    { path: '/api/payu/*', method: 'POST' },
    { path: '/api/verify-payment', method: 'POST' },
  ],
});
