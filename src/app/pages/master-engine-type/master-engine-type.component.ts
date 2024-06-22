import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil, tap } from 'rxjs';
import { MasterTypeDTO } from 'src/app/core/dto/master-type.dto';
import { PaginatorRequest } from 'src/app/core/requests/paginator.request';
import { MasterTypeDataService } from 'src/app/core/services/master-type-data.service';
import { UserDataService } from 'src/app/core/services/user-data.service';
import { TypeFilterRequest } from './request/type-filter.request';
import { UserDataDTO } from 'src/app/core/dto/user-data.dto';
import { TypeDataRequest } from './request/type-data.request';
import { AddMasterEngineDTO } from './dto/add-master-engine-type.dto';
import { Confirmable } from 'src/app/core/decorators/confirmable.decorator';

interface EngineFilterCollection {
  type?: string;
  updatedBy?: string;
}
@Component({
  selector: 'app-master-engine-type',
  templateUrl: './master-engine-type.component.html',
  styleUrls: ['./master-engine-type.component.css'],
})
export class MasterEngineTypeComponent implements OnInit, OnDestroy {
  @ViewChild('closeModal') closeModal;

  engineForm;
  engineData: MasterTypeDTO[];
  _onDestroy$: Subject<Boolean> = new Subject<Boolean>();
  modalTitle: string = 'Add New Engine Type';
  modalAction: string = 'Save';
  formAction: boolean = true;
  paginator: PaginatorRequest;
  filterCollection: EngineFilterCollection = {};
  filterRequest: TypeFilterRequest;
  userInfo: UserDataDTO = <UserDataDTO>{};
  dataRequest: TypeDataRequest;

  orderRequest: object = {};
  orderField: string = 'type';
  orderByAsc: boolean = true;

  constructor(
    private readonly masterTypeDataService: MasterTypeDataService,
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

  ngOnDestroy(): void {
    this._onDestroy$.next(true);
    this._onDestroy$.unsubscribe();
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

  get type() {
    return this.engineForm.get('type');
  }

  getUserInfo(): void {
    this.userService
      .getUser()
      .pipe(takeUntil(this._onDestroy$))
      .subscribe((response) => (this.userInfo = response.body));
  }

  setModal(toStore: boolean): void {
    this.formAction = toStore;
    this.modalTitle = toStore ? 'Add New Engine/APU' : 'Edit Engine/APU';
    this.modalAction = toStore ? 'Save' : 'Update';
  }

  createForm(): void {
    this.engineForm = this.formBuilder.group({
      typeId: ['', Validators.nullValidator],
      type: ['', [Validators.required]],
    });
  }

  getEdit(data: any): void {
    this.setModal(false);

    this.engineForm.patchValue({
      typeId: data.typeId,
      type: data.typeName,
    });
  }

  onSubmit() {
    if (this.formAction) this.storeData(this.engineForm.value);
    else this.updateData(this.engineForm.value);
  }

  storeData(input: AddMasterEngineDTO): void {
    const requestBody = {
      type: input.type,
      created_by: this.userInfo.personalName,
      updated_by: this.userInfo.personalName,
    };

    this.masterTypeDataService.storeData(requestBody).subscribe(
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
      typeId: input.typeId,
      object: {
        type: input.type,
        updated_by: this.userInfo.personalName,
        updated_at: new Date(),
      },
    };

    this.masterTypeDataService.updateData(requestBody).subscribe(
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
      typeId: input.typeId,
    };

    this.masterTypeDataService.destroyData(requestBody).subscribe(
      (success) => {
        this.toastr.success('Data deleted successfully', 'Success!');
        this.initData();
      },
      (error) =>
        this.toastr.error('Something went wrong, nothing changed', 'Oopps!')
    );
  }

  clearFilter(): void {
    this.filterCollection.type = undefined;
    this.filterCollection.updatedBy = undefined;

    this.initFilters();
    this.dataRequest.filter = this.filterRequest;
    this.rePaginate(true);
  }

  initData(): void {
    this.masterTypeDataService
      .getTypeData(this.dataRequest)
      .pipe(takeUntil(this._onDestroy$))
      .subscribe((response) => {
        this.engineData = response.mType;
      });

    this.masterTypeDataService
      .getTypeData()
      .pipe(takeUntil(this._onDestroy$))
      .subscribe((response) => {
        this.paginator.totalData = response.mType.length;
        this.paginator.totalPage = Math.floor(
          (response.mType.length + this.paginator.pageSize - 1) /
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
      type: {
        _ilike: this.filterCollection.type,
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
    this.engineForm.reset();
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
