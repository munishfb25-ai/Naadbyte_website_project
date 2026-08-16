module.exports = {
  apps: [
    {
      name: "naadbyte",
      script: "./.output/server/index.mjs",
      instances: "max",
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        NITRO_PORT: 3000,
        NITRO_HOST: "0.0.0.0",
        HOST: "0.0.0.0",
      },
    },
  ],
};
