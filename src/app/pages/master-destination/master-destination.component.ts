import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subject, takeUntil, tap } from 'rxjs';
import { MasterDestinationDTO } from 'src/app/core/dto/master-destination.dto';
import { MasterDestinationDataService } from 'src/app/core/services/master-destination-data.service';
import { DestinationDataRequest } from './request/destination-data.request';
import { PaginatorRequest } from 'src/app/core/requests/paginator.request';
import { UserDataDTO } from 'src/app/core/dto/user-data.dto';
import { UserDataService } from 'src/app/core/services/user-data.service';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AddMasterDestinationDTO } from './dto/add-master-destination.dto';
import { Confirmable } from 'src/app/core/decorators/confirmable.decorator';
import { DestinationFilterRequest } from './request/destination-filter.request';

interface DestinationFilterCollection {
  destinationName?: string;
  updatedBy?: string;
}

@Component({
  selector: 'app-master-destination',
  templateUrl: './master-destination.component.html',
  styleUrls: ['./master-destination.component.css'],
})
export class MasterDestinationComponent implements OnInit, OnDestroy {
  @ViewChild('closeModal') closeModal;
  destinationForm;

  destinationData: MasterDestinationDTO[];
  _onDestroy$: Subject<Boolean> = new Subject<Boolean>();
  dataRequest: DestinationDataRequest;
  paginator: PaginatorRequest;
  modalTitle: string = 'Add New Destination';
  modalAction: string = 'Save';
  formAction: boolean = true;
  filterCollection: DestinationFilterCollection = {};
  userInfo: UserDataDTO = <UserDataDTO>{};
  filterRequest: DestinationFilterRequest;

  orderRequest: object = {};
  orderField: string = 'destination';
  orderByAsc: boolean = true;

  constructor(
    private readonly userService: UserDataService,
    private formBuilder: FormBuilder,
    private readonly toastr: ToastrService,
    private readonly masterDestinationDataService: MasterDestinationDataService
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

  ngOnDestroy(): void {
    this._onDestroy$.next(true);
    this._onDestroy$.unsubscribe();
  }

  get destination() {
    return this.destinationForm.get('destination');
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
    this.modalTitle = toStore ? 'Add New Aircraft Type' : 'Edit Aircraft Type';
    this.modalAction = toStore ? 'Save' : 'Update';
  }

  createForm(): void {
    this.destinationForm = this.formBuilder.group({
      destinationId: ['', Validators.nullValidator],
      destination: ['', [Validators.required]],
    });
  }

  getEdit(data: any): void {
    this.setModal(false);

    this.destinationForm.setValue({
      destinationId: data.destinationId,
      destination: data.destinationName,
    });
  }

  onSubmit() {
    if (this.formAction) this.storeData(this.destinationForm.value);
    else this.updateData(this.destinationForm.value);
  }

  storeData(input: AddMasterDestinationDTO): void {
    const requestBody = {
      destination: input.destination,
      created_by: this.userInfo.personalName,
      updated_by: this.userInfo.personalName,
    };

    this.masterDestinationDataService.storeData(requestBody).subscribe(
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
      destinationId: input.destinationId,
      object: {
        destination: input.destination,
        updated_by: this.userInfo.personalName,
        updated_at: new Date(),
      },
    };

    this.masterDestinationDataService.updateData(requestBody).subscribe(
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
      destinationId: input.destinationId,
    };

    this.masterDestinationDataService.destroyData(requestBody).subscribe(
      (success) => {
        this.toastr.success('Data deleted successfully', 'Success!');
        this.initData();
      },
      (error) =>
        this.toastr.error('Something went wrong, nothing changed', 'Oopps!')
    );
    this.clearFilter();
  }

  clearFilter(): void {
    this.filterCollection.destinationName = undefined;
    this.filterCollection.updatedBy = undefined;

    this.initFilters();
    this.dataRequest.filter = this.filterRequest;
    this.rePaginate(true);
  }

  initData(): void {
    this.masterDestinationDataService
      .getDestinationData(this.dataRequest)
      .pipe(takeUntil(this._onDestroy$))
      .subscribe((response) => {
        this.destinationData = response.destination;
      });

    this.masterDestinationDataService
      .getDestinationData()
      .pipe(takeUntil(this._onDestroy$))
      .subscribe((response) => {
        this.paginator.totalData = response.destination.length;
        this.paginator.totalPage = Math.floor(
          (response.destination.length + this.paginator.pageSize - 1) /
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
      destination: {
        _ilike: this.filterCollection.destinationName,
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
    this.destinationForm.reset();
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
