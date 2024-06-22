import { HttpClient } from '@angular/common/http';
import { HttpService } from 'src/app/providers/http/http.service';
import { MasterJobDescDTO } from '../dto/master-job-desc.dto';
import { Observable, lastValueFrom } from 'rxjs';
import { Injectable } from '@angular/core';
import { AddMasterJobDescDTO } from 'src/app/pages/master-job-desc/dto/add-master-job-desc.dto';
import { environment } from 'src/environments/environment';

export type ResponseMaster<U extends string, T> = Record<U, T>;

@Injectable()
export class MasterJobDescDataService extends HttpService<MasterJobDescDTO> {
  constructor(private readonly _httpClient: HttpClient) {
    super(_httpClient);
  }

  getJobDescData(
    params?: object
  ): Observable<ResponseMaster<'jobDesc', MasterJobDescDTO[]>> {
    return this.get<any, ResponseMaster<'jobDesc', MasterJobDescDTO[]>>(
      environment.apiUrl + '/job-desc',
      params
    );
  }

  storeData(requestBody: AddMasterJobDescDTO): Observable<any> {
    return this.post(environment.apiUrl + '/add-job-desc', requestBody);
  }

  updateData(requestBody: object): Observable<any> {
    return this.put(environment.apiUrl + '/update-job-desc', requestBody);
  }

  destroyData(requestBody: object): Observable<any> {
    return this.delete(environment.apiUrl + '/delete-job-desc', requestBody);
  }
}
