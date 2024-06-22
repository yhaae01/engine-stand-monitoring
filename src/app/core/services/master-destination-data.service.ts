import { HttpClient } from '@angular/common/http';
import { HttpService } from 'src/app/providers/http/http.service';
import { MasterDestinationDTO } from '../dto/master-destination.dto';
import { Observable, lastValueFrom } from 'rxjs';
import { Injectable } from '@angular/core';
import { AddMasterDestinationDTO } from 'src/app/pages/master-destination/dto/add-master-destination.dto';
import { environment } from 'src/environments/environment';

export type ResponseMaster<U extends string, T> = Record<U, T>;

@Injectable()
export class MasterDestinationDataService extends HttpService<MasterDestinationDTO> {
  constructor(private readonly _httpClient: HttpClient) {
    super(_httpClient);
  }

  getDestinationData(
    params?: object
  ): Observable<ResponseMaster<'destination', MasterDestinationDTO[]>> {
    return this.get<any, ResponseMaster<'destination', MasterDestinationDTO[]>>(
      environment.apiUrl + '/destination',
      params
    );
  }

  storeData(requestBody: AddMasterDestinationDTO): Observable<any> {
    return this.post(environment.apiUrl + '/add-destination', requestBody);
  }

  updateData(requestBody: object): Observable<any> {
    return this.put(environment.apiUrl + '/update-destination', requestBody);
  }

  destroyData(requestBody: object): Observable<any> {
    return this.delete(environment.apiUrl + '/delete-destination', requestBody);
  }
}
