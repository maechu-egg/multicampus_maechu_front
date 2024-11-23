const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/",
    createProxyMiddleware({
      target: "https://port-0-workspace-m3sh9tqyf4462309.sel4.cloudtype.app", // 클라우드 타입의 백엔드 주소
      changeOrigin: true,
    })
  );
};
