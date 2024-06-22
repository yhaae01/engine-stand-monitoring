import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject, switchMap, takeUntil, tap } from 'rxjs';
import { InventoryDTO } from 'src/app/core/dto/inventory.dto';
import { LogInventoryDTO } from 'src/app/core/dto/log-inventory.dto';
import { InventoryDataService } from 'src/app/core/services/inventory-data.service';
import { InventoryDataRequest } from '../../request/inventory-data.request';
import { UserDataDTO } from 'src/app/core/dto/user-data.dto';
import { UserDataService } from 'src/app/core/services/user-data.service';
import { Confirmable } from 'src/app/core/decorators/confirmable.decorator';
import Swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-detail-inventory',
  templateUrl: './detail-inventory.component.html',
  styleUrls: ['./detail-inventory.component.css'],
})
export class DetailInventoryComponent implements OnInit, OnDestroy {
  idEquipment: number;
  detailInventory: InventoryDTO;
  logInventory: LogInventoryDTO[];
  _onDestroy$: Subject<Boolean> = new Subject<Boolean>();
  userInfo: UserDataDTO = <UserDataDTO>{};
  dataRequest: InventoryDataRequest;
  imageData: any;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly userService: UserDataService,
    private readonly toastr: ToastrService,
    private http: HttpClient,
    private readonly inventoryDataService: InventoryDataService
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

  editInventory(equipmentId: number): void {
    this.router.navigate(['../inventory/edit', equipmentId]);
  }

  ngOnInit(): void {
    this.initData();

    this.getUserInfo();
  }

  getUserInfo(): void {
    this.userService
      .getUser()
      .pipe(takeUntil(this._onDestroy$))
      .subscribe((response) => (this.userInfo = response.body));
  }

  defaultPhoto(event: any) {
    event.target.src = '../../../assets/images/image-default.jpg';
  }

  initData(): void {
    this.inventoryDataService
      .getDataById(this.idEquipment)
      .pipe(
        tap((response) => {
          response.inventoryData['overall'] = Math.round(
            (response.inventoryData.pmiData[0].pmiAggregate.aggregate.sum
              .actualValue /
              response.inventoryData.pmiData[0].pmiAggregate.aggregate.sum
                .idealValue) *
              100
          );
        }),
        takeUntil(this._onDestroy$)
      )
      .subscribe((response) => {
        this.detailInventory = response.inventoryData;

        this.imageData =
          environment.apiMedia +
          '/preview/' +
          response.inventoryData.imagePath +
          '?full_size=true';
      });
  }

  @Confirmable({
    title: 'Confirmation',
    html: 'Are you sure you want to delete this data?',
    icon: 'question',
  })
  deleteInventory(input: any): void {
    const requestBody = {
      equipmentId: input.equipmentId,
    };

    this.inventoryDataService.destroyData(requestBody).subscribe(
      (success) => {
        this.toastr.success('Data deleted successfully', 'Success!');
        this.router.navigate(['/inventory']);
        this.initData();
      },
      (error) =>
        this.toastr.error('Something went wrong, nothing changed', 'Oopps!')
    );
  }

  outgoingData(equipmentId: number): void {
    this.router.navigate(['../inventory/outgoing', equipmentId]);
  }

  @Confirmable({
    title: 'Confirmation',
    html: 'Are you sure you want to change this data?',
    icon: 'question',
  })
  incomingData(input: any): void {
    const requestBody = {
      equipmentId: this.idEquipment,

      equipmentData: {
        updated_at: new Date(),
        updated_by: this.userInfo.personalNumber,
        activity_status: 1,
      },

      logEquipmentData: {
        equipment_id: this.idEquipment,
        image_path: this.detailInventory.imagePath,
        destination_id: this.detailInventory.destination.destinationId,
        note: this.detailInventory.notes,
        description: this.detailInventory.description,
        reason: this.detailInventory.reason,
        link: this.detailInventory.link,

        type_id: this.detailInventory.type.typeId,
        aircraft_type_id: this.detailInventory.aircraftType.aircraftTypeId,
        part_number: this.detailInventory.partNumber,
        serial_number: this.detailInventory.serialNumber,
        model: this.detailInventory.model,
        owner_id: this.detailInventory.owner.ownerId,
        storage_location: this.detailInventory.storageLocation,
        limitation: this.detailInventory.limitation,
        contract_date: this.detailInventory.contractDate,
        manufacture_id: this.detailInventory.manufacture.manufactureId,
        manufacture_date: this.detailInventory.manufactureDate,
        inventory_date: this.detailInventory.inventoryDate,
        inventory_number: this.detailInventory.inventoryNumber,
        accessory: this.detailInventory.accessory,
        updated_by: this.userInfo.personalNumber,
        created_by: this.userInfo.personalNumber,
        is_available: 1,
        activity_status: 1,
      },
    };

    this.inventoryDataService.incomingInventory(requestBody).subscribe(
      (success) => {
        this.toastr.success('Data has been updated successfully', 'Success!');
        this.router.navigate(['/inventory']);
        this.initData();
      },
      (error) =>
        this.toastr.error('Something went wrong, nothing changed', 'Oopps!')
    );
  }
}
