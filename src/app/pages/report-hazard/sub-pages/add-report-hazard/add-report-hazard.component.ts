import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouteHelperService } from 'src/app/core/services/route-helper.service';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { UserDataService } from 'src/app/core/services/user-data.service';
import { UserDataDTO } from 'src/app/core/dto/user-data.dto';
import { ToastrService } from 'ngx-toastr';
import { InventoryDataService } from 'src/app/core/services/inventory-data.service';
import { Router } from '@angular/router';
import { MasterCategoryDTO } from 'src/app/core/dto/master-category.dto';
import { CategoryDataRequest } from 'src/app/pages/master-category-hazard/request/category-data.request';
import { MasterCategoryDataService } from 'src/app/core/services/master-category-data.service';
import { ReportHazardDataService } from 'src/app/core/services/report-hazard-data.service';
import { AddReportHazardDTO } from './dto/add-report-hazard.dto';
import { InventoryDataRequest } from 'src/app/pages/inventory/request/inventory-data.request';
import { InventoryDTO } from 'src/app/core/dto/inventory.dto';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-add-report-hazard',
  templateUrl: './add-report-hazard.component.html',
  styleUrls: ['./add-report-hazard.component.css'],
})
export class AddReportHazardComponent implements OnInit, OnDestroy {
  selectedFile: File;
  AddHazardForm;
  userInfo: UserDataDTO = <UserDataDTO>{};
  categoryData: MasterCategoryDTO[];
  inventoryData: InventoryDTO[];
  detailInventory: InventoryDTO;
  categoryDataRequest: CategoryDataRequest;
  inventoryDataRequest: InventoryDataRequest;

  _onDestroy$: Subject<Boolean> = new Subject<Boolean>();
  formAction: boolean = true;
  constructor(
    private route: RouteHelperService,
    private http: HttpClient,
    private router: Router,
    private formBuilder: FormBuilder,
    private readonly toastr: ToastrService,
    private readonly inventoryDataService: InventoryDataService,
    private readonly reportHazardDataService: ReportHazardDataService,
    private readonly userService: UserDataService,
    private readonly masterCategoryService: MasterCategoryDataService
  ) {}

  getUserInfo(): void {
    this.userService
      .getUser()
      .pipe(takeUntil(this._onDestroy$))
      .subscribe((response) => (this.userInfo = response.body));
  }

  ngOnInit(): void {
    this.getUserInfo();
    this.createForm();

    this.getDataCategory();
    this.getDatainventory();
  }

  ngOnDestroy(): void {
    this._onDestroy$.next(true);
    this._onDestroy$.unsubscribe();
  }

  createForm(): void {
    this.AddHazardForm = this.formBuilder.group({
      equipment_id: ['', [Validators.required]],
      category: ['', [Validators.required]],
      image_path: ['', [Validators.required]],
      notes: ['', [Validators.nullValidator]],
    });
  }

  get image_path() {
    return this.AddHazardForm.get('image_path');
  }

  get notes() {
    return this.AddHazardForm.get('notes');
  }

  get equipment_id() {
    return this.AddHazardForm.get('equipment_id');
  }

  get category() {
    return this.AddHazardForm.get('category');
  }

  resetForm(): void {
    this.AddHazardForm.reset();
  }

  onDocumentUploaded(event: any) {
    if (event.target.files && event.target.files.length) {
      this.selectedFile = event.target.files[0];
      this.AddHazardForm.patchValue({
        image_path: this.selectedFile.name,
      });
    }
  }

  getDataCategory(): void {
    this.masterCategoryService
      .getCategoryData(this.categoryDataRequest)
      .pipe(takeUntil(this._onDestroy$))
      .subscribe((response) => {
        this.categoryData = response.category;
      });
  }

  getDatainventory(): void {
    this.inventoryDataService
      .getInventoryData(this.inventoryDataRequest)
      .pipe(takeUntil(this._onDestroy$))
      .subscribe((response) => {
        this.inventoryData = response.inventory;
      });
  }

  equipmentOnChange($event: number): void {
    this.inventoryDataService
      .getDataById($event)
      .pipe(takeUntil(this._onDestroy$))
      .subscribe((response) => {
        this.detailInventory = response.inventoryData;
      });
  }

  storeData(file: any) {
    const requestBody = {
      equipmentId: this.AddHazardForm.value.equipment_id,
      object: {
        equipment_id: this.AddHazardForm.value.equipment_id,
        category_id: this.AddHazardForm.value.category,
        image_path: file.file.filename,
        notes: this.AddHazardForm.value.notes,
        is_closed: 0,
        created_by: this.userInfo.personalNumber,
        updated_by: this.userInfo.personalNumber,
      },
      equipmentData: {
        id_equipment: this.AddHazardForm.value.equipment_id,
        is_available: 0,
      },
    };

    this.reportHazardDataService.storeData(requestBody).subscribe(
      (success) => {
        this.toastr.success('Data stored successfully', 'Success!');
        this.router.navigate(['/report-hazard']);
      },
      (error) =>
        this.toastr.error('Something went wrong, nothing changed', 'Oopps!')
    );
  }

  onSubmit(): void {
    // Upload image
    const formData = new FormData();
    formData.append('file', this.selectedFile, this.selectedFile.name);
    formData.append('projectName', 'engine stand');
    formData.append('projectUser', this.userInfo.personalNumber);
    formData.append('publicStatus', 'public');

    this.http.post(environment.apiMedia + '/upload', formData).subscribe(
      (response) => {
        // this.toastr.success('Image has been uploaded', 'Hooray!');
        this.storeData(response);
      },
      (error) => {
        this.toastr.error('Upload image fail', 'Oops!');
      }
    );
  }
}
