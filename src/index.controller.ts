import { Response } from 'express';
import httpStatus from 'http-status';
import { Get, HttpCode, HttpError, JsonController, Res } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { Service } from 'typedi';

import { HttpResponseDto } from '@src/dtos/response.dto';
import IndexService from '@src/index.service';
import { IController } from '@src/interfaces/controller.interface';

/**
 * Index Controller
 * @class
 * @implements {IController}
 */
@OpenAPI({
  summary: 'Index',
  description: 'Index Controller'
})
@JsonController('/test')
@Service()
class IndexController implements IController {
  // prettier-ignore
  constructor(
    public readonly service: IndexService
  ) {}
  @Get('')
  @OpenAPI({
    summary: 'Index',
    description: 'return Hello World'
  })
  @HttpCode(httpStatus.OK)
  @ResponseSchema(HttpResponseDto, { statusCode: httpStatus.OK, description: 'test successfully' })
  public async index(@Res() res: Response) {
    try {
      res;
      const serviceResult = await this.service.index();
      const result = new HttpResponseDto();
      result.httpCode = httpStatus.OK;
      result.name = 'OKResponse';
      result.message = 'Success Response';
      result.data = serviceResult;
      return result;
    } catch (error) {
      const httpError = new HttpError(httpStatus.INTERNAL_SERVER_ERROR, 'INTERNAL_SERVER_ERROR');
      return httpError;
    }
  }
}

export default IndexController;
