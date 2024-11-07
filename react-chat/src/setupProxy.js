const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'https://vkedu-fullstack-div2.ru',
            changeOrigin: true,
            pathRewrite: {
                '^/api': '/api',
            },
        })
    );
};
