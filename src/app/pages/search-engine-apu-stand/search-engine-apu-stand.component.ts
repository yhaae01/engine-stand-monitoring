import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouteHelperService } from 'src/app/core/services/route-helper.service';
import { HttpClient } from '@angular/common/http';
import { SearchEngineDTO } from 'src/app/core/dto/search-engine.dto';
import { Subject, map, takeUntil, tap } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SearchEngineDataService } from 'src/app/core/services/search-engine.service';
import { UserDataDTO } from 'src/app/core/dto/user-data.dto';
import { UserDataService } from 'src/app/core/services/user-data.service';
import { PaginatorRequest } from 'src/app/core/requests/paginator.request';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MasterAircraftDataService } from 'src/app/core/services/master-aircraft-data.service';
import { MasterManufactureDataService } from 'src/app/core/services/master-manufacture-data.service';
import { MasterTypeDataService } from 'src/app/core/services/master-type-data.service';
import { InventoryDTO } from 'src/app/core/dto/inventory.dto';
import { MasterAircraftDTO } from 'src/app/core/dto/master-aircraft.dto';
import { MasterManufactureDTO } from 'src/app/core/dto/master-manufacture.dto';
import { MasterTypeDTO } from 'src/app/core/dto/master-type.dto';
import { InventoryDataService } from 'src/app/core/services/inventory-data.service';
import { ParamsRequest } from 'src/app/core/requests/params.request';

@Component({
  selector: 'app-search-engine-apu-stand',
  templateUrl: './search-engine-apu-stand.component.html',
  styleUrls: ['./search-engine-apu-stand.component.css'],
})
export class SearchEngineApuStandComponent implements OnInit, OnDestroy {
  _onDestroy$: Subject<Boolean> = new Subject<Boolean>();
  searchEngineData: SearchEngineDTO[] = [];
  dataRequest: ParamsRequest;
  userInfo: UserDataDTO = <UserDataDTO>{};
  filterRequest: object = {};
  orderRequest: object = {};
  orderField: string = 'description';
  orderByAsc: boolean = true;
  searchForm: FormGroup;

  aircraftTypeData: MasterAircraftDTO[] = [];
  typeData: MasterTypeDTO[] = [];
  manufactureData: MasterManufactureDTO[] = [];
  partNumberData: InventoryDTO[] = [];
  serialNumberData: InventoryDTO[] = [];

  paginator: PaginatorRequest;

  onSearch: boolean = false;
  onStatus: number = 0;

  constructor(
    private route: RouteHelperService,
    private readonly toastr: ToastrService,
    private readonly searchEngineDataService: SearchEngineDataService,
    private readonly userService: UserDataService,
    private readonly formBuilder: FormBuilder,
    private readonly router: Router,
    private readonly aircraftTypeService: MasterAircraftDataService,
    private readonly typeService: MasterTypeDataService,
    private readonly inventoryService: InventoryDataService,
    private readonly manufactureService: MasterManufactureDataService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.getUserInfo();

    this.initPaginator();
    this.initOrder();
    this.initParams();

    this.initData();

    this.createForm();
  }

  getUserInfo(): void {
    this.userService
      .getUser()
      .pipe(takeUntil(this._onDestroy$))
      .subscribe((response) => (this.userInfo = response.body));
  }

  detailSearch(equipmentId: number): void {
    this.router.navigate([
      '/search-engine-apu-stand/detail-search',
      equipmentId,
    ]);
  }

  createForm(): void {
    this.searchForm = this.formBuilder.group({
      aircraft_type_id: ['', ''],
      type_id: ['', ''],
      manufacture_id: ['', ''],
      part_number: ['', ''],
      serial_number: ['', ''],
    });
  }

  uniqueArray(target: Array<any>, property: any): Array<any> {
    return target.filter(
      (item, index) =>
        index === target.findIndex((t) => t[property] === item[property])
    );
  }

  initData(): void {
    this.aircraftTypeService
      .getAircraftData()
      .pipe(takeUntil(this._onDestroy$))
      .subscribe((response) => (this.aircraftTypeData = response.aircraftType));

    this.typeService
      .getTypeData()
      .pipe(takeUntil(this._onDestroy$))
      .subscribe((response) => (this.typeData = response.mType));

    this.manufactureService
      .getManufactureData()
      .pipe(takeUntil(this._onDestroy$))
      .subscribe((response) => (this.manufactureData = response.manufacture));

    this.inventoryService
      .getInventoryData()
      .pipe(
        map((inventory) => ({
          ...inventory,
          uniquePartNumber: this.uniqueArray(inventory.inventory, 'partNumber'),
        })),
        takeUntil(this._onDestroy$)
      )
      .subscribe(
        (response) => (this.partNumberData = response.uniquePartNumber)
      );

    this.inventoryService
      .getInventoryData()
      .pipe(
        map((inventory) => ({
          ...inventory,
          uniqueSerialNumber: this.uniqueArray(
            inventory.inventory,
            'serialNumber'
          ),
        })),
        takeUntil(this._onDestroy$)
      )
      .subscribe(
        (response) => (this.serialNumberData = response.uniqueSerialNumber)
      );
  }

  searchData(): void {
    // if (!this.searchForm.dirty) {
    //   this.toastr.info('Select at least one filter first', 'Oopps!');
    // } else {
    Object.keys(this.searchForm.value).some((k) => {
      if (this.searchForm.value[k]) {
        this.filterRequest[k] = { _eq: this.searchForm.value[k] };
      } else {
        delete this.filterRequest[k];
      }
    });

    this.searchEngineDataService
      .getSearchEngineData({
        filter: this.filterRequest,
      })
      .pipe(takeUntil(this._onDestroy$))
      .subscribe((response) => {
        this.searchEngineData = response.searchEngine;
        this.onSearch = true;
      });

    this.searchEngineDataService
      .getSearchEngineData({ filter: this.filterRequest })
      .pipe(takeUntil(this._onDestroy$))
      .subscribe((response) => {
        this.paginator.totalData = response.searchEngine?.length;
        this.paginator.totalPage = Math.floor(
          (response.searchEngine.length + this.paginator.pageSize - 1) /
            this.paginator.pageSize
        );
      });
    // }
  }

