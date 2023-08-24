import {
  ArgumentsHost,
  CallHandler,
  ExceptionFilter,
  ExecutionContext,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { Request, Response } from 'express';
import {
  IHandle,
  IHandleCatch,
  IHandleIntercept,
} from './api-interceptor.interface';

export abstract class ApiInterceptorAbstract
  implements NestInterceptor, ExceptionFilter
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      tap((response) => {
        this.handleIntercept({
          ...this.getRequestInfo(context),
          response,
        });
      }),
    );
  }

  catch(exception: any, host: ArgumentsHost): any {
    this.handleCatch(
      {
        ...this.getRequestInfo(host),
        exception,
      },
      host.switchToHttp().getResponse<Response>(),
    );
  }

  private getRequestInfo(data: Pick<ArgumentsHost, 'switchToHttp'>): IHandle {
    const request = data.switchToHttp().getRequest<Request>();

    return {
      body: {
        ...request.body,
        password: undefined,
      },
      params: request.params,
      query: request.query,
      url: request.url,
      method: request.method,
      user: (request as any).user,
    };
  }

  abstract handleIntercept(data: IHandleIntercept): void;

  abstract handleCatch(data: IHandleCatch, res: Response): void;
}
