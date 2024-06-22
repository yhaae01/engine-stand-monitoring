import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil, tap } from 'rxjs';
import { Confirmable } from 'src/app/core/decorators/confirmable.decorator';
import { HomeDataDTO } from 'src/app/core/dto/home-data.dto';
import { InventoryDTO } from 'src/app/core/dto/inventory.dto';
import { LogInventoryDTO } from 'src/app/core/dto/log-inventory.dto';
import { MasterAircraftDTO } from 'src/app/core/dto/master-aircraft.dto';
import { MasterDestinationDTO } from 'src/app/core/dto/master-destination.dto';
import { UserDataDTO } from 'src/app/core/dto/user-data.dto';
import { HomeDataService } from 'src/app/core/services/home-data.service';
import { MasterAircraftDataService } from 'src/app/core/services/master-aircraft-data.service';
import { MasterDestinationDataService } from 'src/app/core/services/master-destination-data.service';
import { UserDataService } from 'src/app/core/services/user-data.service';
import { AircraftDataRequest } from 'src/app/pages/master-aircraft-type/request/aircraft-data.request';
import { DestinationDataRequest } from 'src/app/pages/master-destination/request/destination-data.request';
import { RequestDataRequest } from 'src/app/pages/request-form/request/inventory-data.request';
import { environment } from 'src/environments/environment.prod';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css'],
})
export class DetailComponent implements OnInit, OnDestroy {
  detailHomeForm;
  idRequest: number;
  detailHome: HomeDataDTO;

  destinationData: MasterDestinationDTO[];
  destinationDataRequest: DestinationDataRequest;

  aircraftData: MasterAircraftDTO[];
  aircraftDataRequest: AircraftDataRequest;

  logInventory: LogInventoryDTO[];
  _onDestroy$: Subject<Boolean> = new Subject<Boolean>();
  userInfo: UserDataDTO = <UserDataDTO>{};
  dataRequest: RequestDataRequest;
  formAction: boolean = true;

  imageData: any;
  nextDestination: string;

  constructor(
    private formBuilder: FormBuilder,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly userService: UserDataService,
    private readonly masterAircraftTypeService: MasterAircraftDataService,
    private readonly destinationDataService: MasterDestinationDataService,
    private readonly toastr: ToastrService,
    private readonly homeDataService: HomeDataService
  ) {
    const requestId = Number(this.route.snapshot.paramMap.get('requestId'));
    this.idRequest = requestId;

    this.homeDataService
      .getDataById(requestId)
      .pipe(takeUntil(this._onDestroy$))
      .subscribe((response) => {
        if (response.homeData == null) {
          Swal.fire('Oops!', 'What are you looking for?', 'error');
          this.router.navigate(['/home']);
        }
      });
  }

  getUserInfo(): void {
    this.userService
      .getUser()
      .pipe(takeUntil(this._onDestroy$))
      .subscribe((response) => (this.userInfo = response.body));
  }

  getDataAircraft(): void {
    this.masterAircraftTypeService
      .getAircraftData(this.aircraftDataRequest)
      .pipe(takeUntil(this._onDestroy$))
      .subscribe((response) => {
        this.aircraftData = response.aircraftType;
      });
  }

  getDataDestination(): void {
    this.destinationDataService
      .getDestinationData(this.destinationDataRequest)
      .pipe(takeUntil(this._onDestroy$))
      .subscribe((response) => {
        this.destinationData = response.destination;
      });
  }

  editRequest(requestId: number): void {
    this.router.navigate(['/request-form/edit', requestId]);
  }

  createForm(): void {
    this.detailHomeForm = this.formBuilder.group({
      remark: ['', [Validators.required]],
      sn_engine: ['', [Validators.required]],
      aircraft_type_id: ['', [Validators.nullValidator]],
      destination_id: ['', [Validators.required]],
      until: ['', [Validators.required]],
      aircraft_registration: ['', [Validators.nullValidator]],
    });
  }

  get remark() {
    return this.detailHomeForm.get('remark');
  }

  get aircraft_type_id() {
    return this.detailHomeForm.get('aircraft_type_id');
  }

