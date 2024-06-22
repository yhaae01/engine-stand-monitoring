import { HttpClient } from '@angular/common/http';
import { HttpService } from 'src/app/providers/http/http.service';
import { RequestDataDTO } from '../dto/request-data.dto';
import { Observable, lastValueFrom } from 'rxjs';
import { Injectable } from '@angular/core';
import { AddDataRequestDTO } from 'src/app/pages/request-form/sub-pages/add-request-form/dto/add-data-request.dto';
import { InventoryDTO } from '../dto/inventory.dto';
import { environment } from 'src/environments/environment';

export type ResponseMaster<U extends string, T> = Record<U, T>;

@Injectable()
export class RequestDataService extends HttpService<InventoryDTO> {
  constructor(private readonly _httpClient: HttpClient) {
    super(_httpClient);
  }

  getRequestData(
    params?: object
  ): Observable<ResponseMaster<'request', InventoryDTO[]>> {
    return this.get<any, ResponseMaster<'request', InventoryDTO[]>>(
      environment.apiUrl + '/get-request',
      params
    );
  }

  storeData(requestBody: object): Observable<any> {
    return this.post2(environment.apiUrl + '/add-request', requestBody);
  }

  updateData(requestBody: object): Observable<any> {
    return this.put(environment.apiUrl + '/update-request', requestBody);
  }

  getDataById(
    id: number
  ): Observable<ResponseMaster<'requestsData', RequestDataDTO>> {
    return this.show<any, ResponseMaster<'requestsData', RequestDataDTO>>(
      environment.apiUrl + '/show-request-datas/' + id
    );
  }
}
