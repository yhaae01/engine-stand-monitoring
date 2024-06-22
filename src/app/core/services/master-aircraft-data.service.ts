import { HttpClient } from '@angular/common/http';
import { HttpService } from 'src/app/providers/http/http.service';
import { MasterAircraftDTO } from '../dto/master-aircraft.dto';
import { Observable, lastValueFrom } from 'rxjs';
import { Injectable } from '@angular/core';
import { AddMasterAircraftDTO } from 'src/app/pages/master-aircraft-type/dto/add-master-aircraft-type.dto';
import { environment } from 'src/environments/environment';

export type ResponseMaster<U extends string, T> = Record<U, T>;

@Injectable()
export class MasterAircraftDataService extends HttpService<MasterAircraftDTO> {
  constructor(private readonly _httpClient: HttpClient) {
    super(_httpClient);
  }

  getAircraftData(
    params?: object
  ): Observable<ResponseMaster<'aircraftType', MasterAircraftDTO[]>> {
    return this.get<any, ResponseMaster<'aircraftType', MasterAircraftDTO[]>>(
      environment.apiUrl + '/aircraft-type',
      params
    );
  }

  storeData(requestBody: AddMasterAircraftDTO): Observable<any> {
    return this.post(environment.apiUrl + '/add-aircraft-type', requestBody);
  }

  updateData(requestBody: object): Observable<any> {
    return this.put(environment.apiUrl + '/update-aircraft-type', requestBody);
  }

  destroyData(requestBody: object): Observable<any> {
    return this.delete(
      environment.apiUrl + '/delete-aircraft-type',
      requestBody
    );
  }
}
