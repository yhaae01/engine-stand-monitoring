import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subject, map, takeUntil, tap } from 'rxjs';
import { PmiSheetDTO } from 'src/app/core/dto/pmi-sheet.dto';
import { PaginatorRequest } from 'src/app/core/requests/paginator.request';
import { PmiSheetService } from 'src/app/core/services/pmi-sheet-data.service';
import { UserDataService } from 'src/app/core/services/user-data.service';
import { PmiFilterRequest } from './request/pmi-filter.request';
import { UserDataDTO } from 'src/app/core/dto/user-data.dto';
import { PmiDataRequest } from './request/pmi-data.request';
import { AddPmiSheetDTO } from './dto/add-pmi-sheet.dto';
import { OrderDTO } from 'src/app/core/dto/order-dto';

interface PmiSheetFilterCollection {
  pmiSheet?: string;
  partNumber?: string;
  updatedBy?: string;
}
@Component({
  selector: 'app-pmi-sheet',
  templateUrl: './pmi-sheet.component.html',
  styleUrls: ['./pmi-sheet.component.css'],
})
export class PmiSheetComponent implements OnInit, OnDestroy {
  @ViewChild('closeModal') closeModal;

  pmiSheetForm;
  pmiSheetData: PmiSheetDTO[];
  userInfo: UserDataDTO = <UserDataDTO>{};
  _onDestroy$: Subject<boolean> = new Subject<boolean>();
  modalTitle: string = 'Add New Pmi Sheet';
  modalAction: string = 'Save';
  formAction: boolean = true;
  paginator: PaginatorRequest;
  dataRequest: PmiDataRequest;
  filterCollection: PmiSheetFilterCollection = {};
  filterRequest: PmiFilterRequest;

  pmiSheetOrder: OrderDTO = {
    orderBy: 'asc',
    orderField: 'pmi_sheet',
  };

  partNumberOrder: OrderDTO = {
    orderBy: 'asc',
    orderField: 'part_number',
  };

  orderRequest: object = {};
  orderField: string = 'part_number';
  orderByAsc: boolean = true;

  constructor(
    private readonly pmiSheetService: PmiSheetService,
    private readonly userService: UserDataService,
    private formBuilder: FormBuilder,
    private readonly toastr: ToastrService
  ) {}

  initOrder() {
    this.orderRequest[this.orderField] = this.orderByAsc ? 'asc' : 'desc';
  }

  uniqueArray(target: Array<any>, property: any): Array<any> {
    return target.filter(
      (item, index) =>
        index === target.findIndex((t) => t[property] === item[property])
    );
  }

  orderByField(field: string): void {
    if (field == this.orderField) {
      this.orderRequest[this.orderField] = this.orderByAsc ? 'desc' : 'asc';
      this.orderByAsc = this.orderByAsc ? false : true;
    } else {
      this.orderField = field;
      this.orderByAsc = true;
      this.orderRequest = {};
      this.orderRequest[this.orderField] = 'asc';
    }

    this.dataRequest.order = this.orderRequest;
    this.paginator.pageNumber = 1;
    this.rePaginate();
  }

