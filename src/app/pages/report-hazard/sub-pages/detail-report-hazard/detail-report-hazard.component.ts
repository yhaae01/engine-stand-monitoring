import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { ReportHazardDTO } from 'src/app/core/dto/report-hazard.dto';
import { InventoryDTO } from 'src/app/core/dto/inventory.dto';
import { UserDataDTO } from 'src/app/core/dto/user-data.dto';
import { UserDataService } from 'src/app/core/services/user-data.service';
import { Confirmable } from 'src/app/core/decorators/confirmable.decorator';
import { ReportHazardDataRequest } from '../../request/report-hazard-data.request';
import { ReportHazardDataService } from 'src/app/core/services/report-hazard-data.service';
import { MasterRectificationDataService } from 'src/app/core/services/master-rectification-data.service';
import { RectificationDataRequest } from 'src/app/pages/master-rectification/request/rectification-data.request';
import { MasterRectificationDTO } from 'src/app/core/dto/master-rectification.dto';
import { FormBuilder, Validators } from '@angular/forms';
import { MasterCategoryDataService } from 'src/app/core/services/master-category-data.service';
import { MasterCategoryDTO } from 'src/app/core/dto/master-category.dto';
import { InventoryDataRequest } from 'src/app/pages/inventory/request/inventory-data.request';
import { CategoryDataRequest } from 'src/app/pages/master-category-hazard/request/category-data.request';
import { InventoryDataService } from 'src/app/core/services/inventory-data.service';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-detail-report-hazard',
  templateUrl: './detail-report-hazard.component.html',
  styleUrls: ['./detail-report-hazard.component.css'],
})
export class DetailReportHazardComponent implements OnInit, OnDestroy {
  DetailHazardForm;
  ProposedHazardForm;
  hazardId: number;
  detailReportHazard: ReportHazardDTO;
  _onDestroy$: Subject<Boolean> = new Subject<Boolean>();
  userInfo: UserDataDTO = <UserDataDTO>{};
  dataRequest: ReportHazardDataRequest;

  categoryData: MasterCategoryDTO[];
  inventoryData: InventoryDTO[];
  detailInventory: InventoryDTO;
  categoryDataRequest: CategoryDataRequest;
  inventoryDataRequest: InventoryDataRequest;

