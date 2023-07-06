import "reflect-metadata";
import ServerlessHttp from "serverless-http";

import App from "@/app";

const { app } = App.build();

module.exports.handler = ServerlessHttp(app);
