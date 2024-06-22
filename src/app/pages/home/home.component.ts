import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil, tap } from 'rxjs';
import { RouteHelperService } from 'src/app/core/services/route-helper.service';
import { PaginatorRequest } from 'src/app/core/requests/paginator.request';
import { ToastrService } from 'ngx-toastr';
import { UserDataService } from 'src/app/core/services/user-data.service';
import { Router } from '@angular/router';
import { UserDataDTO } from 'src/app/core/dto/user-data.dto';
import { HomeDataService } from 'src/app/core/services/home-data.service';
import { HomeDataDTO } from 'src/app/core/dto/home-data.dto';
import { HomeFilterRequest } from './request/home-filter.request';
import { HomeDataRequest } from './request/home-data.request';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
  homeData: HomeDataDTO[];
  dataRequest: HomeDataRequest;
  userInfo: UserDataDTO = <UserDataDTO>{};
  paginator: PaginatorRequest;
  _onDestroy$: Subject<Boolean> = new Subject<Boolean>();

  filterRequest: object = {};
  orderRequest: object = {};
  orderField: string = 'id_request';
  orderByAsc: boolean = true;

  constructor(
    private readonly toastr: ToastrService,
    private readonly router: Router,
    private readonly userService: UserDataService,
    private readonly homeDataService: HomeDataService,
    private route: RouteHelperService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.getUserInfo();

    this.initPaginator();
    this.initOrder();
    this.initParams();

    this.initData();
  }

  getUserInfo(): void {
    this.userService
      .getUser()
      .pipe(takeUntil(this._onDestroy$))
      .subscribe((response) => (this.userInfo = response.body));
  }

  ngOnDestroy(): void {
    this._onDestroy$.next(true);
    this._onDestroy$.unsubscribe();
  }

  detailHome(requestId: number): void {
    this.router.navigate(['/home/details', requestId]);
  }

  editRequest(requestId: number): void {
    this.router.navigate(['/request-form/edit', requestId]);
  }

  initData(): void {
    this.homeDataService
      .getHomeData(this.dataRequest)
      .pipe(
        tap((response) => {
          for (let home of response.homeData) {
            let startDate = new Date(home.date);
            let endDate = new Date(home.requestDate[0].until);

            home.days = Math.floor(
              (endDate.getTime() - startDate.getTime()) / (24 * 3600 * 1000)
            );
          }
        }),
        takeUntil(this._onDestroy$)
      )
      .subscribe((response) => {
        this.homeData = response.homeData;
      });

    this.homeDataService
      .getHomeData()
      .pipe(takeUntil(this._onDestroy$))
      .subscribe((response) => {
        this.paginator.totalData = response.homeData.length;
        this.paginator.totalPage = Math.floor(
          (response.homeData.length + this.paginator.pageSize - 1) /
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

  filterDate(field: string, event: any): void {
    let startDate = event.target.value;

    if (startDate) {
      let defDate = new Date(startDate);
      let endDate = new Date(defDate.setDate(defDate.getDate() + 1))
        .toISOString()
        .split('T')[0];

      this.filterRequest[field] = {
        _gte: startDate,
        _lte: endDate,
      };
    } else {
      delete this.filterRequest[field];
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
        if (field == 'id_request') {
          this.filterRequest[field] = {
            _eq: terms,
          };
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
        delete this.filterRequest[field];
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

  initOrder() {
    this.orderRequest = {
      id_request: this.orderByAsc ? 'asc' : 'desc',
    };
  }
}
