const fs = require('fs');

async function fetchFromJudgeMe(url) {
  const reqUrl = url.replace('https://judge.me/reviews/stores/namonarayana.in/products/', 'https://judge.me/api/v1/reviews?shop_domain=namonarayana.in&product_handle=');
  // Wait, I don't have api_token
}
