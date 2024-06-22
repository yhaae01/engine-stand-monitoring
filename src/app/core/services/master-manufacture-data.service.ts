import { HttpClient } from '@angular/common/http';
import { HttpService } from 'src/app/providers/http/http.service';
import { MasterManufactureDTO } from '../dto/master-manufacture.dto';
import { Observable, lastValueFrom } from 'rxjs';
import { Injectable } from '@angular/core';
import { AddMasterManufactureDTO } from 'src/app/pages/master-manufacture/dto/add-master-manufacture.dto';
import { environment } from 'src/environments/environment';

export type ResponseMaster<U extends string, T> = Record<U, T>;

@Injectable()
export class MasterManufactureDataService extends HttpService<MasterManufactureDTO> {
  constructor(private readonly _httpClient: HttpClient) {
    super(_httpClient);
  }

  getManufactureData(
    params?: object
  ): Observable<ResponseMaster<'manufacture', MasterManufactureDTO[]>> {
    return this.get<any, ResponseMaster<'manufacture', MasterManufactureDTO[]>>(
      environment.apiUrl + '/manufacture',
      params
    );
  }

  storeData(requestBody: AddMasterManufactureDTO): Observable<any> {
    return this.post(environment.apiUrl + '/add-manufacture', requestBody);
  }

  updateData(requestBody: object): Observable<any> {
    return this.put(environment.apiUrl + '/update-manufacture', requestBody);
  }

  destroyData(requestBody: object): Observable<any> {
    return this.delete(environment.apiUrl + '/delete-manufacture', requestBody);
  }
}
