import { HttpClient } from '@angular/common/http';
import { HttpService } from 'src/app/providers/http/http.service';
import { HomeDataDTO } from '../dto/home-data.dto';
import { Observable, lastValueFrom } from 'rxjs';
import { Injectable } from '@angular/core';
import { InventoryDTO } from '../dto/inventory.dto';
import { environment } from 'src/environments/environment';

export type ResponseMaster<U extends string, T> = Record<U, T>;

@Injectable()
export class HomeDataService extends HttpService<HomeDataDTO> {
  constructor(private readonly _httpClient: HttpClient) {
    super(_httpClient);
  }

  getHomeData(
    params?: object
  ): Observable<ResponseMaster<'homeData', HomeDataDTO[]>> {
    return this.get<any, ResponseMaster<'homeData', HomeDataDTO[]>>(
      environment.apiUrl + '/get-home',
      params
    );
  }

  getDataById(id: number): Observable<ResponseMaster<'homeData', HomeDataDTO>> {
    return this.show<any, ResponseMaster<'homeData', HomeDataDTO>>(
      environment.apiUrl + '/show-home-data/' + id
    );
  }

  updateStatusRejectData(requestBody: object): Observable<any> {
    return this.put(
      environment.apiUrl + '/update-status-home-detail-reject',
      requestBody
    );
  }

  updateStatusLoanData(requestBody: object): Observable<any> {
    return this.put(
      environment.apiUrl + '/update-status-home-detail-loan',
      requestBody
    );
  }

  updateStatusRequestData(requestBody: object): Observable<any> {
    return this.put(
      environment.apiUrl + '/update-status-home-detail-request',
      requestBody
    );
  }

  updateStatusClosedData(requestBody: object): Observable<any> {
    return this.put(
      environment.apiUrl + '/update-status-home-detail-closed',
      requestBody
    );
  }

  updateStatusUsedData(requestBody: object): Observable<any> {
    return this.put(
      environment.apiUrl + '/update-status-home-detail-used',
      requestBody
    );
  }

  updateStatusDeliveredData(requestBody: object): Observable<any> {
    return this.put(
      environment.apiUrl + '/update-status-home-detail-delivered',
      requestBody
    );
  }

  updateStatusData(requestBody: object): Observable<any> {
    return this.put(
      environment.apiUrl + '/update-status-home-detail',
      requestBody
    );
  }
}
