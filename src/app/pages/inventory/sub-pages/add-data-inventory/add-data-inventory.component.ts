import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { RouteHelperService } from 'src/app/core/services/route-helper.service';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { MasterAircraftDataService } from 'src/app/core/services/master-aircraft-data.service';
import { MasterAircraftDTO } from 'src/app/core/dto/master-aircraft.dto';
import { UserDataService } from 'src/app/core/services/user-data.service';
import { UserDataDTO } from 'src/app/core/dto/user-data.dto';
import { Subject, takeUntil } from 'rxjs';
import { AircraftDataRequest } from 'src/app/pages/master-aircraft-type/request/aircraft-data.request';
import { MasterManufactureDataService } from 'src/app/core/services/master-manufacture-data.service';
import { MasterManufactureDTO } from 'src/app/core/dto/master-manufacture.dto';
import { ManufactureDataRequest } from 'src/app/pages/master-manufacture/request/manufacture-data.request';
import { OwnerDataRequest } from 'src/app/pages/master-owner/request/owner-data.request';
import { MasterOwnerDataService } from 'src/app/core/services/master-owner-data.service';
import { MasterOwnerDTO } from 'src/app/core/dto/master-owner.dto';
import { MasterTypeDataService } from 'src/app/core/services/master-type-data.service';
import { TypeDataRequest } from 'src/app/pages/master-engine-type/request/type-data.request';
import { MasterTypeDTO } from 'src/app/core/dto/master-type.dto';
import { InventoryDataService } from 'src/app/core/services/inventory-data.service';
import { AddDataInventoryDTO } from './dto/add-data-inventory.dto';
import { ToastrService } from 'ngx-toastr';
import { MasterDestinationDataService } from 'src/app/core/services/master-destination-data.service';
import { DestinationDataRequest } from 'src/app/pages/master-destination/request/destination-data.request';
import { MasterDestinationDTO } from 'src/app/core/dto/master-destination.dto';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { InventoryDTO } from 'src/app/core/dto/inventory.dto';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-add-data-inventory',
  templateUrl: './add-data-inventory.component.html',
  styleUrls: ['./add-data-inventory.component.css'],
})
export class AddDataInventoryComponent implements OnInit, OnDestroy {
  @ViewChild('contractDate') contractDate;

  idEquipment: number;
  detailInventory: InventoryDTO;
  invalidPartNumber: boolean = false;
  AddInventoryForm;
  selectedFile: File;
  formData = new FormData();
  userInfo: UserDataDTO = <UserDataDTO>{};

  aircraftData: MasterAircraftDTO[];
  manufactureData: MasterManufactureDTO[];
  ownerData: MasterOwnerDTO[];
  destinationData: MasterDestinationDTO[];
  typeData: MasterTypeDTO[];

  aircraftDataRequest: AircraftDataRequest;
  manufactureDataRequest: ManufactureDataRequest;
  ownerDataRequest: OwnerDataRequest;
  typeDataRequest: TypeDataRequest;
  destinationDataRequest: DestinationDataRequest;

  _onDestroy$: Subject<Boolean> = new Subject<Boolean>();
  formAction: boolean = true;
  selectedOption: number;
  isInputDisabled = false;

  constructor(
    private route: RouteHelperService,
    private http: HttpClient,
    private router: Router,
    private formBuilder: FormBuilder,
    private readonly toastr: ToastrService,
    private readonly inventoryDataService: InventoryDataService,
    private readonly userService: UserDataService,
    private readonly masterAircraftTypeService: MasterAircraftDataService,
    private readonly manufactureDataService: MasterManufactureDataService,
    private readonly ownerDataService: MasterOwnerDataService,
    private readonly typeDataService: MasterTypeDataService,
    private readonly destinationDataService: MasterDestinationDataService
  ) {}

