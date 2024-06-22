import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subject, takeUntil, tap } from 'rxjs';
import { MasterManufactureDTO } from 'src/app/core/dto/master-manufacture.dto';
import { MasterManufactureDataService } from 'src/app/core/services/master-manufacture-data.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UserDataService } from 'src/app/core/services/user-data.service';
import { UserDataDTO } from 'src/app/core/dto/user-data.dto';
import { PaginatorRequest } from 'src/app/core/requests/paginator.request';
import { ManufactureFilterRequest } from './request/manufacture-filter.request';
import { ManufactureDataRequest } from './request/manufacture-data.request';
import { AddMasterManufactureDTO } from './dto/add-master-manufacture.dto';
import { Confirmable } from 'src/app/core/decorators/confirmable.decorator';

interface ManufactureFilterCollection {
  manufactureName?: string;
  updatedBy?: string;
}
@Component({
  selector: 'app-master-manufacture',
  templateUrl: './master-manufacture.component.html',
  styleUrls: ['./master-manufacture.component.css'],
})
export class MasterManufactureComponent implements OnInit, OnDestroy {
  @ViewChild('closeModal') closeModal;

  manufactureForm;
  manufactureData: MasterManufactureDTO[];
  _onDestroy$: Subject<Boolean> = new Subject<Boolean>();
  modalTitle: string = 'Add New Manufacture';
  modalAction: string = 'Save';
  formAction: boolean = true;
  paginator: PaginatorRequest;
  filterCollection: ManufactureFilterCollection = {};
  filterRequest: ManufactureFilterRequest;
  userInfo: UserDataDTO = <UserDataDTO>{};
  dataRequest: ManufactureDataRequest;

  orderRequest: object = {};
  orderField: string = 'manufacture';
  orderByAsc: boolean = true;

  constructor(
    private readonly masterManufactureDataService: MasterManufactureDataService,
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

  get manufacture() {
    return this.manufactureForm.get('manufacture');
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
    this.modalTitle = toStore ? 'Add New Manufacture' : 'Edit Manufacture';
    this.modalAction = toStore ? 'Save' : 'Update';
  }

  createForm(): void {
    this.manufactureForm = this.formBuilder.group({
      manufactureId: ['', Validators.nullValidator],
      manufacture: ['', [Validators.required]],
    });
  }

  getEdit(data: any): void {
    this.setModal(false);

    this.manufactureForm.patchValue({
      manufactureId: data.manufactureId,
      manufacture: data.manufactureName,
    });
  }

  onSubmit() {
    if (this.formAction) this.storeData(this.manufactureForm.value);
    else this.updateData(this.manufactureForm.value);
  }

  storeData(input: AddMasterManufactureDTO): void {
    const requestBody = {
      manufacture: input.manufacture,
      created_by: this.userInfo.personalName,
      updated_by: this.userInfo.personalName,
    };

    this.masterManufactureDataService.storeData(requestBody).subscribe(
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
      manufactureId: input.manufactureId,
      object: {
        manufacture: input.manufacture,
        updated_by: this.userInfo.personalName,
        updated_at: new Date(),
      },
    };

    this.masterManufactureDataService.updateData(requestBody).subscribe(
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
      manufactureId: input.manufactureId,
    };

    this.masterManufactureDataService.destroyData(requestBody).subscribe(
      (success) => {
        this.toastr.success('Data deleted successfully', 'Success!');
        this.initData();
      },
      (error) =>
        this.toastr.error('Something went wrong, nothing changed', 'Oopps!')
    );
  }

  clearFilter(): void {
    this.filterCollection.manufactureName = undefined;
    this.filterCollection.updatedBy = undefined;

    this.initFilters();
    this.dataRequest.filter = this.filterRequest;
    this.rePaginate(true);
  }

  initData(): void {
    this.masterManufactureDataService
      .getManufactureData(this.dataRequest)
      .pipe(takeUntil(this._onDestroy$))
      .subscribe((response) => {
        this.manufactureData = response.manufacture;
      });

    this.masterManufactureDataService
      .getManufactureData()
      .pipe(takeUntil(this._onDestroy$))
      .subscribe((response) => {
        this.paginator.totalData = response.manufacture.length;
        this.paginator.totalPage = Math.floor(
          (response.manufacture.length + this.paginator.pageSize - 1) /
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
      manufacture: {
        _ilike: this.filterCollection.manufactureName,
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
    this.manufactureForm.reset();
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
