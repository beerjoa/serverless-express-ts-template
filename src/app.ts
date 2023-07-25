import 'reflect-metadata';

import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import compression from 'compression';
import express, { json, urlencoded } from 'express';
import path from 'path';
import { getMetadataArgsStorage, RoutingControllersOptions, useContainer, useExpressServer } from 'routing-controllers';
import { routingControllersToSpec } from 'routing-controllers-openapi';
import swaggerUiExpress from 'swagger-ui-express';
import { Container } from 'typedi';

const { defaultMetadataStorage } = require('class-transformer/cjs/storage');

import config from '@src/config';
import { HttpErrorHandler, LoggingHandler } from '@src/middlewares/handler.middleware';
import logger from '@src/utils/logger.util';

type TRoutingControllersOptions = RoutingControllersOptions | unknown;
class App {
  private readonly _app: express.Application;
  get app() {
    return this._app;
  }
  private _serverUrl: string;

  constructor() {
    this._app = express();
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

  private initRoutes(): void {
    const routingControllerOptions: Partial<TRoutingControllersOptions> = {
      routePrefix: '/api',
      controllers: [path.join(__dirname, '/*.controller.*'), path.join(__dirname, '/**/*.controller.*')],
      middlewares: [HttpErrorHandler, LoggingHandler],
      interceptors: [path.join(__dirname, '/interceptors/*.interceptor.*')],
      defaultErrorHandler: false,
      validation: true,
      classTransformer: true
    };

    useExpressServer(this._app, routingControllerOptions);
    logger.info('Init Routes');

    if (config.IS_OFFLINE) {
      this._InitSwagger(routingControllerOptions);
    }
  }

  private _InitSwagger(routingControllerOptions: Partial<RoutingControllersOptions>): void {
    const storage = getMetadataArgsStorage();
    const schemas = validationMetadatasToSchemas({
      classTransformerMetadataStorage: defaultMetadataStorage,
      refPointerPrefix: '#/components/schemas/'
    });

    const components = {
      schemas,
      securitySchemes: {
        jwtAuth: {
          type: 'apiKey',
          scheme: 'bearer',
          name: 'Authorization',
          in: 'header',
          bearerFormat: 'JWT'
        }
      }
    };

    const additionalProperties = {
      info: {
        title: 'API Documentation',
        description: 'API Documentation',
        version: config.APP_VERSION
      },
      servers: [{ url: this._serverUrl }],
      components
    };

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const spec = routingControllersToSpec(storage, routingControllerOptions, additionalProperties);

    this.app.use('/api-docs', swaggerUiExpress.serveWithOptions({ redirect: false }));
    this.app.get('/api-docs', swaggerUiExpress.setup(spec, { explorer: true }));

    logger.info('Init Swagger');
  }

  private initMiddleware(): void {
    this.app.use(json());
    this.app.use(urlencoded({ extended: true }));
    this.app.use(compression());
  }
}

export default App;