  loadData(): void {
    this.searchEngineDataService
      .getSearchEngineData(this.dataRequest)
      .pipe(takeUntil(this._onDestroy$))
      .subscribe((response) => {
        this.searchEngineData = response.searchEngine;
      });

    this.searchEngineDataService
      .getSearchEngineData({ filter: this.filterRequest })
      .pipe(takeUntil(this._onDestroy$))
      .subscribe((response) => {
        this.paginator.totalData = response.searchEngine?.length;
        this.paginator.totalPage = Math.floor(
          (response.searchEngine.length + this.paginator.pageSize - 1) /
            this.paginator.pageSize
        );
      });
  }

  resetData(): void {
    this.searchForm.reset();
    this.searchForm.patchValue({
      aircraft_type_id: '',
      type_id: '',
      manufacture_id: '',
      part_number: '',
      serial_number: '',
    });

    this.searchEngineData = [];
    this.filterRequest = {};
    this.onSearch = false;

    delete this.orderRequest[this.orderField];
    this.orderField = 'description';
    this.orderByAsc = true;

    this.initPaginator();
    this.initOrder();
    this.initParams();
  }

  initPaginator(): void {
    this.paginator = {
      pageOption: [10, 25, 50, 100],
      pageNumber: 1,
      pageSize: 10,
      totalData: 0,
      totalPage: 0,
    };
  }

  initParams(): void {
    this.dataRequest = {
      filter: this.filterRequest,
      order: this.orderRequest,
      limit: this.paginator.pageSize,
      offset: (this.paginator.pageNumber - 1) * this.paginator.pageSize,
    };
  }

  initOrder() {
    this.orderRequest[this.orderField] = this.orderByAsc ? 'asc' : 'desc';
  }

  orderByField(field: string): void {
    var fields;

    if (field.includes('.')) {
      fields = field.split('.');
      field = fields[0];
    } else {
      fields = false;
    }

    if (field == this.orderField) {
      if (fields) {
        this.orderRequest[field] = {};
        this.orderRequest[field][fields[1]] = this.orderByAsc ? 'desc' : 'asc';
      } else {
        this.orderRequest[this.orderField] = this.orderByAsc ? 'desc' : 'asc';
      }

      this.orderByAsc = this.orderByAsc ? false : true;
    } else {
      this.orderByAsc = true;
      this.orderRequest = {};

      if (fields) {
        this.orderField = field;
        this.orderRequest[this.orderField] = {};
        this.orderRequest[this.orderField][fields[1]] = 'asc';
      } else {
        this.orderField = field;
        this.orderRequest[this.orderField] = 'asc';
      }
    }

    this.dataRequest.order = this.orderRequest;
    this.rePaginate();
  }

  filterDate(event: any): void {
    let startDate = event.target.value;

    if (startDate) {
      this.filterRequest['manufacture_date'] = {
        _gte: startDate,
        _lte: startDate,
      };
    } else {
      delete this.filterRequest['manufacture_date'];
    }

    this.dataRequest.filter = this.filterRequest;
    this.rePaginate(true);
  }

  filterStatus(event: any): void {
    this.onStatus = event.target.value;

    if (this.onStatus != 0) {
      this.filterRequest['activity_status'] = { _eq: this.onStatus };
    } else {
      delete this.filterRequest['activity_status'];
    }

    this.dataRequest.filter = this.filterRequest;
    this.rePaginate(true);
  }

  filterByField(field: string, event: any): void {
    let terms = event.target.value;

    if (terms.length >= 1) {
      if (field.includes('.')) {
        let fields = field.split('.');

        this.filterRequest[fields[0]] = {};
        this.filterRequest[fields[0]][fields[1]] = {
          _ilike: `%${terms}%`,
        };
      } else {
        if (this.filterRequest.hasOwnProperty(field)) {
          this.filterRequest[field]['_ilike'] = `%${terms}%`;
        } else {
          this.filterRequest[field] = {
            _ilike: `%${terms}%`,
          };
        }
      }
    } else {
      if (field.includes('.')) {
        delete this.filterRequest[field.split('.')[0]];
      } else {
        if (this.filterRequest.hasOwnProperty(field)) {
          delete this.filterRequest[field]['_ilike'];
        } else {
          delete this.filterRequest[field];
        }
      }
    }

    this.dataRequest.filter = this.filterRequest;
    this.rePaginate(true);
  }

  changePageNumber(isNextPage: boolean): void {
    if (isNextPage) {
      this.paginator.pageNumber++;
    } else {
      this.paginator.pageNumber--;
    }

    this.rePaginate();
  }

  changePageSize(): void {
    this.paginator.pageNumber = 1;
    this.rePaginate();
  }

  rePaginate(refresh?: boolean): void {
    if (refresh) {
      this.paginator.pageNumber = 1;
      this.paginator.pageSize = 10;
    }

    this.dataRequest.limit = this.paginator.pageSize;
    this.dataRequest.offset =
      (this.paginator.pageNumber - 1) * this.paginator.pageSize;

    this.loadData();
  }

  ngOnDestroy(): void {
    this._onDestroy$.next(true);
    this._onDestroy$.unsubscribe();
  }
}
