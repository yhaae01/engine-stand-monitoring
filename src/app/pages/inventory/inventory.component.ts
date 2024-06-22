import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subject, takeUntil, tap } from 'rxjs';
import { InventoryDTO } from 'src/app/core/dto/inventory.dto';
import { InventoryDataService } from 'src/app/core/services/inventory-data.service';
import { UserDataService } from 'src/app/core/services/user-data.service';
import { UserDataDTO } from 'src/app/core/dto/user-data.dto';
import { PaginatorRequest } from 'src/app/core/requests/paginator.request';
import { InventoryFilterRequest } from './request/inventory-filter.request';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { InventoryDataRequest } from './request/inventory-data.request';
import { Confirmable } from 'src/app/core/decorators/confirmable.decorator';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css'],
})
export class InventoryComponent implements OnInit, OnDestroy {
  inventoryForm;
  inventoryData: InventoryDTO[];
  _onDestroy$: Subject<Boolean> = new Subject<Boolean>();
  modalTitle: string = 'Add New Inventory';
  modalAction: string = 'Save';
  formAction: boolean = true;
  paginator: PaginatorRequest;
  filterRequest: object = {};
  userInfo: UserDataDTO = <UserDataDTO>{};
  dataRequest: InventoryDataRequest;

  orderRequest: object = {};
  orderField: string = 'description';
  orderByAsc: boolean = true;

  constructor(
    private readonly router: Router,
    private readonly inventoryDataService: InventoryDataService,
    private readonly toastr: ToastrService,
    private readonly userService: UserDataService
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

  detailInventory(equipmentId: number): void {
    this.router.navigate(['/inventory/detail', equipmentId]);
  }

  editInventory(equipmentId: number): void {
    this.router.navigate(['/inventory/edit', equipmentId]);
  }

  @Confirmable({
    title: 'Confirmation',
    html: 'Are you sure you want to delete this data?',
    icon: 'question',
  })
  deleteInventory(input: any): void {
    const requestBody = {
      equipmentId: input.equipmentId,
    };

    this.inventoryDataService.destroyData(requestBody).subscribe(
      (success) => {
        this.toastr.success('Data deleted successfully', 'Success!');
        this.initData();
      },
      (error) =>
        this.toastr.error('Something went wrong, nothing changed', 'Oopps!')
    );
  }

  clearFilter(): void {
    this.filterRequest = {};
    this.dataRequest.filter = this.filterRequest;
    this.rePaginate(true);
  }

  initData(): void {
    this.inventoryDataService
      .getInventoryData(this.dataRequest)
      .pipe(
        tap((response) => {
          response.inventory.forEach((element) => {
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
        this.inventoryData = response.inventory;
      });

    this.inventoryDataService
      .getInventoryData({ filter: this.filterRequest })
      .pipe(takeUntil(this._onDestroy$))
      .subscribe((response) => {
        this.paginator.totalData = response.inventory.length;
        this.paginator.totalPage = Math.floor(
          (response.inventory.length + this.paginator.pageSize - 1) /
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

  resetForm(): void {
    this.inventoryForm.reset();
  }

  filterDate(field: string, event: any): void {
    let startDate = event.target.value;

    if (startDate) {
      this.filterRequest[field] = {
        _gte: startDate,
        _lte: startDate,
      };
    } else {
      delete this.filterRequest[field];
    }

    this.dataRequest.filter = this.filterRequest;
    this.rePaginate(true);
  }

  filterIncoming(event: any): void {
    if (event.target.checked) {
      this.filterRequest['activity_status'] = { _eq: 1 };
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

    this.initData();
  }

  ngOnDestroy(): void {
    this._onDestroy$.next(true);
    this._onDestroy$.unsubscribe();
  }
}
