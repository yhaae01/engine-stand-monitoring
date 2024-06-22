import { HttpClient } from '@angular/common/http';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subject, takeUntil, tap } from 'rxjs';
import { ReportHazardDTO } from 'src/app/core/dto/report-hazard.dto';
import { PaginatorRequest } from 'src/app/core/requests/paginator.request';
import { ReportHazardDataService } from 'src/app/core/services/report-hazard-data.service';
import { RouteHelperService } from 'src/app/core/services/route-helper.service';
import { UserDataDTO } from 'src/app/core/dto/user-data.dto';
import { UserDataService } from 'src/app/core/services/user-data.service';
import { Router } from '@angular/router';
import { ParamsRequest } from 'src/app/core/requests/params.request';

@Component({
  selector: 'app-report-hazard',
  templateUrl: './report-hazard.component.html',
  styleUrls: ['./report-hazard.component.css'],
})
export class ReportHazardComponent implements OnInit, OnDestroy {
  paginator: PaginatorRequest;
  reportHazardData: ReportHazardDTO[];
  dataRequest: ParamsRequest;
  filterRequest: object = {};
  _onDestroy$: Subject<boolean> = new Subject<boolean>();
  userInfo: UserDataDTO = <UserDataDTO>{};

  orderRequest: object = {};
  orderField: string = 'description';
  orderByAsc: boolean = true;

  equipmentFilter: object = {};
  onStatus: number = 0;

  constructor(
    private route: RouteHelperService,
    private readonly router: Router,
    private http: HttpClient,
    private readonly reportHazardService: ReportHazardDataService,
    private readonly userService: UserDataService
  ) {}

  getUserInfo(): void {
    this.userService
      .getUser()
      .pipe(takeUntil(this._onDestroy$))
      .subscribe((response) => (this.userInfo = response.body));
  }

  detailHazard(hazardId: number): void {
    this.router.navigate(['/report-hazard/detail-report-hazard/', hazardId]);
  }

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

  initData(): void {
    this.reportHazardService
      .getReportHazardData(this.dataRequest)
      .pipe(takeUntil(this._onDestroy$))
      .subscribe((response) => {
        this.reportHazardData = response.reportHazardData;
      });

    this.reportHazardService
      .getReportHazardData({ filter: this.filterRequest })
      .pipe(takeUntil(this._onDestroy$))
      .subscribe((response) => {
        this.paginator.totalData = response.reportHazardData.length;
        this.paginator.totalPage = Math.floor(
          (response.reportHazardData.length + this.paginator.pageSize - 1) /
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

  initOrder(): void {
    this.orderRequest['equipment_datum'] = {
      [this.orderField]: this.orderByAsc ? 'asc' : 'desc',
    };
  }

  initParams(): void {
    this.dataRequest = {
      filter: (this.filterRequest = this.equipmentFilter),
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
      if (field == 'status') {
        if (this.orderByAsc) {
          this.orderRequest['is_closed'] = this.orderByAsc ? 'desc' : 'asc';
          this.orderRequest['m_rectification'] = {
            rectification: 'asc',
          };
        } else {
          this.orderRequest['is_closed'] = this.orderByAsc ? 'desc' : 'asc';
        }
      } else {
        if (fields) {
          this.orderRequest['equipment_datum'] = {};
          this.orderRequest['equipment_datum'][field] = {};
          this.orderRequest['equipment_datum'][field][fields[1]] = this
            .orderByAsc
            ? 'desc'
            : 'asc';
        } else {
          this.orderRequest['equipment_datum'][this.orderField] = this
            .orderByAsc
            ? 'desc'
            : 'asc';
        }
      }

      this.orderByAsc = this.orderByAsc ? false : true;
    } else {
      this.orderField = field;
      this.orderByAsc = true;
      this.orderRequest = {};

      if (field == 'status') {
        this.orderRequest['is_closed'] = 'asc';
        this.orderRequest['m_rectification'] = {
          rectification: 'asc',
        };
      } else {
        if (fields) {
          this.orderRequest['equipment_datum'] = {};
          this.orderRequest['equipment_datum'][this.orderField] = {};
          this.orderRequest['equipment_datum'][this.orderField][fields[1]] =
            'asc';
        } else {
          this.orderRequest['equipment_datum'] = {};
          this.orderRequest['equipment_datum'][this.orderField] = 'asc';
        }
      }
    }

    this.dataRequest.order = this.orderRequest;
    this.rePaginate(true);
  }

  filterDate(event: any): void {
    let startDate = event.target.value;

    if (startDate) {
      this.equipmentFilter['manufacture_date'] = {
        _gte: startDate,
        _lte: startDate,
      };
    } else {
      delete this.equipmentFilter['manufacture_date'];
    }

    this.filterRequest = { equipment_datum: this.equipmentFilter };
    this.dataRequest.filter = this.filterRequest;
    this.rePaginate(true);
  }

  filterStatus(event: any): void {
    this.onStatus = event.target.value;

    if (this.onStatus == 1) {
      this.filterRequest['is_closed'] = { _eq: 1 };
    } else if (this.onStatus == 2) {
      this.filterRequest['is_closed'] = { _eq: 0 };
      this.filterRequest['rectification_id'] = { _is_null: true };
    } else if (this.onStatus == 3) {
      this.filterRequest['is_closed'] = { _eq: 0 };
      this.filterRequest['rectification_id'] = { _is_null: false };
    } else {
      delete this.filterRequest['is_closed'];
      delete this.filterRequest['rectification_id'];
    }

    this.dataRequest.filter = this.filterRequest;
    this.rePaginate(true);
  }

  filterByField(field: string, event: any): void {
    let terms = event.target.value;

    if (terms.length >= 1) {
      if (field.includes('.')) {
        let fields = field.split('.');

        this.equipmentFilter[fields[0]] = {};
        this.equipmentFilter[fields[0]][fields[1]] = {
          _ilike: `%${terms}%`,
        };
      } else {
        this.equipmentFilter[field] = {
          _ilike: `%${terms}%`,
        };
      }
    } else {
      if (field.includes('.')) {
        delete this.equipmentFilter[field.split('.')[0]];
      } else {
        delete this.equipmentFilter[field];
      }
    }

    this.filterRequest = { equipment_datum: this.equipmentFilter };
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
