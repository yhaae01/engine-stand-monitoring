import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subject, takeUntil, tap } from 'rxjs';
import { MasterJobDescDTO } from 'src/app/core/dto/master-job-desc.dto';
import { MasterJobDescDataService } from 'src/app/core/services/master-job-desc-data.service';
import { JobDescDataRequest } from './request/job-desc-data.request';
import { PaginatorRequest } from 'src/app/core/requests/paginator.request';
import { UserDataDTO } from 'src/app/core/dto/user-data.dto';
import { JobDescFilterRequest } from './request/job-desc-filter.request';
import { UserDataService } from 'src/app/core/services/user-data.service';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Confirmable } from 'src/app/core/decorators/confirmable.decorator';
import { AddMasterJobDescDTO } from './dto/add-master-job-desc.dto';

interface JobDescFilterCollection {
  jobDescName?: string;
  updatedBy?: string;
}
@Component({
  selector: 'app-master-job-desc',
  templateUrl: './master-job-desc.component.html',
  styleUrls: ['./master-job-desc.component.css'],
})
export class MasterJobDescComponent implements OnInit, OnDestroy {
  @ViewChild('closeModal') closeModal;

  jobDescForm;
  jobdescData: MasterJobDescDTO[];
  _onDestroy$: Subject<Boolean> = new Subject<Boolean>();
  dataRequest: JobDescDataRequest;
  paginator: PaginatorRequest;
  modalTitle: string = 'Add New Job Desc';
  modalAction: string = 'Save';
  formAction: boolean = true;
  filterCollection: JobDescFilterCollection = {};
  filterRequest: JobDescFilterRequest;
  userInfo: UserDataDTO = <UserDataDTO>{};

  orderRequest: object = {};
  orderField: string = 'job_desc';
  orderByAsc: boolean = true;

  constructor(
    private readonly masterJobDescDataService: MasterJobDescDataService,
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

  ngOnDestroy(): void {
    this._onDestroy$.next(true);
    this._onDestroy$.unsubscribe();
  }

  get job_desc() {
    return this.jobDescForm.get('job_desc');
  }

  initData(): void {
    this.masterJobDescDataService
      .getJobDescData(this.dataRequest)
      .pipe(takeUntil(this._onDestroy$))
      .subscribe((response) => {
        this.jobdescData = response.jobDesc;
      });

    this.masterJobDescDataService
      .getJobDescData()
      .pipe(takeUntil(this._onDestroy$))
      .subscribe((response) => {
        this.paginator.totalData = response.jobDesc.length;
        this.paginator.totalPage = Math.floor(
          (response.jobDesc.length + this.paginator.pageSize - 1) /
            this.paginator.pageSize
        );
      });
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
    this.jobDescForm = this.formBuilder.group({
      jobDescId: ['', Validators.nullValidator],
      job_desc: ['', [Validators.required]],
    });
  }

  getEdit(data: any): void {
    this.setModal(false);

    this.jobDescForm.setValue({
      jobDescId: data.jobDescId,
      job_desc: data.jobDescName,
    });
  }

  onSubmit() {
    if (this.formAction) this.storeData(this.jobDescForm.value);
    else this.updateData(this.jobDescForm.value);
  }

  storeData(input: AddMasterJobDescDTO): void {
    const requestBody = {
      job_desc: input.job_desc,
      created_by: this.userInfo.personalName,
      updated_by: this.userInfo.personalName,
    };

    this.masterJobDescDataService.storeData(requestBody).subscribe(
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
      jobDescId: input.jobDescId,
      object: {
        job_desc: input.job_desc,
        updated_by: this.userInfo.personalName,
        updated_at: new Date(),
      },
    };

    this.masterJobDescDataService.updateData(requestBody).subscribe(
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
      jobDescId: input.jobDescId,
    };

    this.masterJobDescDataService.destroyData(requestBody).subscribe(
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
    this.filterCollection.jobDescName = undefined;
    this.filterCollection.updatedBy = undefined;

    this.initFilters();
    this.dataRequest.filter = this.filterRequest;
    this.rePaginate(true);
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
      job_desc: {
        _ilike: this.filterCollection.jobDescName,
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
    this.jobDescForm.reset();
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
