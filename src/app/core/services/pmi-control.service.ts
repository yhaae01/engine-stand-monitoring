import { HttpClient } from '@angular/common/http';
import { HttpService } from 'src/app/providers/http/http.service';
import { PmiControlDTO } from '../dto/pmi-control.dto';
import { Observable, lastValueFrom } from 'rxjs';
import { Injectable } from '@angular/core';
import { AddDataPmiControlDTO } from 'src/app/pages/pmi-control/sub-pages/insert-pmi-data/dto/add-data-pmi-control.dto';
import { environment } from 'src/environments/environment';

export type ResponseMaster<U extends string, T> = Record<U, T>;

@Injectable()
export class PmiControlDataService extends HttpService<PmiControlDTO> {
  constructor(private readonly _httpClient: HttpClient) {
    super(_httpClient);
  }

  getPmiControlData(
    params?: object
  ): Observable<ResponseMaster<'pmiControl', PmiControlDTO[]>> {
    return this.get<any, ResponseMaster<'pmiControl', PmiControlDTO[]>>(
      environment.apiUrl + '/pmi-control',
      params
    );
  }

  storeData(requestBody: object): Observable<any> {
    return this.post2(environment.apiUrl + '/add-pmi-controls', requestBody);
  }

  updateData(requestBody: object): Observable<any> {
    return this.put(environment.apiUrl + '/update-pmi-controls', requestBody);
  }

  getDataById(
    id: number
  ): Observable<ResponseMaster<'pmiControlData', PmiControlDTO>> {
    return this.show<any, ResponseMaster<'pmiControlData', PmiControlDTO>>(
      environment.apiUrl + '/show-pmi-control-data/' + id
    );
  }
}
