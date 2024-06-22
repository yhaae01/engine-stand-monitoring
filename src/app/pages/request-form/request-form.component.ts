import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouteHelperService } from 'src/app/core/services/route-helper.service';
import { Subject, takeUntil, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { UserDataService } from 'src/app/core/services/user-data.service';
import { UserDataDTO } from 'src/app/core/dto/user-data.dto';
import { Router } from '@angular/router';
import { PaginatorRequest } from 'src/app/core/requests/paginator.request';
import { RequestDataService } from 'src/app/core/services/request-data.service';
import { RequestDataDTO } from 'src/app/core/dto/request-data.dto';
import { ToastrService } from 'ngx-toastr';
import { ParamsRequest } from 'src/app/core/requests/params.request';
import { InventoryDTO } from 'src/app/core/dto/inventory.dto';

@Component({
  selector: 'app-request-form',
  templateUrl: './request-form.component.html',
  styleUrls: ['./request-form.component.css'],
})
export class RequestFormComponent implements OnInit, OnDestroy {
  requestData: InventoryDTO[];
  _onDestroy$: Subject<Boolean> = new Subject<Boolean>();
  userInfo: UserDataDTO = <UserDataDTO>{};
  dataRequest: ParamsRequest;
  filterRequest: object = {};
  paginator: PaginatorRequest;

  orderRequest: object = {};
  orderField: string = 'm_aircraft_type';
  orderByAsc: boolean = true;
  onStatus: number = 9;

  constructor(
    private route: RouteHelperService,
    private readonly toastr: ToastrService,
    private http: HttpClient,
    private readonly router: Router,
    private readonly requestDataService: RequestDataService,
    private readonly userService: UserDataService
  ) {}

  ngOnInit(): void {
    this.getUserInfo();

    this.initPaginator();
    this.initOrder();
    this.initParams();

    this.initData();
  }

  ngOnDestroy(): void {
    this._onDestroy$.next(true);
    this._onDestroy$.unsubscribe();
  }

  getUserInfo(): void {
    this.userService
      .getUser()
      .pipe(takeUntil(this._onDestroy$))
      .subscribe((response) => (this.userInfo = response.body));
  }

  addRequest(equipmentId: number): void {
    this.router.navigate(['/request-form/add/', equipmentId]);
  }

  clearFilter(): void {
    this.filterRequest = {};
    this.dataRequest.filter = this.filterRequest;
    this.rePaginate(true);
  }

  initData(): void {
    this.requestDataService
      .getRequestData(this.dataRequest)
      .pipe(
        tap((response) => {
          response.request.forEach((element) => {
            if (element.pmiData[0].pmiAggregate) {
              element['overall'] = Math.round(
                (element.pmiData[0].pmiAggregate.aggregate.sum.actualValue /
                  element.pmiData[0].pmiAggregate.aggregate.sum.idealValue) *
                  100
              );
            } else {
              element['overall'] = 0;
            }
          });
        }),
        takeUntil(this._onDestroy$)
      )
      .subscribe((response) => {
        this.requestData = response.request;
      });

    this.requestDataService
      .getRequestData({ filter: this.filterRequest })
      .pipe(takeUntil(this._onDestroy$))
      .subscribe((response) => {
        this.paginator.totalData = response.request.length;
        this.paginator.totalPage = Math.floor(
          (response.request.length + this.paginator.pageSize - 1) /
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
    this.orderRequest = {
      m_aircraft_type: {
        ac_type: this.orderByAsc ? 'asc' : 'desc',
      },
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

  filterStatus(event: any): void {
    this.onStatus = event.target.value;

    if (this.onStatus != 9) {
      this.filterRequest['is_available'] = { _eq: this.onStatus };
    } else {
      delete this.filterRequest['is_available'];
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

    this.initData();
  }
}
