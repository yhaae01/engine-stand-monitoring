import { HttpClient } from '@angular/common/http';
import { HttpService } from 'src/app/providers/http/http.service';
import { ReportHazardDTO } from '../dto/report-hazard.dto';
import { Observable, lastValueFrom } from 'rxjs';
import { Injectable } from '@angular/core';
import { AddReportHazardDTO } from 'src/app/pages/report-hazard/sub-pages/add-report-hazard/dto/add-report-hazard.dto';
import { environment } from 'src/environments/environment';

export type ResponseMaster<U extends string, T> = Record<U, T>;

@Injectable()
export class ReportHazardDataService extends HttpService<ReportHazardDTO> {
  constructor(private readonly _httpClient: HttpClient) {
    super(_httpClient);
  }

  getReportHazardData(
    params?: object
  ): Observable<ResponseMaster<'reportHazardData', ReportHazardDTO[]>> {
    return this.get<any, ResponseMaster<'reportHazardData', ReportHazardDTO[]>>(
      environment.apiUrl + '/hazard',
      params
    );
  }

  storeData(requestBody: object): Observable<any> {
    return this.post2(environment.apiUrl + '/add-report-hazard', requestBody);
  }

  updateData(requestBody: object): Observable<any> {
    return this.put(environment.apiUrl + '/update-report-hazard', requestBody);
  }

  closeData(requestBody: object): Observable<any> {
    return this.put(environment.apiUrl + '/close-report-hazard', requestBody);
  }

  updateProposed(requestBody: object): Observable<any> {
    return this.put(
      environment.apiUrl + '/update-proposed-report-hazard',
      requestBody
    );
  }

  getDataById(
    id: number
  ): Observable<ResponseMaster<'reportHazardDetail', ReportHazardDTO>> {
    return this.show<
      any,
      ResponseMaster<'reportHazardDetail', ReportHazardDTO>
    >(environment.apiUrl + '/show-report-hazard-data/' + id);
  }
}
