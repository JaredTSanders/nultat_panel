import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';



import { AuthService } from './services/auth.service';
import { map } from 'rxjs/operators';

@Injectable()
export class TokenIntercept implements HttpInterceptor {

    constructor(
        private authService: AuthService,
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
            return next.handle(request).pipe(
                map(event => {
                    if (event instanceof HttpResponse){
                        event = event.clone({
                            headers: event.headers.set('Set-Cookie', 'session_token').set('withCredentials','true'),
                            
                        })
                    }
                    return event
                })
            )
        
        // if (request.url.startsWith('http://localhost:8000/api') ) {
        //     const token    = this.authService.getToken();
        //     const headers    = {};

        //     if (token !== null) {
        //         headers['Authorization']    = 'Bearer ' + token;
        //     }

        //     const modified = request.clone(
        //         {
        //             setHeaders: headers,
        //             withCredentials: true,
                    
        //         }
        //     );
        //     return next.handle(modified);
        // } else {
        //     return next.handle(request);
        // }
    }
}