  toExternalURL(url: string): void {
    if (!url.match(/^http?:\/\//i) || !url.match(/^https?:\/\//i)) {
      url = 'http://' + url;
    }

    window.open(url, '_blank');
  }

  get pmi_sheet() {
    return this.pmiSheetForm.get('pmi_sheet');
  }

  get part_number() {
    return this.pmiSheetForm.get('part_number');
  }

  getUserInfo(): void {
    this.userService
      .getUser()
      .pipe(takeUntil(this._onDestroy$))
      .subscribe((response) => (this.userInfo = response.body));
  }

  ngOnInit(): void {
    this.getUserInfo();

    this.initPaginator();
    this.initFilters();
    this.initOrder();
    this.initParams();

    this.initData();

    this.createForm();
  }

  ngOnDestroy(): void {
    this._onDestroy$.next(true);
    this._onDestroy$.unsubscribe();
  }

  setModal(toStore: boolean): void {
    this.formAction = toStore;
    this.modalTitle = toStore ? 'Add New Pmi Sheet' : 'Edit Pmi Sheet';
    this.modalAction = toStore ? 'Save' : 'Update';
  }

  createForm(): void {
    this.pmiSheetForm = this.formBuilder.group({
      pmiSheetId: ['', Validators.nullValidator],
      part_number: ['', [Validators.required]],
      pmi_sheet: [
        '',
        [
          Validators.nullValidator,
          Validators.pattern(
            '^(https?://)?[a-z0-9]+([\\-\\.]{1}[a-z0-9]+)*\\.[a-z]{2,5}(:[0-9]{1,5})?(\\/.*)?$'
          ),
        ],
      ],
    });
  }

  getEdit(data: any): void {
    this.setModal(false);

    this.pmiSheetForm.patchValue({
      pmiSheetId: data.pmiSheetId,
      pmi_sheet: data.pmiSheet,
      part_number: data.partNumber,
    });
  }

  onSubmit() {
    // if (this.formAction) this.storeData(this.pmiSheetForm.value);
    // else this.updateData(this.pmiSheetForm.value);
    this.updateData(this.pmiSheetForm.value);
  }

  storeData(input: AddPmiSheetDTO): void {
    const requestBody = {
      pmi_sheet: input.pmi_sheet,
      part_number: input.part_number,
      created_by: this.userInfo.personalName,
      updated_by: this.userInfo.personalName,
    };

    this.pmiSheetService.storeData(requestBody).subscribe(
      (success) => {
        this.initData();
        this.toastr.success('Data stored successfully', 'Success!');
      },
      (error) =>
        this.toastr.error('Something went wrong, nothing changed', 'Oopps!')
    );

    this.clearFilter();
    this.closeModal.nativeElement.click();
  }

  updateData(input: any): void {
    const requestBody = {
      // pmiSheetId: input.pmiSheetId,
      // object: {
      //   pmi_sheet: input.pmi_sheet,
      //   part_number: input.part_number,
      //   updated_by: this.userInfo.personalName,
      //   updated_at: new Date(),
      // },

      pmiSheet: [
        {
          where: {
            part_number: { _eq: input.part_number },
          },
          _set: {
            pmi_sheet: input.pmi_sheet,
            updated_by: this.userInfo.personalName,
            updated_at: new Date(),
          },
        },
      ],
    };

    // console.log(requestBody);

    this.pmiSheetService.updateData(requestBody).subscribe(
      (success) => {
        this.initData();
        this.toastr.success('Data updated successfully', 'Success!');
      },
      (error) =>
        this.toastr.error('Something went wrong, nothing changed', 'Oopps!')
    );

    this.clearFilter();
    this.closeModal.nativeElement.click();
  }

  deleteData(input: any): void {
    // localStorage.clear();
    if (confirm('Are you sure you want to delete data?')) {
      const requestBody = {
        pmiSheetId: input.pmiSheetId,
      };

      this.pmiSheetService.destroyData(requestBody).subscribe(
        (success) =>
          this.toastr.success('Data deleted successfully', 'Success!'),
        (error) =>
          this.toastr.error('Something went wrong, nothing changed', 'Oopps!')
      );
    }
  }

  clearFilter(): void {
    this.filterCollection.pmiSheet = undefined;
    this.filterCollection.updatedBy = undefined;

    this.initFilters();
    this.dataRequest.filter = this.filterRequest;
    this.rePaginate(true);
  }

  initData(): void {
    this.pmiSheetService
      .getPmiSheetData(this.dataRequest)
      .pipe(
        map((inventory) => ({
          ...inventory,
          uniquePartNumber: this.uniqueArray(inventory.mPmiSheet, 'partNumber'),
        })),
        takeUntil(this._onDestroy$)
      )
      .subscribe((response) => {
        this.pmiSheetData = response.uniquePartNumber;
      });

    this.pmiSheetService
      .getPmiSheetData()
      .pipe(takeUntil(this._onDestroy$))
      .subscribe((response) => {
        this.paginator.totalData = response.mPmiSheet.length;
        this.paginator.totalPage = Math.floor(
          (response.mPmiSheet.length + this.paginator.pageSize - 1) /
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

  initFilters(): void {
    this.filterRequest = {
      pmi_sheet: {
        _ilike: this.filterCollection.pmiSheet,
      },
      part_number: {
        _ilike: this.filterCollection.partNumber,
      },
      updated_by: {
        _ilike: this.filterCollection.updatedBy,
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

  resetForm(): void {
    this.pmiSheetForm.reset();
  }

  filterByField(field: string, event: any): void {
    let terms = event.target.value;

    this.filterCollection[field] = terms.length > 0 ? `%${terms}%` : undefined;
    this.initFilters();
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
