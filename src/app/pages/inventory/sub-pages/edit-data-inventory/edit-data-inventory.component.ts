import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { InventoryDTO } from 'src/app/core/dto/inventory.dto';
import { MasterAircraftDTO } from 'src/app/core/dto/master-aircraft.dto';
import { MasterDestinationDTO } from 'src/app/core/dto/master-destination.dto';
import { MasterManufactureDTO } from 'src/app/core/dto/master-manufacture.dto';
import { MasterOwnerDTO } from 'src/app/core/dto/master-owner.dto';
import { MasterTypeDTO } from 'src/app/core/dto/master-type.dto';
import { UserDataDTO } from 'src/app/core/dto/user-data.dto';
import { InventoryDataService } from 'src/app/core/services/inventory-data.service';
import { MasterAircraftDataService } from 'src/app/core/services/master-aircraft-data.service';
import { MasterDestinationDataService } from 'src/app/core/services/master-destination-data.service';
import { MasterManufactureDataService } from 'src/app/core/services/master-manufacture-data.service';
import { MasterOwnerDataService } from 'src/app/core/services/master-owner-data.service';
import { MasterTypeDataService } from 'src/app/core/services/master-type-data.service';
import { UserDataService } from 'src/app/core/services/user-data.service';
import { AircraftDataRequest } from 'src/app/pages/master-aircraft-type/request/aircraft-data.request';
import { DestinationDataRequest } from 'src/app/pages/master-destination/request/destination-data.request';
import { TypeDataRequest } from 'src/app/pages/master-engine-type/request/type-data.request';
import { ManufactureDataRequest } from 'src/app/pages/master-manufacture/request/manufacture-data.request';
import { OwnerDataRequest } from 'src/app/pages/master-owner/request/owner-data.request';
import { AddDataInventoryDTO } from '../add-data-inventory/dto/add-data-inventory.dto';
import Swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-edit-data-inventory',
  templateUrl: './edit-data-inventory.component.html',
  styleUrls: ['./edit-data-inventory.component.css'],
})
export class EditDataInventoryComponent implements OnInit, OnDestroy {
  EditInventoryForm;
  userInfo: UserDataDTO = <UserDataDTO>{};
  idEquipment: number;
  detailInventory: InventoryDTO;
  _onDestroy$: Subject<Boolean> = new Subject<Boolean>();

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
  formAction: boolean = true;
  imageData: any;
  selectedFile: File;
  invalidPartNumber: boolean = false;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private http: HttpClient,
    private readonly userService: UserDataService,
    private formBuilder: FormBuilder,
    private readonly toastr: ToastrService,
    private readonly inventoryDataService: InventoryDataService,
    private readonly masterAircraftTypeService: MasterAircraftDataService,
    private readonly manufactureDataService: MasterManufactureDataService,
    private readonly ownerDataService: MasterOwnerDataService,
    private readonly typeDataService: MasterTypeDataService,
    private readonly destinationDataService: MasterDestinationDataService
  ) {
    const equipmentId = Number(this.route.snapshot.paramMap.get('equipmentId'));
    this.idEquipment = equipmentId;

    this.inventoryDataService
      .getDataById(equipmentId)
      .pipe(takeUntil(this._onDestroy$))
      .subscribe((response) => {
        if (response.inventoryData == null) {
          Swal.fire('Oops!', 'What are you looking for?', 'error');
          this.router.navigate(['/inventory']);
        }
      });
  }

  ngOnDestroy(): void {
    this._onDestroy$.next(true);
    this._onDestroy$.unsubscribe();
  }

  onChange(event: any) {
    if (this.limitation.value == 'No') {
      this.EditInventoryForm.controls['contract_date'].disable();
      this.EditInventoryForm.patchValue({
        contract_date: '',
      });
    } else {
      this.EditInventoryForm.controls['contract_date'].enable();
      this.EditInventoryForm.patchValue({
        contract_date: this.detailInventory.contractDate,
      });
    }
  }

  defaultPhoto(event: any) {
    event.target.src = '../../../assets/images/image-default.jpg';
  }

  uniqueValidation(field: string, event: any): void {
    let term = event.target.value;
    let currentValue = term == this.detailInventory.partNumber;

    if (term && currentValue == false) {
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

  ngOnInit(): void {
    this.initData();

    this.createForm();

    this.getUserInfo();
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

  setDefaultValue(inventory: InventoryDTO) {
    this.EditInventoryForm.patchValue({
      id_equipment: inventory.equipmentId,
      idPmiSheet: inventory?.pmiSheet[0].pmiSheetId,
      idPmiData: inventory?.pmiData[0].pmiDataId,
      image_path: inventory.imagePath,
      description: inventory.description,
      destination: inventory.destination?.destinationId,
      // type_id: inventory.type.typeId,
      // aircraft_type_id: inventory.aircraftType.aircraftTypeId,
      part_number: inventory.partNumber,
      serial_number: inventory.serialNumber,
      model: inventory.model,
      storage_location: inventory.storageLocation,
      owner_id: inventory.owner.ownerId,
      limitation: inventory.limitation,
      // manufacture_id: inventory.manufacture.manufactureId,
      next_pmi_due_date: inventory.pmiData[0].nextPmiDueDate,
      pmi_date: inventory.pmiData[0].pmiDate,
      remark: inventory.remark,
      manufacture_date: inventory.manufactureDate,
      inventory_number: inventory.inventoryNumber,
      inventory_date: inventory.inventoryDate,
      accessory: inventory.accessory,
      is_available: Number(inventory.isAvailable),
      status: Number(inventory.status),
    });

    this.EditInventoryForm.controls['equipmentId'].setValue(
      inventory.equipmentId,
      { onlyself: true }
    );

    this.EditInventoryForm.controls['aircraft_type_id'].setValue(
      inventory.aircraftType.aircraftTypeId,
      {
        onlyself: true,
      }
    );

    this.EditInventoryForm.controls['manufacture_id'].setValue(
      inventory.manufacture.manufactureId,
      {
        onlyself: true,
      }
    );

    this.EditInventoryForm.controls['type_id'].setValue(inventory.type.typeId, {
      onlyself: true,
    });
  }

  initData(): void {
    this.inventoryDataService
      .getDataById(this.idEquipment)
      .pipe(takeUntil(this._onDestroy$))
      .subscribe((response) => {
        this.detailInventory = response.inventoryData;
        this.setDefaultValue(response.inventoryData as InventoryDTO);

        this.imageData =
          environment.apiMedia +
          '/preview/' +
          response.inventoryData.imagePath +
          '?full_size=true';
      });
  }

  createForm(): void {
    this.EditInventoryForm = this.formBuilder.group({
      equipmentId: ['', [Validators.nullValidator]],
      image_path: ['', [Validators.nullValidator]],
      description: ['', [Validators.nullValidator]],
      type_id: ['', [Validators.required]],
      aircraft_type_id: ['', [Validators.required]],
      part_number: ['', [Validators.required]],
      serial_number: ['', [Validators.required]],
      model: ['', [Validators.nullValidator]],
      owner_id: ['', [Validators.required]],
      storage_location: ['', [Validators.nullValidator]],
      limitation: ['', [Validators.required]],
      contract_date: ['', [Validators.nullValidator]],
      pmi_date: ['', [Validators.nullValidator]],
      next_pmi_due_date: ['', [Validators.nullValidator]],
      manufacture_id: ['', [Validators.required]],
      manufacture_date: ['', [Validators.nullValidator]],
      inventory_number: ['', [Validators.nullValidator]],
      inventory_date: ['', [Validators.nullValidator]],
      accessory: ['', [Validators.nullValidator]],
      remark: ['', [Validators.nullValidator]],
      idPmiData: ['', [Validators.required]],
      idPmiSheet: ['', [Validators.required]],
      status: ['', [Validators.required]],
      is_available: ['', [Validators.required]],
    });
  }

  updateData(input: any, file?: any): void {
    let contracts;
    if (input.limitation === 'Yes') contracts = input.contract_date;
    else contracts = null;

    if (!this.selectedFile) {
      const requestBody = {
        equipmentId: input.equipmentId,
        pmiSheetId: input.idPmiSheet,
        pmiDataId: input.idPmiData,

        equipmentData: {
          id_equipment: input.id_equipment,
          image_path: input.image_path,
          description: input.description,
          destination_id: input.destination_id,
          type_id: input.type_id,
          aircraft_type_id: input.aircraft_type_id,
          part_number: input.part_number,
          serial_number: input.serial_number,
          model: input.model,
          owner_id: input.owner_id,
          storage_location: input.storage_location,
          limitation: input.limitation,
          contract_date: contracts,
          manufacture_id: input.manufacture_id,
          manufacture_date: input.manufacture_date,
          inventory_date: input.inventory_date,
          inventory_number: input.inventory_number,
          accessory: input.accessory,
          remark: input.remark,
          updated_at: new Date(),
          updated_by: this.userInfo.personalNumber,
        },

        pmiDatumData: {
          pmi_date: input.pmi_date,
          next_pmi_due_date: input.next_pmi_due_date,
          updated_by: this.userInfo.personalNumber,
          updated_at: new Date(),
        },

        pmiSheetData: {
          part_number: input.part_number,
          equipment_id: input.equipmentId,
          updated_by: this.userInfo.personalNumber,
          updated_at: new Date(),
        },

        logEquipmentData: {
          equipment_id: input.equipmentId,
          image_path: input.image_path,
          description: input.description,
          destination: input.destination,
          type_id: input.type_id,
          aircraft_type_id: input.aircraft_type_id,
          part_number: input.part_number,
          serial_number: input.serial_number,
          model: input.model,
          owner_id: input.owner_id,
          storage_location: input.storage_location,
          limitation: input.limitation,
          contract_date: contracts,
          manufacture_id: input.manufacture_id,
          manufacture_date: input.manufacture_date,
          inventory_date: input.inventory_date,
          inventory_number: input.inventory_number,
          remark: input.remark,
          accessory: input.accessory,
          updated_by: this.userInfo.personalNumber,
          created_by: this.userInfo.personalNumber,
          is_available: Number(input.is_available),
          activity_status: Number(input.status),
        },
      };

      this.inventoryDataService.updateData(requestBody).subscribe(
        (success) => {
          Swal.fire(
            'The data has been updated',
            'Check the table for status information',
            'success'
          );
          // this.router.navigate(['/inventory']);
          this.initData();
        },
        (error) =>
          this.toastr.error('Something went wrong, nothing changed', 'Oopps!')
      );
    } else {
      const requestBody = {
        equipmentId: input.equipmentId,
        pmiSheetId: input.idPmiSheet,
        pmiDataId: input.idPmiData,

        equipmentData: {
          id_equipment: input.id_equipment,
          image_path: file.file.filename,
          description: input.description,
          destination_id: input.destination_id,
          type_id: input.type_id,
          aircraft_type_id: input.aircraft_type_id,
          part_number: input.part_number,
          serial_number: input.serial_number,
          model: input.model,
          owner_id: input.owner_id,
          storage_location: input.storage_location,
          limitation: input.limitation,
          contract_date: contracts,
          manufacture_id: input.manufacture_id,
          manufacture_date: input.manufacture_date,
          inventory_date: input.inventory_date,
          inventory_number: input.inventory_number,
          accessory: input.accessory,
          remark: input.remark,
          updated_at: new Date(),
          updated_by: this.userInfo.personalNumber,
        },

        pmiDatumData: {
          pmi_date: input.pmi_date,
          next_pmi_due_date: input.next_pmi_due_date,
          updated_by: this.userInfo.personalNumber,
          updated_at: new Date(),
        },

        pmiSheetData: {
          part_number: input.part_number,
          equipment_id: input.equipmentId,
          updated_by: this.userInfo.personalNumber,
          updated_at: new Date(),
        },

        logEquipmentData: {
          equipment_id: input.equipmentId,
          image_path: input.image_path,
          description: input.description,
          destination: input.destination,
          type_id: input.type_id,
          aircraft_type_id: input.aircraft_type_id,
          part_number: input.part_number,
          serial_number: input.serial_number,
          model: input.model,
          owner_id: input.owner_id,
          storage_location: input.storage_location,
          limitation: input.limitation,
          contract_date: contracts,
          manufacture_id: input.manufacture_id,
          manufacture_date: input.manufacture_date,
          inventory_date: input.inventory_date,
          inventory_number: input.inventory_number,
          remark: input.remark,
          accessory: input.accessory,
          updated_by: this.userInfo.personalNumber,
          created_by: this.userInfo.personalNumber,
          is_available: Number(input.is_available),
          activity_status: Number(input.status),
        },
      };

      this.inventoryDataService.updateData(requestBody).subscribe(
        (success) => {
          Swal.fire(
            'The data has been updated',
            'Check the table for status information',
            'success'
          );
          // this.router.navigate(['/inventory']);
          this.initData();
        },
        (error) =>
          this.toastr.error('Something went wrong, nothing changed', 'Oopps!')
      );
    }
  }

  get image_path() {
    return this.EditInventoryForm.get('image_path');
  }

  get description() {
    return this.EditInventoryForm.get('description');
  }

  get remark() {
    return this.EditInventoryForm.get('remark');
  }

  get type_id() {
    return this.EditInventoryForm.get('type_id');
  }

  get aircraft_type_id() {
    return this.EditInventoryForm.get('aircraft_type_id');
  }

  get part_number() {
    return this.EditInventoryForm.get('part_number');
  }

  get serial_number() {
    return this.EditInventoryForm.get('serial_number');
  }

  get model() {
    return this.EditInventoryForm.get('model');
  }

  get owner_id() {
    return this.EditInventoryForm.get('owner_id');
  }

  get storage_location() {
    return this.EditInventoryForm.get('storage_location');
  }

  get limitation() {
    return this.EditInventoryForm.get('limitation');
  }

  get contract_date() {
    return this.EditInventoryForm.get('contract_date');
  }

  get pmi_date() {
    return this.EditInventoryForm.get('pmi_date');
  }

  get next_pmi_due_date() {
    return this.EditInventoryForm.get('next_pmi_due_date');
  }

  get manufacture_id() {
    return this.EditInventoryForm.get('manufacture_id');
  }

  get manufacture_date() {
    return this.EditInventoryForm.get('manufature_date');
  }

  get inventory_number() {
    return this.EditInventoryForm.get('inventory_number');
  }

  get inventory_date() {
    return this.EditInventoryForm.get('inventory_date');
  }

  get accessory() {
    return this.EditInventoryForm.get('accessory');
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

  onDocumentUploaded(event: any) {
    if (event.target.files && event.target.files.length) {
      this.selectedFile = event.target.files[0];
      this.EditInventoryForm.patchValue({
        image_path: this.selectedFile.name,
      });
    }
  }

  resetForm(): void {
    this.EditInventoryForm.reset();
  }

  onSubmit(): void {
    const formData = new FormData();
    if (!this.selectedFile) {
      this.updateData(this.EditInventoryForm.value);
      this.EditInventoryForm.patchValue({
        image_path: this.detailInventory.imagePath,
      });
    } else {
      formData.append('file', this.selectedFile, this.selectedFile.name);
      formData.append('projectName', 'engine stand');
      formData.append('projectUser', this.userInfo.personalNumber);
      formData.append('publicStatus', 'public');

      console.log(this.selectedFile.name);

      this.http.post(environment.apiMedia + '/upload', formData).subscribe(
        (response) => {
          this.updateData(this.EditInventoryForm.value, response);
        },
        (error) => {
          this.toastr.error('Upload image fail', 'Oops!');
        }
      );
    }
  }
}
