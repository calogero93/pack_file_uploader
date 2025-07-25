/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "pack-file-uploader",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
    };
  },
  async run() {
    const vpc = new sst.aws.Vpc("PackVPC");
    const cluster = new sst.aws.Cluster("PackCluster", { vpc });
    const bucket = new sst.aws.Bucket("PackBucket");
    const secret = new sst.Secret("API_KEY");

    const db = new sst.aws.Postgres("PackDatabase", {
      vpc,
    });

    new sst.aws.Service("PackService", {
      cluster,
      image: "891377229381.dkr.ecr.eu-central-1.amazonaws.com/sst-asset:latest",
      loadBalancer: {
        ports: [{ listen: "80/http", forward: "3000/http" }],
      },
      link: [bucket, db, secret],

      /*dev: {
        command: "node --watch dist/index.js",
      },*/
    });
  },
});
