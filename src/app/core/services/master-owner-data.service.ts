import { HttpClient } from '@angular/common/http';
import { HttpService } from 'src/app/providers/http/http.service';
import { MasterOwnerDTO } from '../dto/master-owner.dto';
import { Observable, lastValueFrom } from 'rxjs';
import { Injectable } from '@angular/core';
import { AddMasterOwnerDTO } from 'src/app/pages/master-owner/dto/add-master-owner.dto';
import { environment } from 'src/environments/environment';

export type ResponseMaster<U extends string, T> = Record<U, T>;

@Injectable()
export class MasterOwnerDataService extends HttpService<MasterOwnerDTO> {
  constructor(private readonly _httpClient: HttpClient) {
    super(_httpClient);
  }

  getOwnerData(
    params?: object
  ): Observable<ResponseMaster<'owner', MasterOwnerDTO[]>> {
    return this.get<any, ResponseMaster<'owner', MasterOwnerDTO[]>>(
      environment.apiUrl + '/owner',
      params
    );
  }

  storeData(requestBody: AddMasterOwnerDTO): Observable<any> {
    return this.post(environment.apiUrl + '/add-owner', requestBody);
  }

  updateData(requestBody: object): Observable<any> {
    return this.put(environment.apiUrl + '/update-owner', requestBody);
  }
}
