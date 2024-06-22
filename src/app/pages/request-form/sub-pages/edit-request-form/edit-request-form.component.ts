import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Subject, takeUntil, tap } from 'rxjs';
import { UserDataDTO } from 'src/app/core/dto/user-data.dto';
import { UserDataService } from 'src/app/core/services/user-data.service';
import { MasterDestinationDataService } from 'src/app/core/services/master-destination-data.service';
import { DestinationDataRequest } from 'src/app/pages/master-destination/request/destination-data.request';
import { MasterDestinationDTO } from 'src/app/core/dto/master-destination.dto';
import { ToastrService } from 'ngx-toastr';
import { RequestDataService } from 'src/app/core/services/request-data.service';
import { MasterJobDescDataService } from 'src/app/core/services/master-job-desc-data.service';
import { JobDescDataRequest } from 'src/app/pages/master-job-desc/request/job-desc-data.request';
import { MasterJobDescDTO } from 'src/app/core/dto/master-job-desc.dto';
import { ActivatedRoute, Router } from '@angular/router';
import { RequestDataDTO } from 'src/app/core/dto/request-data.dto';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-request-form',
  templateUrl: './edit-request-form.component.html',
  styleUrls: ['./edit-request-form.component.css'],
})
export class EditRequestFormComponent implements OnInit, OnDestroy {
  editRequestForm;

  destinationData: MasterDestinationDTO[];
  destinationDataRequest: DestinationDataRequest;

  jobDescData: MasterJobDescDTO[];
  jobDescDataRequest: JobDescDataRequest;

  detailInventory: RequestDataDTO = <RequestDataDTO>{};
  isSidebarOpen: boolean = true;
  userInfo: UserDataDTO = <UserDataDTO>{};
  formAction: boolean = true;
  _isDestroy: Subject<boolean> = new Subject<boolean>();
  idRequest: number;

  startDate: Date;
  endDate: Date;
  days: number = 0;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly userService: UserDataService,
    private readonly toastr: ToastrService,
    private readonly router: Router,
    private readonly requestDataService: RequestDataService,
    private formBuilder: FormBuilder,
    private readonly destinationDataService: MasterDestinationDataService,
    private readonly jobDescDataService: MasterJobDescDataService
  ) {
    const requestId = Number(this.route.snapshot.paramMap.get('requestId'));
    this.idRequest = requestId;

    this.requestDataService
      .getDataById(requestId)
      .pipe(takeUntil(this._isDestroy))
      .subscribe((response) => {
        if (response.requestsData == null) {
          Swal.fire('Oops!', 'What are you looking for?', 'error');
          this.router.navigate(['/home']);
        }
      });
  }

  changeDate(target: string, event: any): void {
    if (target === 'start' && event) {
      this.startDate = new Date(event.target.value);
    }

    if (target === 'end' && event) {
      this.endDate = new Date(event.target.value);
    }

    if (this.startDate && this.endDate) {
      this.days = Math.floor(
        (this.endDate.getTime() - this.startDate.getTime()) / (24 * 3600 * 1000)
      );
    } else {
      this.days = 0;
    }

    if (isNaN(this.days)) {
      this.days = 0;
    }
  }

  getUserInfo(): void {
    this.userService
      .getUser()
      .pipe(takeUntil(this._isDestroy))
      .subscribe((response) => (this.userInfo = response.body));
  }

  ngOnInit(): void {
    this.getDataDestination();
    this.getDataJobDesc();
    this.getUserInfo();
    this.initData();

    this.createForm();
  }

  initData(): void {
    this.requestDataService
      .getDataById(this.idRequest)
      .pipe(takeUntil(this._isDestroy))
      .subscribe((response) => {
        this.detailInventory = response.requestsData;
        this.setDefaultValue(response.requestsData);
      });
  }

  createForm(): void {
    this.editRequestForm = this.formBuilder.group({
      job_desc_id: ['', [Validators.required]],
      destination_id: ['', [Validators.required]],
      date: ['', [Validators.required]],
      until: ['', [Validators.required]],
      work_order_reff: ['', [Validators.nullValidator]],
      remark: ['', [Validators.nullValidator]],
    });
  }

  setDefaultValue(data: RequestDataDTO) {
    this.editRequestForm.patchValue({
      destination_id: data.destinationId,
      job_desc_id: data.jobDescId,
      work_order_reff: data.workOrderReff,
      date: data.date,
      remark: data.remark,
      until: data.requestDate[0].until,
    });

    this.editRequestForm.controls['destination_id'].setValue(
      data.destinationId,
      {
        onlyself: true,
      }
    );

    this.startDate = new Date(data.date);
    this.endDate = new Date(data.requestDate[0].until);

    this.days = Math.floor(
      (this.endDate.getTime() - this.startDate.getTime()) / (24 * 3600 * 1000)
    );
  }

  updateData(requestValue: any): void {
    const object = {
      requestId: this.idRequest,
      equipmentId: this.detailInventory.equipmentId,
      requestDateId: this.detailInventory.requestDate[0].requestDateId,
      requestData: {
        destination_id: requestValue.destination_id,
        job_desc_id: Number(requestValue.job_desc_id),
        date: requestValue.date,
        sn_engine: this.detailInventory.serialNumberEngine,
        work_order_reff: requestValue.work_order_reff,
        remark: requestValue.remark,
        updated_at: new Date(),
        updated_by: this.userInfo.personalNumber,
      },
      requestDateData: {
        until: requestValue.until,
        updated_at: new Date(),
        updated_by: this.userInfo.personalNumber,
      },
      equipmentData: {
        is_available: 0,
        updated_at: new Date(),
        updated_by: this.userInfo.personalNumber,
      },
    };

    this.requestDataService.updateData(object).subscribe(
      (success) => {
        this.toastr.success('Data updated successfully', 'Success!');
        this.router.navigate(['/home']);
      },
      (error) =>
        this.toastr.error('Something went wrong, nothing changed', 'Oopps!')
    );
  }
  resetForm(): void {
    this.editRequestForm.reset();
  }

  get destination_id() {
    return this.editRequestForm.get('destination_id');
  }

  get job_desc_id() {
    return this.editRequestForm.get('job_desc_id');
  }

  get date() {
    return this.editRequestForm.get('date');
  }

  get until() {
    return this.editRequestForm.get('until');
  }

  get work_order_reff() {
    return this.editRequestForm.get('work_order_reff');
  }

  get remark() {
    return this.editRequestForm.get('remark');
  }

  ngOnDestroy(): void {
    this._isDestroy.next(true);
    this._isDestroy.unsubscribe();
  }

  getDataDestination(): void {
    this.destinationDataService
      .getDestinationData(this.destinationDataRequest)
      .pipe(takeUntil(this._isDestroy))
      .subscribe((response) => {
        this.destinationData = response.destination;
      });
  }

  getDataJobDesc(): void {
    this.jobDescDataService
      .getJobDescData(this.jobDescDataRequest)
      .pipe(takeUntil(this._isDestroy))
      .subscribe((response) => {
        this.jobDescData = response.jobDesc;
      });
  }

  onSubmit() {
    this.updateData(this.editRequestForm.value);
  }
}
