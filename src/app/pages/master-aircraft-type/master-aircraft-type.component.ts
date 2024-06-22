import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subject, takeUntil, tap } from 'rxjs';
import { MasterAircraftDTO } from 'src/app/core/dto/master-aircraft.dto';
import { MasterAircraftDataService } from 'src/app/core/services/master-aircraft-data.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UserDataService } from 'src/app/core/services/user-data.service';
import { UserDataDTO } from 'src/app/core/dto/user-data.dto';
import { PaginatorRequest } from 'src/app/core/requests/paginator.request';
import { AircraftDataRequest } from './request/aircraft-data.request';
import { AircraftFilterRequest } from './request/aircraft-filter.request';
import { AddMasterAircraftDTO } from './dto/add-master-aircraft-type.dto';
import { Confirmable } from 'src/app/core/decorators/confirmable.decorator';

interface AircraftFilterCollection {
  acType?: string;
  updatedBy?: string;
}
@Component({
  selector: 'app-master-aircraft-type',
  templateUrl: './master-aircraft-type.component.html',
  styleUrls: ['./master-aircraft-type.component.css'],
})
export default class MasterAircraftTypeComponent implements OnInit, OnDestroy {
  @ViewChild('closeModal') closeModal;

  aircraftForm;
  aircraftData: MasterAircraftDTO[];
  _onDestroy$: Subject<Boolean> = new Subject<Boolean>();
  modalTitle: string = 'Add New Aircraft Type';
  modalAction: string = 'Save';
  formAction: boolean = true;
  paginator: PaginatorRequest;
  filterCollection: AircraftFilterCollection = {};
  filterRequest: AircraftFilterRequest;
  userInfo: UserDataDTO = <UserDataDTO>{};
  dataRequest: AircraftDataRequest;

  orderRequest: object = {};
  orderField: string = 'ac_type';
  orderByAsc: boolean = true;

  constructor(
    private readonly userService: UserDataService,
    private readonly masterAircraftTypeService: MasterAircraftDataService,
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

  get ac_type() {
    return this.aircraftForm.get('ac_type');
  }

  getUserInfo(): void {
    this.userService
      .getUser()
      .pipe(takeUntil(this._onDestroy$))
      .subscribe((response) => (this.userInfo = response.body));
  }

  setModal(toStore: boolean): void {
    this.formAction = toStore;
    this.modalTitle = toStore ? 'Add New Aircraft Type' : 'Edit Aircraft Type';
    this.modalAction = toStore ? 'Save' : 'Update';
  }

  createForm(): void {
    this.aircraftForm = this.formBuilder.group({
      aircraftTypeId: ['', Validators.nullValidator],
      ac_type: ['', [Validators.required]],
    });
  }

  getEdit(data: any): void {
    this.setModal(false);

    this.aircraftForm.setValue({
      aircraftTypeId: data.aircraftTypeId,
      ac_type: data.acType,
    });
  }

  onSubmit() {
    if (this.formAction) this.storeData(this.aircraftForm.value);
    else this.updateData(this.aircraftForm.value);
  }

  storeData(input: AddMasterAircraftDTO): void {
    const requestBody = {
      ac_type: input.ac_type,
      created_by: this.userInfo.personalName,
      updated_by: this.userInfo.personalName,
    };

    this.masterAircraftTypeService.storeData(requestBody).subscribe(
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
      aircraftTypeId: input.aircraftTypeId,
      object: {
        ac_type: input.ac_type,
        updated_by: this.userInfo.personalName,
        updated_at: new Date(),
      },
    };

    this.masterAircraftTypeService.updateData(requestBody).subscribe(
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

  @Confirmable({
    title: 'Confirmation',
    html: 'Are you sure you want to delete this data?',
    icon: 'question',
  })
  deleteData(input: any): void {
    const requestBody = {
      aircraftTypeId: input.aircraftTypeId,
    };

    this.masterAircraftTypeService.destroyData(requestBody).subscribe(
      (success) => {
        this.toastr.success('Data deleted successfully', 'Success!');
        this.initData();
      },
      (error) =>
        this.toastr.error('Something went wrong, nothing changed', 'Oopps!')
    );
  }

  clearFilter(): void {
    this.filterCollection.acType = undefined;
    this.filterCollection.updatedBy = undefined;

    this.initFilters();
    this.dataRequest.filter = this.filterRequest;
    this.rePaginate(true);
  }

  initData(): void {
    this.masterAircraftTypeService
      .getAircraftData(this.dataRequest)
      .pipe(takeUntil(this._onDestroy$))
      .subscribe((response) => {
        this.aircraftData = response.aircraftType;
      });

    this.masterAircraftTypeService
      .getAircraftData()
      .pipe(takeUntil(this._onDestroy$))
      .subscribe((response) => {
        this.paginator.totalData = response.aircraftType.length;
        this.paginator.totalPage = Math.floor(
          (response.aircraftType.length + this.paginator.pageSize - 1) /
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
      ac_type: {
        _ilike: this.filterCollection.acType,
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
    this.aircraftForm.reset();
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
