import { HttpClient } from '@angular/common/http';
import { HttpService } from 'src/app/providers/http/http.service';
import { PmiSheetDTO } from '../dto/pmi-sheet.dto';
import { Observable, lastValueFrom } from 'rxjs';
import { Injectable } from '@angular/core';
import { AddPmiSheetDTO } from 'src/app/pages/pmi-sheet/dto/add-pmi-sheet.dto';
import { environment } from 'src/environments/environment';

export type ResponseMaster<U extends string, T> = Record<U, T>;

@Injectable()
export class PmiSheetService extends HttpService<PmiSheetDTO> {
  constructor(private readonly _httpClient: HttpClient) {
    super(_httpClient);
  }

  getPmiSheetData(
    params?: object
  ): Observable<ResponseMaster<'mPmiSheet', PmiSheetDTO[]>> {
    return this.get<any, ResponseMaster<'mPmiSheet', PmiSheetDTO[]>>(
      environment.apiUrl + '/pmi-sheet',
      params
    );
  }

  storeData(requestBody: AddPmiSheetDTO): Observable<any> {
    return this.post(environment.apiUrl + '/add-pmi-sheet', requestBody);
  }

  updateData(requestBody: object): Observable<any> {
    return this.put(environment.apiUrl + '/update-pmi-sheet', requestBody);
  }

  destroyData(requestBody: object): Observable<any> {
    return this.delete(environment.apiUrl + '/delete-pmi-sheet', requestBody);
  }
}
