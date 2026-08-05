module.exports = {
  apps: [
    {
      name: "woodshop-dashboard",
      script: "deno",
      args: "task start",
      interpreter: "none",
      env: {
        NODE_ENV: "production",
        DATABASE_PATH: "./data/woodshop.db",
      },
    },
  ],
};
