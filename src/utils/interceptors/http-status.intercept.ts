import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Response } from "express";

@Injectable()
export class HttpStatusInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const ctx = context.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest();

        return next.handle().pipe(map((data) => {
            if (request.method === "POST" && response.statusCode === 201) {
                response.status(200);
            }
            return data;
        }),
        );
    }
}