  ngOnInit(): void {
    this.getUserInfo();
    this.initData();
    this.createForm();

    this.getDataAircraft();
    this.getDataManufacture();
    this.getDataOwner();
    this.getDataType();
    this.getDataDestination();
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

  setDisable(toStore: boolean): void {
    this.formAction = toStore;
  }

  onChange(event: any) {
    if (this.limitation.value == 'No') {
      this.AddInventoryForm.controls['contract_date'].disable();
      this.AddInventoryForm.patchValue({
        contract_date: '',
      });
    } else {
      this.AddInventoryForm.controls['contract_date'].enable();
    }
  }

  createForm(): void {
    this.AddInventoryForm = this.formBuilder.group({
      image_path: ['', [Validators.nullValidator]],
      description: ['', [Validators.required]],
      type_id: ['', [Validators.required]],
      aircraft_type_id: ['', [Validators.required]],
      part_number: ['', [Validators.required]],
      serial_number: ['', [Validators.required]],
      model: ['', [Validators.nullValidator]],
      owner_id: ['', [Validators.required]],
      storage_location: ['', [Validators.nullValidator]],
      limitation: ['', [Validators.required]],
      contract_date: ['', Validators.required],
      pmi_date: ['', [Validators.nullValidator]],
      next_pmi_due_date: ['', [Validators.nullValidator]],
      manufacture_id: ['', [Validators.required]],
      manufacture_date: ['', [Validators.nullValidator]],
      inventory_number: ['', [Validators.nullValidator]],
      inventory_date: ['', [Validators.nullValidator]],
      accessory: ['', [Validators.nullValidator]],
      remark: ['', [Validators.nullValidator]],
    });
  }

  storeData(input: any, file?: any): void {
    let fileName;
    if (file) fileName = file.file.filename;
    else fileName = null;

    const object = {
      image_path: fileName,
      description: input.description,
      type_id: input.type_id,
      aircraft_type_id: input.aircraft_type_id,
      part_number: input.part_number,
      serial_number: input.serial_number,
      model: input.model,
      owner_id: input.owner_id,
      storage_location: input.storage_location,
      limitation: input.limitation,
      contract_date: input.contract_date,
      manufacture_id: input.manufacture_id,
      manufacture_date: input.manufacture_date,
      inventory_date: input.inventory_date,
      inventory_number: input.inventory_number,
      accessory: input.accessory,
      remark: input.remark,
      is_available: 1,
      activity_status: 1, // 1 Incoming 2 Outgoing
      created_by: this.userInfo.personalNumber,
      updated_by: this.userInfo.personalNumber,
      pmi_data: {
        data: {
          pmi_date: input.pmi_date,
          next_pmi_due_date: input.next_pmi_due_date,
          pmi_activity: 'Initial',
          pmi_result: '',
          created_by: this.userInfo.personalNumber,
          updated_by: this.userInfo.personalNumber,
        },
      },
      pmi_sheets: {
        data: {
          part_number: input.part_number,
          pmi_sheet: '',
          created_by: this.userInfo.personalNumber,
          updated_by: this.userInfo.personalNumber,
        },
      },
      log_equipment_data: {
        data: {
          image_path: input.image_path,
          description: input.description,
          type_id: input.type_id,
          aircraft_type_id: input.aircraft_type_id,
          part_number: input.part_number,
          serial_number: input.serial_number,
          model: input.model,
          owner_id: input.owner_id,
          storage_location: input.storage_location,
          limitation: input.limitation,
          contract_date: input.contract_date,
          manufacture_id: input.manufacture_id,
          manufacture_date: input.manufacture_date,
          inventory_date: input.inventory_date,
          inventory_number: input.inventory_number,
          remark: input.remark,
          accessory: input.accessory,
          is_available: 1,
          activity_status: 1,
          created_by: this.userInfo.personalNumber,
          updated_by: this.userInfo.personalNumber,
        },
      },
    };

    this.inventoryDataService.storeData(object).subscribe(
      (success) => {
        Swal.fire(
          'The data has been recorded',
          'Check the table for status information',
          'success'
        );
        this.router.navigate(['/inventory']);
      },
      (error) =>
        this.toastr.error('Something went wrong, nothing changed', 'Oopps!')
    );
  }

  // public selectedFile: File;
  onFileSelected(event: any): void {
    if (event.target.files && event.target.files.length) {
      this.selectedFile = event.target.files[0];
      this.AddInventoryForm.patchValue({
        image_path: this.selectedFile.name,
      });
    }
  }

  onSubmit(): void {
    // Upload image
    const formData = new FormData();
    if (!this.selectedFile) {
      this.storeData(this.AddInventoryForm.value);
    } else {
      formData.append('file', this.selectedFile, this.selectedFile.name);
      formData.append('projectName', 'engine stand');
      formData.append('projectUser', this.userInfo.personalNumber);
      formData.append('publicStatus', 'public');

      this.http.post(environment.apiMedia + '/upload', formData).subscribe(
        (response) => {
          this.storeData(this.AddInventoryForm.value, response);
        },
        (error) => {
          this.toastr.error('Upload image fail', 'Oops!');
        }
      );
    }
  }

  initData(): void {
    this.inventoryDataService
      .getDataById(this.idEquipment)
      .pipe(takeUntil(this._onDestroy$))
      .subscribe((response) => {
        this.detailInventory = response.inventoryData;
      });
  }

  uniqueValidation(field: string, event: any): void {
    let term = event.target.value;

    if (term) {
      if (field == 'part_number') {
        this.inventoryDataService
          .getInventoryData({ filter: { part_number: { _ilike: term } } })
          .pipe(takeUntil(this._onDestroy$))
          .subscribe((response) => {
            this.invalidPartNumber =
              response.inventory.length == 0 ? false : true;
          });
      }
    }
  }

  get image_path() {
    return this.AddInventoryForm.get('image_path');
  }

  get description() {
    return this.AddInventoryForm.get('description');
  }

  get type_id() {
    return this.AddInventoryForm.get('type_id');
  }

  get aircraft_type_id() {
    return this.AddInventoryForm.get('aircraft_type_id');
  }

  get part_number() {
    return this.AddInventoryForm.get('part_number');
  }

  get serial_number() {
    return this.AddInventoryForm.get('serial_number');
  }

  get model() {
    return this.AddInventoryForm.get('model');
  }

  get owner_id() {
    return this.AddInventoryForm.get('owner_id');
  }

  get storage_location() {
    return this.AddInventoryForm.get('storage_location');
  }

  get limitation() {
    return this.AddInventoryForm.get('limitation');
  }

  get contract_date() {
    return this.AddInventoryForm.get('contract_date');
  }

  get pmi_date() {
    return this.AddInventoryForm.get('pmi_date');
  }

  get next_pmi_due_date() {
    return this.AddInventoryForm.get('next_pmi_due_date');
  }

  get manufacture_id() {
    return this.AddInventoryForm.get('manufacture_id');
  }

  get manufacture_date() {
    return this.AddInventoryForm.get('manufature_date');
  }

  get inventory_number() {
    return this.AddInventoryForm.get('inventory_number');
  }

  get inventory_date() {
    return this.AddInventoryForm.get('inventory_date');
  }

  get accessory() {
    return this.AddInventoryForm.get('accessory');
  }

  getDataAircraft(): void {
    this.masterAircraftTypeService
      .getAircraftData(this.aircraftDataRequest)
      .pipe(takeUntil(this._onDestroy$))
      .subscribe((response) => {
        this.aircraftData = response.aircraftType;
      });
  }

  getDataManufacture(): void {
    this.manufactureDataService
      .getManufactureData(this.manufactureDataRequest)
      .pipe(takeUntil(this._onDestroy$))
      .subscribe((response) => {
        this.manufactureData = response.manufacture;
      });
  }

  getDataOwner(): void {
    this.ownerDataService
      .getOwnerData(this.ownerDataRequest)
      .pipe(takeUntil(this._onDestroy$))
      .subscribe((response) => {
        this.ownerData = response.owner;
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

  getDataType(): void {
    this.typeDataService
      .getTypeData(this.typeDataRequest)
      .pipe(takeUntil(this._onDestroy$))
      .subscribe((response) => {
        this.typeData = response.mType;
      });
  }

  resetForm(): void {
    this.AddInventoryForm.reset();
  }
}
