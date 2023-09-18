import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfigService } from '../../config/appconfig-service';
import { ICategory } from 'src/app/shared/model/category.model';
import { Observable, map } from 'rxjs';
import { IResponseType } from 'src/app/shared/interfaces';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private categoryUrl:string = "/category"
  constructor(private http: HttpClient,
    private _appConfigService: AppConfigService) { }

  findByProject(projectId: number): Observable<ICategory[]> {
    return this.http.get<ICategory[]>(this._appConfigService.apiConfig().apiEndpoint + this.categoryUrl + '/project/'+projectId);
  }

  create(category: ICategory): Observable<IResponseType<ICategory>> {
    return this.http.post<IResponseType<ICategory>>(this._appConfigService.apiConfig().apiEndpoint + this.categoryUrl + '/create', category)
    .pipe(
      map(response => {
          return response;
      })
    );
  }
    
}
