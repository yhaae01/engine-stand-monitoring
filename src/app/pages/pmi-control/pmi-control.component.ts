import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  createPlatform,
} from '@angular/core';
import { Subject, map, takeUntil, tap } from 'rxjs';
import { RouteHelperService } from 'src/app/core/services/route-helper.service';
import { HttpClient } from '@angular/common/http';
import { PmiControlDTO } from 'src/app/core/dto/pmi-control.dto';
import { ToastrService } from 'ngx-toastr';
import { PmiControlDataService } from 'src/app/core/services/pmi-control.service';
import { UserDataService } from 'src/app/core/services/user-data.service';
import { UserDataDTO } from 'src/app/core/dto/user-data.dto';
import { PaginatorRequest } from 'src/app/core/requests/paginator.request';
import { Router } from '@angular/router';
import { MasterAircraftDTO } from 'src/app/core/dto/master-aircraft.dto';
import { MasterTypeDTO } from 'src/app/core/dto/master-type.dto';
import { MasterManufactureDTO } from 'src/app/core/dto/master-manufacture.dto';
import { InventoryDTO } from 'src/app/core/dto/inventory.dto';
import { MasterAircraftDataService } from 'src/app/core/services/master-aircraft-data.service';
import { MasterTypeDataService } from 'src/app/core/services/master-type-data.service';
import { MasterManufactureDataService } from 'src/app/core/services/master-manufacture-data.service';
import { InventoryDataService } from 'src/app/core/services/inventory-data.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ParamsRequest } from 'src/app/core/requests/params.request';

@Component({
  selector: 'app-pmi-control',
  templateUrl: './pmi-control.component.html',
  styleUrls: ['./pmi-control.component.css'],
})
export class PmiControlComponent implements OnInit, OnDestroy {
  _onDestroy$: Subject<Boolean> = new Subject<Boolean>();
  pmiControlData: PmiControlDTO[] = [];
  dataRequest: ParamsRequest;

  userInfo: UserDataDTO = <UserDataDTO>{};
  orderRequest: object = {};
  paginator: PaginatorRequest;
  filterRequest: object = {};
  orderField: string = 'description';
  orderByAsc: boolean = true;

  searchForm: FormGroup;

  aircraftTypeData: MasterAircraftDTO[] = [];
  typeData: MasterTypeDTO[] = [];
  manufactureData: MasterManufactureDTO[] = [];
  partNumberData: InventoryDTO[] = [];
  serialNumberData: InventoryDTO[] = [];

  onStatus: number = 0;

  constructor(
    private readonly router: Router,
    private route: RouteHelperService,
    private readonly pmiControlDataService: PmiControlDataService,
    private readonly userService: UserDataService,
    private readonly toastr: ToastrService,
    private http: HttpClient,
    private readonly formBuilder: FormBuilder,
    private readonly aircraftTypeService: MasterAircraftDataService,
    private readonly typeService: MasterTypeDataService,
    private readonly manufactureService: MasterManufactureDataService,
    private readonly inventoryService: InventoryDataService
  ) {}

