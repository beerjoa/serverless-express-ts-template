import { Expose } from 'class-transformer';
import { IsNumber, IsObject, IsString } from 'class-validator';
import { JSONSchema } from 'class-validator-jsonschema';

@JSONSchema({
  description: 'Base Error Response dto',
  example: {
    httpCode: 400,
    name: 'BadRequestError',
    message: 'Error Response',
    errors: {}
  }
})
export class HttpErrorResponseDto {
  @Expose()
  @IsNumber()
  public httpCode!: number;

  @Expose()
  @IsString()
  public name?: string;

  @Expose()
  @IsString()
  public message!: string;

  @Expose()
  @IsObject()
  public errors?: object;
}

@JSONSchema({
  description: 'Base Response dto',
  example: {
    httpCode: 200,
    name: 'OKResponse',
    message: 'Success Response',
    data: {}
  }
})
export class HttpResponseDto {
  @Expose()
  @IsNumber()
  public httpCode!: number;

  @Expose()
  @IsString()
  public name?: string;

  @Expose()
  @IsString()
  public message!: string;

  @Expose()
  @IsObject()
  public data?: object;
}