  get sn_engine() {
    return this.detailHomeForm.get('sn_engine');
  }

  get destination_id() {
    return this.detailHomeForm.get('destination_id');
  }

  get until() {
    return this.detailHomeForm.get('until');
  }

  get aircraft_registration() {
    return this.detailHomeForm.get('aircraft_registration');
  }

  defaultPhoto(event: any) {
    event.target.src = '../../../assets/images/image-default.jpg';
  }

  onSubmit() {
    this.rejectData(this.detailHomeForm.value);
  }

  onSubmitUsed() {
    this.usedData(this.detailHomeForm.value);
  }

  onSubmitLoan() {
    this.loanData(this.detailHomeForm.value);
  }

  onSubmitRequest() {
    this.requestData(this.detailHomeForm.value);
  }

  async rejectData(input: any): Promise<void> {
    const requestBody = {
      deliveryId: this.detailHome.requestDelivery[0].deliver[0].deliveryId,

      deliveryData: {
        activity_id: 6, // Reject
        remark: input.remark,
        updated_at: new Date(),
        updated_by: this.userInfo.personalNumber,
      },
    };

    this.homeDataService.updateStatusRejectData(requestBody).subscribe(
      (success) => {
        this.toastr.success('Data reject successfully', 'Success!');
        // this.router.navigate(['/home']);
        this.initData();
      },
      (error) =>
        this.toastr.error('Something went wrong, nothing changed', 'Oopps!')
    );
  }

  // Take Data
  @Confirmable({
    title: 'Confirmation',
    html: 'Are you sure you want to take this data?',
    icon: 'question',
  })
  async takeData(input: any): Promise<void> {
    const requestBody = {
      deliveryId: this.detailHome.requestDelivery[0].deliver[0].deliveryId,

      deliveryData: {
        activity_id: 2, // Take
        updated_at: new Date(),
        updated_by: this.userInfo.personalNumber,
      },
    };

    this.homeDataService.updateStatusData(requestBody).subscribe(
      (success) => {
        this.toastr.success('Data take successfully', 'Success!');
        // this.router.navigate(['/home']);
        this.initData();
      },
      (error) =>
        this.toastr.error('Something went wrong, nothing changed', 'Oopps!')
    );
  }

  // Execute Data
  @Confirmable({
    title: 'Confirmation',
    html: 'Are you sure you want to execute this data?',
    icon: 'question',
  })
  async executeData(input: any): Promise<void> {
    const requestBody = {
      deliveryId: this.detailHome.requestDelivery[0].deliver[0].deliveryId,

      deliveryData: {
        activity_id: 3, // Execute
        updated_at: new Date(),
        updated_by: this.userInfo.personalNumber,
      },
    };

    this.homeDataService.updateStatusData(requestBody).subscribe(
      (success) => {
        this.toastr.success('Data execute successfully', 'Success!');
        // this.router.navigate(['/home']);
        this.initData();
      },
      (error) =>
        this.toastr.error('Something went wrong, nothing changed', 'Oopps!')
    );
  }

  // Delivered data
  @Confirmable({
    title: 'Confirmation',
    html: 'Are you sure you want to delivered this data?',
    icon: 'question',
  })
  async deliveredData(input: any): Promise<void> {
    const requestBody = {
      equipmentId: this.detailHome.equipmentData.equipmentId,
      deliveryId: this.detailHome.requestDelivery[0].deliver[0].deliveryId,
      requestDeliveryId: this.detailHome.requestDelivery[0].requestDeliveryId,

      deliveryData: {
        activity_id: 4, // Delivered
        updated_at: new Date(),
        updated_by: this.userInfo.personalNumber,
      },
      equipmentData: {
        storage_location:
          this.detailHome.requestDelivery[0].destination.destinationName,
      },
      requestDeliveryData: {
        destination_id: 0,
      },
    };

    this.homeDataService.updateStatusDeliveredData(requestBody).subscribe(
      (success) => {
        this.toastr.success('Data delivered successfully', 'Success!');
        // this.router.navigate(['/home']);
        this.initData();
      },
      (error) =>
        this.toastr.error('Something went wrong, nothing changed', 'Oopps!')
    );
  }

