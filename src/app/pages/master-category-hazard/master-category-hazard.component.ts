import { Subject, takeUntil, tap } from 'rxjs';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MasterCategoryDTO } from 'src/app/core/dto/master-category.dto';
import { MasterCategoryDataService } from 'src/app/core/services/master-category-data.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UserDataService } from 'src/app/core/services/user-data.service';
import { UserDataDTO } from 'src/app/core/dto/user-data.dto';
import { PaginatorRequest } from 'src/app/core/requests/paginator.request';
import { CategoryFilterRequest } from './request/category-filter.request';
import { CategoryDataRequest } from './request/category-data.request';
import { AddMasterCategoryHazardDTO } from '../master-category-hazard/dto/add-master-category-hazard.dto';
import { Confirmable } from 'src/app/core/decorators/confirmable.decorator';

interface CategoryFilterCollection {
  categoryName?: string;
  updatedBy?: string;
}

@Component({
  selector: 'app-master-category-hazard',
  templateUrl: './master-category-hazard.component.html',
  styleUrls: ['./master-category-hazard.component.css'],
})
export class MasterCategoryHazardComponent implements OnInit, OnDestroy {
  @ViewChild('closeModal') closeModal;

  categoryForm;
  categoryData: MasterCategoryDTO[];
  _onDestroy$: Subject<Boolean> = new Subject<Boolean>();
  modalTitle: string = 'Add New Category';
  modalAction: string = 'Save';
  formAction: boolean = true;
  paginator: PaginatorRequest;
  filterCollection: CategoryFilterCollection = {};
  filterRequest: CategoryFilterRequest;
  userInfo: UserDataDTO = <UserDataDTO>{};
  dataRequest: CategoryDataRequest;

  orderRequest: object = {};
  orderField: string = 'category';
  orderByAsc: boolean = true;

  constructor(
    private readonly userService: UserDataService,
    private readonly masterCategoryDataService: MasterCategoryDataService,
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

  get category() {
    return this.categoryForm.get('category');
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
    this.categoryForm = this.formBuilder.group({
      categoryId: ['', Validators.nullValidator],
      category: ['', [Validators.required]],
    });
  }

  getEdit(data: any): void {
    this.setModal(false);

    this.categoryForm.setValue({
      categoryId: data.categoryId,
      category: data.categoryName,
    });
  }

  onSubmit() {
    if (this.formAction) this.storeData(this.categoryForm.value);
    else this.updateData(this.categoryForm.value);
  }

  storeData(input: AddMasterCategoryHazardDTO): void {
    const requestBody = {
      category: input.category,
      created_by: this.userInfo.personalName,
      updated_by: this.userInfo.personalName,
    };

    this.masterCategoryDataService.storeData(requestBody).subscribe(
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
      categoryId: input.categoryId,
      object: {
        category: input.category,
        updated_by: this.userInfo.personalName,
        updated_at: new Date(),
      },
    };

    this.masterCategoryDataService.updateData(requestBody).subscribe(
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
      categoryId: input.categoryId,
    };

    this.masterCategoryDataService.destroyData(requestBody).subscribe(
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
    this.filterCollection.categoryName = undefined;
    this.filterCollection.updatedBy = undefined;

    this.initFilters();
    this.dataRequest.filter = this.filterRequest;
    this.rePaginate(true);
  }

  initData(): void {
    this.masterCategoryDataService
      .getCategoryData(this.dataRequest)
      .pipe(takeUntil(this._onDestroy$))
      .subscribe((response) => {
        this.categoryData = response.category;
      });

    this.masterCategoryDataService
      .getCategoryData()
      .pipe(takeUntil(this._onDestroy$))
      .subscribe((response) => {
        this.paginator.totalData = response.category.length;
        this.paginator.totalPage = Math.floor(
          (response.category.length + this.paginator.pageSize - 1) /
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
      category: {
        _ilike: this.filterCollection.categoryName,
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
    this.categoryForm.reset();
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
