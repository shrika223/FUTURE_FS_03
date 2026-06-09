const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  if (process.env.NODE_ENV === "development") {
    app.use(
      "/api",
      createProxyMiddleware({
        target: "http://127.0.0.1:5000",
        changeOrigin: true,
        logLevel: "silent",
        ws: true
      })
    );
  }
};
