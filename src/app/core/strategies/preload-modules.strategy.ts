import { Injectable } from '@angular/core';
import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, of } from 'rxjs';
import { LoggerService } from '../services/utils/logger.service';

@Injectable()
export class PreloadModulesStrategy implements PreloadingStrategy {

    constructor(private logger: LoggerService) { }

    preload(route: Route, load: () => Observable<any>): Observable<any> {
        const preload = 'preload';
        if (route.data && route.data[preload]) {
            this.logger.log('Preloaded: ' + route.path);
            return load();
        } else {
            return of(null);
        }
    }
}
