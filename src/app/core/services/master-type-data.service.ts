import { HttpClient } from '@angular/common/http';
import { HttpService } from 'src/app/providers/http/http.service';
import { MasterTypeDTO } from '../dto/master-type.dto';
import { Observable, lastValueFrom } from 'rxjs';
import { Injectable } from '@angular/core';
import { AddMasterEngineDTO } from 'src/app/pages/master-engine-type/dto/add-master-engine-type.dto';
import { environment } from 'src/environments/environment';

export type ResponseMaster<U extends string, T> = Record<U, T>;

@Injectable()
export class MasterTypeDataService extends HttpService<MasterTypeDTO> {
  constructor(private readonly _httpClient: HttpClient) {
    super(_httpClient);
  }

  getTypeData(
    params?: object
  ): Observable<ResponseMaster<'mType', MasterTypeDTO[]>> {
    return this.get<any, ResponseMaster<'mType', MasterTypeDTO[]>>(
      environment.apiUrl + '/type',
      params
    );
  }

  storeData(requestBody: AddMasterEngineDTO): Observable<any> {
    return this.post(environment.apiUrl + '/add-type', requestBody);
  }

  updateData(requestBody: object): Observable<any> {
    return this.put(environment.apiUrl + '/update-type', requestBody);
  }

  destroyData(requestBody: object): Observable<any> {
    return this.delete(environment.apiUrl + '/delete-type', requestBody);
  }
}
