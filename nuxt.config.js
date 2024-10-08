import { ignored_error } from "./config/ignored_error_sentry";
const webpack = require("webpack");

require("dotenv").config();

var modules = {
  target: "static",
  ssr: false,

  server: {
    port: 8000,
    host: "localhost",
    timing: false,
  },

  head: {
    title: process.env.APP_TITLE,
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content: `Konfigurasi lokasi parkir anda dengan mudah melalui ${process.env.APP_TITLE}`,
      },
      { property: "og:title", content: process.env.APP_TITLE },
      { property: "og:type", content: "website" },
      { property: "og:image", content: `${process.env.ASSET_URL}/sm-icon.png` },
      { property: "og:url", content: process.env.BASE_URL },
      {
        property: "og:description",
        content: `Konfigurasi lokasi parkir anda dengan mudah melalui ${process.env.APP_TITLE}`,
      },
    ],
    link: [
      {
        rel: "icon",
        type: "image/x-icon",
        href: `${process.env.ASSET_URL}/favicon.ico`,
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
      },
      {
        rel: "stylesheet",
        href: "https://cdn.jsdelivr.net/npm/boxicons@2.1.1/css/boxicons.min.css",
      },
      {
        rel: "stylesheet",
        href: "https://spn-cdn.s3.ap-southeast-1.amazonaws.com/asset/icon-font/latest/spn-icon-font.css",
      },
    ],
  },

  loading: { color: process.env.PRIMARY_COLOR || "#FFC348" },

  css: ["@/assets/index.scss"],

  plugins: [
    "~/plugins/axios",
    "~/plugins/vuelidate",
    "~/plugins/maps",
    "~/plugins/client-plugins",
    "~/plugins/injector",
  ],

  modules: [
    "@nuxtjs/axios",
    "@nuxtjs/sentry",
    "@nuxtjs/firebase",
    ["@nuxtjs/bootstrap-vue", { css: false }],
  ],

  sentry: {
    dsn: process.env.SENTRY_DSN || "",
    lazy: true,
    tracing: true,
    clientConfig: `~/plugins/filter-sentry.js`,
    config: {
      ignoreErrors: ignored_error,
      tracesSampleRate: 1,
      trackComponents: false,
      browserTracing: {},
      vueOptions: {
        trackComponents: false,
      },
    },
  },

  firebase: {
    config: {
      apiKey: process.env.FIREBASE_apiKey,
      authDomain: process.env.FIREBASE_authDomain,
      databaseURL: process.env.FIREBASE_databaseURL,
      projectId: process.env.FIREBASE_projectId,
      storageBucket: process.env.FIREBASE_storageBucket,
      messagingSenderId: process.env.FIREBASE_messagingSenderId,
      appId: process.env.FIREBASE_appId,
      measurementId: process.env.FIREBASE_measurementId,
    },
    services: {
      analytics: process.env.MODE !== "LOCAL",
    },
  },

  router: {},
  build: {
    extend(config, ctx) {
      if (!ctx.isDev) {
        config.output.chunkFilename = `[chunkhash]-v${process.env.VERSION_NUMBER}.js`;
      } else {
        config.devtool = ctx.isClient ? "source-map" : "inline-source-map";
      }
      config.resolve.alias["@utilities"] = "@/utility/components";
    },
    optimization: {
      splitChunks: {
        chunks: "async", // Split only async chunks
        maxSize: 75000, // Maximum chunk size (in bytes)
      },
    },
    plugins: [
      new webpack.optimize.SplitChunksPlugin({
        name: "manifest",
        minChunks: Infinity,
      }),
    ],
  },
  env: {
    SENTRY_DSN: process.env.SENTRY_DSN || "",
    VERSION_CODE: process.env.VERSION_CODE || "",
    baseUrl: process.env.BASE_URL || "",
    BASE_ASSET_URL: process.env.BASE_ASSET_URL || "",
    ASSET_URL: process.env.ASSET_URL || "",
    IPL_URL: process.env.IPL_URL || "",
    MAPS_TOKEN: process.env.MAPS_TOKEN || "",
    PRIMARY_COLOR: process.env.PRIMARY_COLOR || "",
    APP_TITLE: process.env.APP_TITLE || "",
    MODE: process.env.MODE || "",
    REPORT_VERSIONS: process.env.REPORT_VERSIONS || "v3-dynamic-route",
  },
};

module.exports = {
  ...modules,
};
