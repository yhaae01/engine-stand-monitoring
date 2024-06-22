import { HttpClient } from '@angular/common/http';
import { HttpService } from 'src/app/providers/http/http.service';
import { MasterCategoryDTO } from '../dto/master-category.dto';
import { Observable, lastValueFrom } from 'rxjs';
import { AddMasterCategoryHazardDTO } from 'src/app/pages/master-category-hazard/dto/add-master-category-hazard.dto';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

export type ResponseMaster<U extends string, T> = Record<U, T>;

@Injectable()
export class MasterCategoryDataService extends HttpService<MasterCategoryDTO> {
  constructor(private readonly _httpClient: HttpClient) {
    super(_httpClient);
  }

  getCategoryData(
    params?: object
  ): Observable<ResponseMaster<'category', MasterCategoryDTO[]>> {
    return this.get<any, ResponseMaster<'category', MasterCategoryDTO[]>>(
      environment.apiUrl + '/category',
      params
    );
  }

  storeData(requestBody: AddMasterCategoryHazardDTO): Observable<any> {
    return this.post(environment.apiUrl + '/add-category', requestBody);
  }

  updateData(requestBody: object): Observable<any> {
    return this.put(environment.apiUrl + '/update-category', requestBody);
  }

  destroyData(requestBody: object): Observable<any> {
    return this.delete(environment.apiUrl + '/delete-category', requestBody);
  }
}
