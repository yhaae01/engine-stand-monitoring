import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpService } from 'src/app/providers/http/http.service';
import { UserDataDTO } from '../dto/user-data.dto';
import { Observable, lastValueFrom } from 'rxjs';
import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';

@Injectable()
export class UserDataService extends HttpService<UserDataDTO> {
  constructor(
    httpClient: HttpClient,
    private readonly keycloak: KeycloakService
  ) {
    super(httpClient);
  }

  getUser(personalNumber?: string): Observable<any> {
    if (!personalNumber) personalNumber = this.keycloak.getUsername();
    const headers = new HttpHeaders().set('x-api-key', '543C-EF0B-4137-A27F');

    const request = this.getCustomUrlWithHeader(
      'https://api.gmf-aeroasia.co.id/th/soev2/v2/employee/' + personalNumber,
      headers
    );

    return request;
  }
}