  rectificationDataRequest: RectificationDataRequest;
  rectificationData: MasterRectificationDTO[];
  imageData: any;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly userService: UserDataService,
    private readonly masterRectificationDataService: MasterRectificationDataService,
    private formBuilder: FormBuilder,
    private readonly toastr: ToastrService,
    private readonly inventoryDataService: InventoryDataService,
    private readonly masterCategoryService: MasterCategoryDataService,
    private readonly reportHazardDataService: ReportHazardDataService
  ) {
    const hazardId = Number(this.route.snapshot.paramMap.get('hazardId'));
    this.hazardId = hazardId;

    this.reportHazardDataService
      .getDataById(hazardId)
      .pipe(takeUntil(this._onDestroy$))
      .subscribe((response) => {
        if (response.reportHazardDetail == null) {
          Swal.fire('Oops!', 'What are you looking for?', 'error');
          this.router.navigate(['/report-hazard']);
        }
      });
  }

  getUserInfo(): void {
    this.userService
      .getUser()
      .pipe(takeUntil(this._onDestroy$))
      .subscribe((response) => (this.userInfo = response.body));
  }

  setDefaultValue(hazard: ReportHazardDTO) {
    this.DetailHazardForm.patchValue({
      id_hazard_rectification_equipment: hazard.hazardId,
      notes: hazard.notes,
      image_path: hazard.imagePath,
    });

    this.DetailHazardForm.controls['category'].setValue(
      hazard.category.categoryId,
      {
        onlyself: true,
      }
    );

    this.DetailHazardForm.controls['equipment_id'].setValue(
      hazard.equipment.equipmentId,
      {
        onlyself: true,
      }
    );
  }

  defaultPhoto(event: any) {
    event.target.src = '../../../assets/images/image-default.jpg';
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

  equipmentOnChange($event): void {
    this.inventoryDataService
      .getDataById($event)
      .pipe(takeUntil(this._onDestroy$))
      .subscribe((response) => {
        this.detailInventory = response.inventoryData;
      });
  }

  createForm(): void {
    this.DetailHazardForm = this.formBuilder.group({
      equipment_id: ['', [Validators.required]],
      category: ['', [Validators.required]],
      notes: ['', [Validators.nullValidator]],
      rectification_id: ['', [Validators.required]],
      reason: ['', [Validators.nullValidator]],
      link: ['', [Validators.nullValidator]],
      remedy: ['', [Validators.nullValidator]],
      remark: ['', [Validators.nullValidator]],
    });
  }

  createFormProposed(): void {
    this.ProposedHazardForm = this.formBuilder.group({
      rectification_id: ['', [Validators.required]],
      reason: ['', [Validators.nullValidator]],
      link: ['', [Validators.nullValidator]],
      remark: ['', [Validators.nullValidator]],
      remedy: ['', [Validators.nullValidator]],
    });
  }

  get equipment_id() {
    return this.DetailHazardForm.get('equipment_id');
  }

  get notes() {
    return this.DetailHazardForm.get('notes');
  }

  get remedy() {
    return this.DetailHazardForm.get('remedy');
  }

  get category() {
    return this.DetailHazardForm.get('category');
  }

  get reason() {
    return this.DetailHazardForm.get('reason');
  }

  get remark() {
    return this.DetailHazardForm.get('remark');
  }

  get link() {
    return this.DetailHazardForm.get('link');
  }

  get rectification_id() {
    return this.DetailHazardForm.get('rectification_id');
  }

  resetForm(): void {
    this.DetailHazardForm.reset();
  }

  ngOnInit(): void {
    this.getUserInfo();
    this.createForm();
    this.createFormProposed();

    this.initData();

    this.getDataRectification();
    this.getDataCategory();
    this.getDatainventory();
  }

  initData(): void {
    this.reportHazardDataService
      .getDataById(this.hazardId)
      .pipe(takeUntil(this._onDestroy$))
      .subscribe((response) => {
        this.detailReportHazard = response.reportHazardDetail;
        this.setDefaultValue(response.reportHazardDetail as ReportHazardDTO);

        this.imageData =
          environment.apiMedia +
          '/preview/' +
          response.reportHazardDetail.imagePath +
          '?full_size=true';
      });
  }

  getDataRectification(): void {
    this.masterRectificationDataService
      .getRectificationData(this.rectificationDataRequest)
      .pipe(takeUntil(this._onDestroy$))
      .subscribe((response) => {
        this.rectificationData = response.rectificationData;
      });
  }

  ngOnDestroy(): void {
    this._onDestroy$.next(true);
    this._onDestroy$.unsubscribe();
  }

  // Update Hazard
  // saat mengisi form bagian tab Rectification / Remedy Hazard
  async onSubmit() {
    const updateDetailHazard = {
      hazardId: this.hazardId,

      updateDetailHazard: {
        id_hazard_rectification_equipment: this.hazardId,
        equipment_id: this.DetailHazardForm.value.equipment_id,
        category_id: this.DetailHazardForm.value.category,
        notes: this.DetailHazardForm.value.notes,
        remark: this.DetailHazardForm.value.remark,
        is_closed: 0,
        updated_by: this.userInfo.personalNumber,
      },
    };

    this.reportHazardDataService.updateData(updateDetailHazard).subscribe(
      (success) => {
        {
          this.toastr.success('Data updated successfully', 'Success!');
          this.initData();
        }
        // this.router.navigate(['/report-hazard']);
      },
      (error) =>
        this.toastr.error('Something went wrong, nothing changed', 'Oopps!')
    );
  }

  // Proposed hazard
  // saat mengisi modal
  async onSubmitProposed() {
    const insertProposedHazard = {
      hazardId: this.hazardId,

      insertProposedHazard: {
        id_hazard_rectification_equipment: this.hazardId,
        rectification_id: this.ProposedHazardForm.value.rectification_id,
        reason: this.ProposedHazardForm.value.reason,
        remedy: this.ProposedHazardForm.value.remedy,
        link: this.ProposedHazardForm.value.link,
        remark: this.ProposedHazardForm.value.remark,
        is_closed: 0,
        updated_by: this.userInfo.personalNumber,
      },
    };

    this.reportHazardDataService.updateProposed(insertProposedHazard).subscribe(
      (success) => {
        this.toastr.success('Data updated successfully', 'Success!');
        // this.router.navigate(['/report-hazard']);
      },
      (error) =>
        this.toastr.error('Something went wrong, nothing changed', 'Oopps!')
    );
  }

  @Confirmable({
    title: 'Confirmation',
    html: 'Are you sure you want to close this report?',
    icon: 'question',
  })
  async closeHazard() {
    const closedHazard = {
      hazardId: this.hazardId,
      equipmentId: this.detailReportHazard.equipment.equipmentId,

      closedHazard: {
        id_hazard_rectification_equipment: this.hazardId,
        is_closed: 1,
        updated_by: this.userInfo.personalNumber,
      },
      equipmentData: {
        id_equipment: this.detailReportHazard.equipment.equipmentId,
        is_available: 1,
      },
    };

    this.reportHazardDataService.closeData(closedHazard).subscribe(
      (success) => {
        this.toastr.success('Report closed successfully', 'Success!');
        this.router.navigate(['/report-hazard']);
      },
      (error) =>
        this.toastr.error('Something went wrong, nothing changed', 'Oopps!')
    );
  }
}
