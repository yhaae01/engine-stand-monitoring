import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { InventoryDTO } from 'src/app/core/dto/inventory.dto';
import { MasterDestinationDTO } from 'src/app/core/dto/master-destination.dto';
import { UserDataDTO } from 'src/app/core/dto/user-data.dto';
import { InventoryDataService } from 'src/app/core/services/inventory-data.service';
import { MasterDestinationDataService } from 'src/app/core/services/master-destination-data.service';
import { UserDataService } from 'src/app/core/services/user-data.service';
import { DestinationDataRequest } from 'src/app/pages/master-destination/request/destination-data.request';
import { environment } from 'src/environments/environment.prod';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-outgoing-form',
  templateUrl: './outgoing-form.component.html',
  styleUrls: ['./outgoing-form.component.css'],
})
export class OutgoingFormComponent implements OnInit, OnDestroy {
  OutgoingInventoryForm;
  idEquipment: number;
  detailInventory: InventoryDTO;
  _onDestroy$: Subject<Boolean> = new Subject<Boolean>();
  formAction: boolean = true;

  userInfo: UserDataDTO = <UserDataDTO>{};

  destinationData: MasterDestinationDTO[];
  destinationDataRequest: DestinationDataRequest;
  imageData: any;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly userService: UserDataService,
    private formBuilder: FormBuilder,
    private readonly toastr: ToastrService,
    private readonly inventoryDataService: InventoryDataService,
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

  ngOnInit(): void {
    this.initData();

    this.createForm();

    this.getDataDestination();
    this.getUserInfo();
  }

  defaultPhoto(event: any) {
    event.target.src = '../../../assets/images/image-default.jpg';
  }

  getUserInfo(): void {
    this.userService
      .getUser()
      .pipe(takeUntil(this._onDestroy$))
      .subscribe((response) => (this.userInfo = response.body));
  }

  setDefaultValue(inventory: InventoryDTO) {
    this.OutgoingInventoryForm.patchValue({
      image_path: inventory.imagePath,
      description: inventory.description,
      type_id: inventory.type.typeId,
      aircraft_type_id: inventory.aircraftType.aircraftTypeId,
      part_number: inventory.partNumber,
      serial_number: inventory.serialNumber,
      model: inventory.model,
      storage_location: inventory.storageLocation,
      owner_id: inventory.owner.ownerId,
      limitation: inventory.limitation,
      contract_date: inventory.contractDate,
      manufacture_id: inventory.manufacture.manufactureId,
      next_pmi_due_date: inventory.pmiData[0].nextPmiDueDate,
      pmi_date: inventory.pmiData[0].pmiDate,
      manufacture_date: inventory.manufactureDate,
      inventory_number: inventory.inventoryNumber,
      inventory_date: inventory.inventoryDate,
      accessory: inventory.accessory,
      is_available: inventory.isAvailable,
      // status: inventory.status,
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
    this.OutgoingInventoryForm = this.formBuilder.group({
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
      remark: ['', [Validators.nullValidator]],
      accessory: ['', [Validators.nullValidator]],
      is_available: ['', [Validators.required]],

      destination_id: ['', [Validators.required]],
      link: ['', [Validators.nullValidator]],
      note: ['', [Validators.nullValidator]],
      reason: ['', [Validators.nullValidator]],
    });
  }

  updateData(input: any): void {
    const requestBody = {
      equipmentId: this.idEquipment,
      equipmentData: {
        updated_at: new Date(),
        updated_by: this.userInfo.personalNumber,

        destination_id: Number(input.destination_id),
        note: input.note,
        reason: input.reason,
        remark: input.remark,
        link: input.link,
        activity_status: 2,
      },

      logEquipmentData: {
        equipment_id: this.idEquipment,
        image_path: input.image_path,
        destination_id: Number(input.destination_id),
        note: input.note,
        description: input.description,
        reason: input.reason,
        link: input.link,

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
        updated_by: this.userInfo.personalNumber,
        remark: input.remark,
        created_by: this.userInfo.personalNumber,
        is_available: Number(input.is_available),
        activity_status: 2,
        updated_at: new Date(),
      },
    };

    this.inventoryDataService.outgoingInventory(requestBody).subscribe(
      (success) => {
        this.toastr.success('Data updated successfully', 'Success!');
        this.router.navigate(['/inventory']);
      },
      (error) =>
        this.toastr.error('Something went wrong, nothing changed', 'Oopps!')
    );
  }

  get destination_id() {
    return this.OutgoingInventoryForm.get('destination_id');
  }

  get reason() {
    return this.OutgoingInventoryForm.get('reason');
  }

  get note() {
    return this.OutgoingInventoryForm.get('note');
  }

  get link() {
    return this.OutgoingInventoryForm.get('link');
  }

  get remark() {
    return this.OutgoingInventoryForm.get('remark');
  }

  onDocumentUploaded(event: any) {
    if (event.target.files && event.target.files.length) {
      const file: File = event.target.files[0];
      this.OutgoingInventoryForm.patchValue({
        image_path: file.name,
      });
    }
  }

  getDataDestination(): void {
    this.destinationDataService
      .getDestinationData(this.destinationDataRequest)
      .pipe(takeUntil(this._onDestroy$))
      .subscribe((response) => {
        this.destinationData = response.destination;
      });
  }

  resetForm(): void {
    this.OutgoingInventoryForm.reset();
  }

  onSubmit() {
    this.updateData(this.OutgoingInventoryForm.value);
  }

  ngOnDestroy(): void {
    this._onDestroy$.next(true);
    this._onDestroy$.unsubscribe();
  }
}
