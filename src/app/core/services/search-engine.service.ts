import { HttpClient } from '@angular/common/http';
import { HttpService } from 'src/app/providers/http/http.service';
import { Observable, lastValueFrom } from 'rxjs';
import { Injectable } from '@angular/core';
import { SearchEngineDTO } from '../dto/search-engine.dto';
import { environment } from 'src/environments/environment';

export type ResponseMaster<U extends string, T> = Record<U, T>;

@Injectable()
export class SearchEngineDataService extends HttpService<SearchEngineDTO> {
  constructor(private readonly _httpClient: HttpClient) {
    super(_httpClient);
  }

  getSearchEngineData(
    params?: object
  ): Observable<ResponseMaster<'searchEngine', SearchEngineDTO[]>> {
    return this.get<any, ResponseMaster<'searchEngine', SearchEngineDTO[]>>(
      environment.apiUrl + '/search-engine',
      params
    );
  }

  getDataById(
    id: number
  ): Observable<ResponseMaster<'searchEngineData', SearchEngineDTO>> {
    return this.show<any, ResponseMaster<'searchEngineData', SearchEngineDTO>>(
      environment.apiUrl + '/show-search-engine-data/' + id
    );
  }
}
