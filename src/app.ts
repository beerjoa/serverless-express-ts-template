import "reflect-metadata";

import { validationMetadatasToSchemas } from "class-validator-jsonschema";
import compression from "compression";
import express, { json, urlencoded } from "express";
import helmet from "helmet";
import http from "http";
import { createHttpTerminator } from "http-terminator";
import https from "https";
import path from "path";
import {
  RoutingControllersOptions,
  getMetadataArgsStorage,
  useContainer,
  useExpressServer,
} from "routing-controllers";
import { routingControllersToSpec } from "routing-controllers-openapi";
import swaggerUiExpress from "swagger-ui-express";
import { Container } from "typedi";

const { defaultMetadataStorage } = require("class-transformer/cjs/storage");

import config from "@/config";
import logger from "@/utils/logger.util";

type ServerInstanceType = http.Server | https.Server | null;
type TRoutingControllersOptions = RoutingControllersOptions | unknown;

interface IApp {
  app: express.Application;
  start(): void;
  stop(): void;
}

class App implements IApp {
  private readonly _app: express.Application;
  get app() {
    return this._app;
  }
  private _server: ServerInstanceType;
  private _env: string;
  private _host: string;
  private _port: number;
  private _serverUrl: string;

  constructor() {
    this._app = express();
    this._server = null;
    this._env = config.NODE_ENV;
    this._host = config.HOST;
    this._port = config.PORT;
    this._serverUrl = config.SERVER_URL;

    useContainer(Container);
    this.initMiddleware();
    this.initRoutes();
    // this.initDatabase();
  }

  public static build(): App {
    const app = new App();
    return app;
  }

  public start() {
    this._server = this.app.listen(this._port, this._host, () => {
      logger.info(
        `\n🟩 Server is running ✅\n🟩 env: ${this._env}\n🟩 ${this._host}:${this._port}`
      );
    });
  }

  public stop() {
    const httpTerminator = createHttpTerminator({ server: this._server! });

    // Gracefully terminate the server
    httpTerminator.terminate().then(() => {
      logger.info(`\n🛑 Server is closed ❌`);
    });
  }
  private initRoutes(): void {
    const routingControllerOptions: Partial<TRoutingControllersOptions> = {
      routePrefix: "/api",
      controllers: [
        path.join(__dirname, "/*.controller.js"),
        path.join(__dirname, "/**/*.controller.js"),
      ],
      // middlewares: [HttpErrorHandler, LoggingHandler],
      interceptors: [path.join(__dirname, "/interceptors/*.interceptor.ts")],
      defaultErrorHandler: false,
      validation: true,
      classTransformer: true,
      // authorizationChecker
    };

    useExpressServer(this._app, routingControllerOptions);

    // this._InitSwagger;
    this._InitSwagger(routingControllerOptions);
  }

  private _InitSwagger(
    routingControllerOptions: Partial<RoutingControllersOptions>
  ): void {
    const storage = getMetadataArgsStorage();
    const schemas = validationMetadatasToSchemas({
      classTransformerMetadataStorage: defaultMetadataStorage,
      refPointerPrefix: "#/components/schemas/",
    });
    schemas;

    const additionalProperties = {
      info: {
        title: "API Documentation",
        description: "API Documentation",
        version: config.APP_VERSION,
      },
      servers: [
        {
          url: this._serverUrl,
        },
      ],
      // components: {
      //   schemas,
      //   securitySchemes: {
      //     jwtAuth: {
      //       type: "apiKey",
      //       scheme: "bearer",
      //       name: "Authorization",
      //       in: "header",
      //       bearerFormat: "JWT",
      //     },
      //   },
      // } as ComponentsObject,
    };
    const spec = routingControllersToSpec(
      storage,
      routingControllerOptions,
      additionalProperties
    );

    this.app.use(
      "/api-docs",
      swaggerUiExpress.serveWithOptions({ redirect: false }),
      swaggerUiExpress.setup(spec)
    );
  }

  private initMiddleware(): void {
    this.app.use(json());
    this.app.use(urlencoded({ extended: true }));
    this.app.use(helmet());
    this.app.use(compression());
  }
}
// const app = new App().app;
// const app = express();
// useContainer(Container);
// useExpressServer(app, {
//   controllers: [IndexController],
//   cors: true,
// });
// app.disable("x-powered-by");
// export default app;
export default App;
