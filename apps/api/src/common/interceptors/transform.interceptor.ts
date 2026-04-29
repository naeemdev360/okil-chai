import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import type { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface WrappedResponse<TData> {
  data: TData;
}

@Injectable()
export class TransformInterceptor<TData>
  implements NestInterceptor<TData, WrappedResponse<TData>>
{
  intercept(
    _context: ExecutionContext,
    next: CallHandler<TData>,
  ): Observable<WrappedResponse<TData>> {
    return next.handle().pipe(map((data) => ({ data })));
  }
}
