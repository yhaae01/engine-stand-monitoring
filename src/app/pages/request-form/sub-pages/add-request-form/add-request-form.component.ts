import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { UserDataDTO } from 'src/app/core/dto/user-data.dto';
import { UserDataService } from 'src/app/core/services/user-data.service';
import { MasterDestinationDataService } from 'src/app/core/services/master-destination-data.service';
import { DestinationDataRequest } from 'src/app/pages/master-destination/request/destination-data.request';
import { MasterDestinationDTO } from 'src/app/core/dto/master-destination.dto';
import { ToastrService } from 'ngx-toastr';
import { AddDataRequestDTO } from './dto/add-data-request.dto';
import { RequestDataService } from 'src/app/core/services/request-data.service';
import { MasterJobDescDataService } from 'src/app/core/services/master-job-desc-data.service';
import { JobDescDataRequest } from 'src/app/pages/master-job-desc/request/job-desc-data.request';
import { MasterJobDescDTO } from 'src/app/core/dto/master-job-desc.dto';
import { ActivatedRoute, Router } from '@angular/router';
import { RequestDTO } from 'src/app/pages/request/dto/request.dto';
import { InventoryDataService } from 'src/app/core/services/inventory-data.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-request-form',
  templateUrl: './add-request-form.component.html',
  styleUrls: ['./add-request-form.component.css'],
})
export class AddRequestFormComponent implements OnInit, OnDestroy {
  addRequestForm;

  destinationData: MasterDestinationDTO[];
  destinationDataRequest: DestinationDataRequest;

  jobDescData: MasterJobDescDTO[];
  jobDescDataRequest: JobDescDataRequest;

  isSidebarOpen: boolean = true;
  userInfo: UserDataDTO = <UserDataDTO>{};
  formAction: boolean = true;
  _isDestroy: Subject<boolean> = new Subject<boolean>();
  idEquipment: number;

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
    private readonly jobDescDataService: MasterJobDescDataService,
    private readonly equipmentService: InventoryDataService
  ) {
    const equipmentId = Number(this.route.snapshot.paramMap.get('equipmentId'));
    this.idEquipment = equipmentId;

    this.equipmentService
      .getDataById(equipmentId)
      .pipe(takeUntil(this._isDestroy))
      .subscribe((response) => {
        if (response.inventoryData == null) {
          this.toastr.error('What are you looking for?', 'Oopps!');
          this.router.navigate(['/request-form']);
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

    this.createForm();
  }

  createForm(): void {
    this.addRequestForm = this.formBuilder.group({
      job_desc_id: ['', [Validators.required]],
      destination_id: ['', [Validators.required]],
      date: ['', [Validators.required]],
      until: ['', [Validators.required]],
      work_order_reff: ['', [Validators.nullValidator]],
      remark: ['', [Validators.nullValidator]],
    });
  }

  storeData(input: AddDataRequestDTO): void {
    const object = {
      idEquipment: this.idEquipment,
      object: {
        equipment_id: this.idEquipment,
        destination_id: input.destination_id,
        job_desc_id: Number(input.job_desc_id),
        date: input.date,
        sn_engine: '',
        work_order_reff: input.work_order_reff,
        remark: input.remark,
        created_by: this.userInfo.personalNumber,
        updated_by: this.userInfo.personalNumber,

        request_deliveries: {
          data: {
            destination_id: input.destination_id,
            created_by: this.userInfo.personalNumber,
            updated_by: this.userInfo.personalNumber,
            delivers: {
              data: {
                activity_id: 1,
                created_by: this.userInfo.personalNumber,
                updated_by: this.userInfo.personalNumber,
              },
            },
          },
        },

        request_dates: {
          data: {
            until: input.until,
            created_by: this.userInfo.personalNumber,
            updated_by: this.userInfo.personalNumber,
          },
        },
      },
    };

    this.requestDataService.storeData(object).subscribe(
      (success) => {
        Swal.fire(
          'The data you requested has been submitted',
          'Check the table for status information',
          'success'
        );
        // this.toastr.success('Data stored successfully', 'Success!');
        this.router.navigate(['/request-form']);
      },
      (error) =>
        this.toastr.error('Something went wrong, nothing changed', 'Oopps!')
    );
  }
  resetForm(): void {
    this.addRequestForm.reset();
  }

  get destination_id() {
    return this.addRequestForm.get('destination_id');
  }

  get job_desc_id() {
    return this.addRequestForm.get('job_desc_id');
  }

  get date() {
    return this.addRequestForm.get('date');
  }

  get until() {
    return this.addRequestForm.get('until');
  }

  get work_order_reff() {
    return this.addRequestForm.get('work_order_reff');
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
    this.storeData(this.addRequestForm.value);
  }
}