  ngOnInit(): void {
    this.getUserInfo();

    this.initPaginator();
    this.initOrder();
    this.initParams();

    this.initData();

    this.createForm();
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

  searchData(): void {
    Object.keys(this.searchForm.value).some((k) => {
      if (this.searchForm.value[k]) {
        this.filterRequest[k] = { _eq: this.searchForm.value[k] };
      } else {
        delete this.filterRequest[k];
      }
    });

    this.pmiControlDataService
      .getPmiControlData({
        filter: this.filterRequest,
      })
      .pipe(
        tap((response) => {
          for (let pmiControlData of response.pmiControl) {
            let startDate = new Date();
            // let startDate = new Date(pmiControlData.pmiData[0].pmiDate);
            let endDate = new Date(pmiControlData.pmiData[0].nextPmiDueDate);

            pmiControlData.days = Math.floor(
              (endDate.getTime() - startDate.getTime()) / (24 * 3600 * 1000)
            );
          }
        }),
        takeUntil(this._onDestroy$)
      )
      .subscribe((response) => {
        if (response.pmiControl.length == 1) {
          this.insertData(response.pmiControl[0].equipmentId);
        } else {
          this.pmiControlData = response.pmiControl;
        }
      });

    this.pmiControlDataService
      .getPmiControlData({ filter: this.filterRequest })
      .pipe(takeUntil(this._onDestroy$))
      .subscribe((response) => {
        this.paginator.totalData = response.pmiControl?.length;
        this.paginator.totalPage = Math.floor(
          (response.pmiControl.length + this.paginator.pageSize - 1) /
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

    Object.keys(this.searchForm.value).some((k) => {
      delete this.filterRequest[k];
    });

    this.dataRequest.order = this.orderRequest;
    this.rePaginate(true);
  }

  getUserInfo(): void {
    this.userService
      .getUser()
      .pipe(takeUntil(this._onDestroy$))
      .subscribe((response) => (this.userInfo = response.body));
  }

  insertData(equipmentId: number): void {
    this.router.navigate(['/pmi-control/insert-pmi-data', equipmentId]);
  }

  uniqueArray(target: Array<any>, property: any): Array<any> {
    return target.filter(
      (item, index) =>
        index === target.findIndex((t) => t[property] === item[property])
    );
  }

  initData(): void {
    this.pmiControlDataService
      .getPmiControlData({
        filter: this.filterRequest,
      })
      .pipe(
        tap((response) => {
          for (let pmiControlData of response.pmiControl) {
            let startDate = new Date();
            // let startDate = new Date(pmiControlData.pmiData[0].pmiDate);
            let endDate = new Date(pmiControlData.pmiData.nextPmiDueDate);

            pmiControlData.days = Math.floor(
              (endDate.getTime() - startDate.getTime()) / (24 * 3600 * 1000)
            );
          }
        }),
        takeUntil(this._onDestroy$)
      )
      .subscribe((response) => {
        this.pmiControlData = response.pmiControl;
      });

    this.pmiControlDataService
      .getPmiControlData({ filter: this.filterRequest })
      .pipe(takeUntil(this._onDestroy$))
      .subscribe((response) => {
        this.paginator.totalData = response.pmiControl?.length;
        this.paginator.totalPage = Math.floor(
          (response.pmiControl.length + this.paginator.pageSize - 1) /
            this.paginator.pageSize
        );
      });

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

  loadData(): void {
    this.pmiControlDataService
      .getPmiControlData(this.dataRequest)
      .pipe(
        tap((response) => {
          for (let pmiControlData of response.pmiControl) {
            let startDate = new Date();
            // let startDate = new Date(pmiControlData.pmiData[0].pmiDate);
            let endDate = new Date(pmiControlData.pmiData.nextPmiDueDate);

            pmiControlData.days = Math.floor(
              (endDate.getTime() - startDate.getTime()) / (24 * 3600 * 1000)
            );
          }
        }),
        takeUntil(this._onDestroy$)
      )
      .subscribe((response) => {
        this.pmiControlData = response.pmiControl;
      });

    this.pmiControlDataService
      .getPmiControlData({ filter: this.filterRequest })
      .pipe(takeUntil(this._onDestroy$))
      .subscribe((response) => {
        this.paginator.totalData = response.pmiControl?.length;
        this.paginator.totalPage = Math.floor(
          (response.pmiControl.length + this.paginator.pageSize - 1) /
            this.paginator.pageSize
        );
      });
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

  initOrder() {
    this.orderRequest[this.orderField] = this.orderByAsc ? 'asc' : 'desc';
  }

  initParams(): void {
    this.dataRequest = {
      filter: this.filterRequest,
      order: this.orderRequest,
      limit: this.paginator.pageSize,
      offset: (this.paginator.pageNumber - 1) * this.paginator.pageSize,
    };
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
    if (isNextPage) this.paginator.pageNumber++;
    else this.paginator.pageNumber--;

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