  // Role Operator
  // Used Data
  async usedData(input: any): Promise<void> {
    const requestBody = {
      deliveryId: this.detailHome.requestDelivery[0].deliver[0].deliveryId,
      requestId: this.detailHome.requestId,

      deliveryData: {
        activity_id: 5, // Used
        updated_at: new Date(),
        updated_by: this.userInfo.personalNumber,
      },
      requestData: {
        sn_engine: input.sn_engine,
        aircraft_registration: input.aircraft_registration,
      },
    };

    this.homeDataService.updateStatusUsedData(requestBody).subscribe(
      (success) => {
        this.toastr.success('Data used successfully', 'Success!');
        this.initData();
      },
      (error) =>
        this.toastr.error('Something went wrong, nothing changed', 'Oopps!')
    );
  }

  // Request Data
  async requestData(input: any): Promise<void> {
    const requestBody = {
      requestDeliveryId: this.detailHome.requestDelivery[0].requestDeliveryId,
      deliveryId: this.detailHome.requestDelivery[0].deliver[0].deliveryId,

      deliveryData: {
        activity_id: 1, // Open
        updated_at: new Date(),
        updated_by: this.userInfo.personalNumber,
      },
      requestDeliveryData: {
        destination_id: input.destination_id,
      },
    };

    this.homeDataService.updateStatusRequestData(requestBody).subscribe(
      (success) => {
        this.toastr.success('Data request successfully', 'Success!');
        // this.router.navigate(['/home']);
        this.initData();
      },
      (error) =>
        this.toastr.error('Something went wrong, nothing changed', 'Oopps!')
    );
  }

  // Loan Data
  async loanData(input: any): Promise<void> {
    const requestBody = {
      requestDateId: this.detailHome.requestDate[0].requestDateId,

      requestDateData: {
        until: input.until,
      },
    };

    this.homeDataService.updateStatusLoanData(requestBody).subscribe(
      (success) => {
        this.toastr.success('Data loan successfully', 'Success!');
        // this.router.navigate(['/home']);
        this.initData();
      },
      (error) =>
        this.toastr.error('Something went wrong, nothing changed', 'Oopps!')
    );
  }

  // Closed Data
  @Confirmable({
    title: 'Confirmation',
    html: 'Are you sure you want to closed this data?',
    icon: 'question',
  })
  async closedData(input: any): Promise<void> {
    const requestBody = {
      equipmentId: this.detailHome.equipmentData.equipmentId,
      deliveryId: this.detailHome.requestDelivery[0].deliver[0].deliveryId,

      deliveryData: {
        activity_id: 8, // Closed
        updated_at: new Date(),
        updated_by: this.userInfo.personalNumber,
      },
      equipmentData: {
        is_available: 1,
      },
    };

    this.homeDataService.updateStatusClosedData(requestBody).subscribe(
      (success) => {
        this.toastr.success('Data closed successfully', 'Success!');
        // this.router.navigate(['/home']);
        this.initData();
      },
      (error) =>
        this.toastr.error('Something went wrong, nothing changed', 'Oopps!')
    );
  }

  ngOnDestroy(): void {
    this._onDestroy$.next(true);
    this._onDestroy$.unsubscribe();
  }

  ngOnInit(): void {
    this.createForm();

    this.initData();

    this.getUserInfo();
    this.getDataAircraft();
    this.getDataDestination();
  }

  initData(): void {
    this.homeDataService
      .getDataById(this.idRequest)
      .pipe(
        tap((response) => {
          let startDate = new Date(response.homeData.date);
          let endDate = new Date(response.homeData.requestDate[0].until);

          response.homeData['days'] = Math.floor(
            (endDate.getTime() - startDate.getTime()) / (24 * 3600 * 1000)
          );
        }),
        takeUntil(this._onDestroy$)
      )
      .subscribe((response) => {
        this.detailHome = response.homeData;

        this.imageData =
          environment.apiMedia +
          '/preview/' +
          response.homeData.imagePath +
          '?full_size=true';
      });
  }
}
