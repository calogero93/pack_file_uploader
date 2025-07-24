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
    const vpc = new sst.aws.Vpc("MyVpc");
    const cluster = new sst.aws.Cluster("MyCluster", { vpc });
    const bucket = new sst.aws.Bucket("MyBucket");

    const db = new sst.aws.Postgres("MyDatabase", {
      vpc,
    });

    new sst.aws.Service("MyService", {
      cluster,
      image: "891377229381.dkr.ecr.eu-central-1.amazonaws.com/sst-asset:latest",
      loadBalancer: {
        ports: [{ listen: "80/http", forward: "3000/http" }],
      },
      link: [bucket, db],

      dev: {
        command: "node --watch dist/index.js",
      },
    });
  },
});
