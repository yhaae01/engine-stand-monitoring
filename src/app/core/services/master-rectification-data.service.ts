import { HttpClient } from '@angular/common/http';
import { HttpService } from 'src/app/providers/http/http.service';
import { MasterRectificationDTO } from '../dto/master-rectification.dto';
import { Observable, lastValueFrom } from 'rxjs';
import { Injectable } from '@angular/core';
import { AddMasterRectificationDTO } from 'src/app/pages/master-rectification/dto/add-master-rectification.dto';
import { environment } from 'src/environments/environment';

export type ResponseMaster<U extends string, T> = Record<U, T>;

@Injectable()
export class MasterRectificationDataService extends HttpService<MasterRectificationDTO> {
  constructor(private readonly _httpClient: HttpClient) {
    super(_httpClient);
  }

  getRectificationData(
    params?: object
  ): Observable<ResponseMaster<'rectificationData', MasterRectificationDTO[]>> {
    return this.get<
      any,
      ResponseMaster<'rectificationData', MasterRectificationDTO[]>
    >(environment.apiUrl + '/get-rectification', params);
  }

  storeData(requestBody: AddMasterRectificationDTO): Observable<any> {
    return this.post(environment.apiUrl + '/add-rectification', requestBody);
  }

  updateData(requestBody: object): Observable<any> {
    return this.put(environment.apiUrl + '/update-rectification', requestBody);
  }

  destroyData(requestBody: object): Observable<any> {
    return this.delete(
      environment.apiUrl + '/delete-rectification',
      requestBody
    );
  }
}
