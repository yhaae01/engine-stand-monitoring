import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subject, takeUntil, tap } from 'rxjs';
import { MasterRectificationDTO } from 'src/app/core/dto/master-rectification.dto';
import { MasterRectificationDataService } from 'src/app/core/services/master-rectification-data.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UserDataService } from 'src/app/core/services/user-data.service';
import { UserDataDTO } from 'src/app/core/dto/user-data.dto';
import { PaginatorRequest } from 'src/app/core/requests/paginator.request';
import { RectificationFilterRequest } from './request/rectification-filter.request';
import { RectificationDataRequest } from './request/rectification-data.request';
import { AddMasterRectificationDTO } from './dto/add-master-rectification.dto';
import { Confirmable } from 'src/app/core/decorators/confirmable.decorator';

interface RectificationFilterCollection {
  rectificationName?: string;
  updatedBy?: string;
}

@Component({
  selector: 'app-master-rectification',
  templateUrl: './master-rectification.component.html',
  styleUrls: ['./master-rectification.component.css'],
})
export class MasterRectificationComponent implements OnInit, OnDestroy {
  @ViewChild('closeModal') closeModal;

  rectificationForm;
  rectificationData: MasterRectificationDTO[];
  _onDestroy$: Subject<Boolean> = new Subject<Boolean>();
  modalTitle: string = 'Add New Rectification';
  modalAction: string = 'Save';
  formAction: boolean = true;
  paginator: PaginatorRequest;
  filterCollection: RectificationFilterCollection = {};
  filterRequest: RectificationFilterRequest;
  userInfo: UserDataDTO = <UserDataDTO>{};
  dataRequest: RectificationDataRequest;

  orderRequest: object = {};
  orderField: string = 'rectification';
  orderByAsc: boolean = true;

  constructor(
    private readonly masterRectificationDataService: MasterRectificationDataService,
    private readonly userService: UserDataService,
    private formBuilder: FormBuilder,
    private readonly toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getUserInfo();

    this.initPaginator();
    this.initFilters();
    this.initParams();

    this.initData();

    this.initOrder();

    this.createForm();
  }

  getUserInfo(): void {
    this.userService
      .getUser()
      .pipe(takeUntil(this._onDestroy$))
      .subscribe((response) => (this.userInfo = response.body));
  }

  get rectification() {
    return this.rectificationForm.get('rectification');
  }

  initOrder(): void {
    this.orderRequest[this.orderField] = this.orderByAsc ? 'asc' : 'desc';
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
    this.rePaginate();
  }

  setModal(toStore: boolean): void {
    this.formAction = toStore;
    this.modalTitle = toStore ? 'Add New Rectification' : 'Edit Rectification';
    this.modalAction = toStore ? 'Save' : 'Update';
  }

  createForm(): void {
    this.rectificationForm = this.formBuilder.group({
      rectificationId: ['', Validators.nullValidator],
      rectification: ['', [Validators.required]],
    });
  }

  getEdit(data: any): void {
    this.setModal(false);

    this.rectificationForm.patchValue({
      rectificationId: data.rectificationId,
      rectification: data.rectificationName,
    });
  }

  onSubmit() {
    if (this.formAction) this.storeData(this.rectificationForm.value);
    else this.updateData(this.rectificationForm.value);
  }

  storeData(input: AddMasterRectificationDTO): void {
    const requestBody = {
      rectification: input.rectification,
      created_by: this.userInfo.personalName,
      updated_by: this.userInfo.personalName,
    };

    this.masterRectificationDataService.storeData(requestBody).subscribe(
      (success) => {
        this.toastr.success('Data stored successfully', 'Success!');
        this.initData();
      },
      (error) =>
        this.toastr.error('Something went wrong, nothing changed', 'Oopps!')
    );

    this.clearFilter();
    this.closeModal.nativeElement.click();
  }

  updateData(input: any): void {
    const requestBody = {
      rectificationId: input.rectificationId,
      object: {
        rectification: input.rectification,
        updated_by: this.userInfo.personalName,
        updated_at: new Date(),
      },
    };

    this.masterRectificationDataService.updateData(requestBody).subscribe(
      (success) => {
        this.toastr.success('Data updated successfully', 'Success!');
        this.initData();
      },
      (error) =>
        this.toastr.error('Something went wrong, nothing changed', 'Oopps!')
    );

    this.clearFilter();
    this.closeModal.nativeElement.click();
  }

  @Confirmable({
    title: 'Confirmation',
    html: 'Are you sure you want to delete this data?',
    icon: 'question',
  })
  deleteData(input: any): void {
    const requestBody = {
      rectificationId: input.rectificationId,
    };

    this.masterRectificationDataService.destroyData(requestBody).subscribe(
      (success) => {
        this.toastr.success('Data deleted successfully', 'Success!');
        this.initData();
      },
      (error) =>
        this.toastr.error('Something went wrong, nothing changed', 'Oopps!')
    );
  }

  clearFilter(): void {
    this.filterCollection.rectificationName = undefined;
    this.filterCollection.updatedBy = undefined;

    this.initFilters();
    this.dataRequest.filter = this.filterRequest;
    this.rePaginate(true);
  }

  initData(): void {
    this.masterRectificationDataService
      .getRectificationData(this.dataRequest)
      .pipe(takeUntil(this._onDestroy$))
      .subscribe((response) => {
        this.rectificationData = response.rectificationData;
      });

    this.masterRectificationDataService
      .getRectificationData()
      .pipe(takeUntil(this._onDestroy$))
      .subscribe((response) => {
        this.paginator.totalData = response.rectificationData.length;
        this.paginator.totalPage = Math.floor(
          (response.rectificationData.length + this.paginator.pageSize - 1) /
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
      rectification: {
        _ilike: this.filterCollection.rectificationName,
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
    this.rectificationForm.reset();
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

  ngOnDestroy(): void {
    this._onDestroy$.next(true);
    this._onDestroy$.unsubscribe();
  }
}
