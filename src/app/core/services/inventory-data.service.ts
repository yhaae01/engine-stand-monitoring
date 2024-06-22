import { HttpClient } from '@angular/common/http';
import { HttpService } from 'src/app/providers/http/http.service';
import { InventoryDTO } from '../dto/inventory.dto';
import { Observable, lastValueFrom } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

export type ResponseMaster<U extends string, T> = Record<U, T>;

@Injectable()
export class InventoryDataService extends HttpService<InventoryDTO> {
  constructor(private readonly _httpClient: HttpClient) {
    super(_httpClient);
  }

  getInventoryData(
    params?: object
  ): Observable<ResponseMaster<'inventory', InventoryDTO[]>> {
    return this.get<any, ResponseMaster<'inventory', InventoryDTO[]>>(
      environment.apiUrl + '/inventory',
      params
    );
  }

  storeData(requestBody: any): Observable<any> {
    return this.post(environment.apiUrl + '/add-inventory', requestBody);
  }

  updateData(requestBody: object): Observable<any> {
    return this.put(environment.apiUrl + '/update-inventory', requestBody);
  }

  outgoingInventory(requestBody: object): Observable<any> {
    return this.put(environment.apiUrl + '/outgoing-inventory', requestBody);
  }

  incomingInventory(requestBody: object): Observable<any> {
    return this.put(environment.apiUrl + '/incoming-inventory', requestBody);
  }

  destroyData(requestBody: object): Observable<any> {
    return this.delete(environment.apiUrl + '/delete-inventory', requestBody);
  }

  getDataById(
    id: number
  ): Observable<ResponseMaster<'inventoryData', InventoryDTO>> {
    return this.show<any, ResponseMaster<'inventoryData', InventoryDTO>>(
      environment.apiUrl + '/show-inventory-data/' + id
    );
  }
}
