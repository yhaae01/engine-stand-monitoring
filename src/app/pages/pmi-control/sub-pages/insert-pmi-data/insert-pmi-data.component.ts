import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { PmiControlDTO } from 'src/app/core/dto/pmi-control.dto';
import { UserDataDTO } from 'src/app/core/dto/user-data.dto';
import { PmiControlDataService } from 'src/app/core/services/pmi-control.service';
import { UserDataService } from 'src/app/core/services/user-data.service';
import { AddDataPmiControlDTO } from './dto/add-data-pmi-control.dto';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-insert-pmi-data',
  templateUrl: './insert-pmi-data.component.html',
  styleUrls: ['./insert-pmi-data.component.css'],
})
export class InsertPmiDataComponent implements OnInit, OnDestroy {
  AddPmiControlForm;
  idEquipment: number;
  pmiId: number;
  userInfo: UserDataDTO = <UserDataDTO>{};
  _onDestroy$: Subject<Boolean> = new Subject<Boolean>();
  detailPmiControl: PmiControlDTO;
  formAction: boolean = true;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly userService: UserDataService,
    private formBuilder: FormBuilder,
    private readonly toastr: ToastrService,
    private readonly pmiControlDataService: PmiControlDataService
  ) {
    const equipmentId = Number(this.route.snapshot.paramMap.get('equipmentId'));
    this.idEquipment = equipmentId;

    this.pmiControlDataService
      .getDataById(equipmentId)
      .pipe(takeUntil(this._onDestroy$))
      .subscribe((response) => {
        if (response.pmiControlData == null) {
          Swal.fire('Oops!', 'What are you looking for?', 'error');
          this.router.navigate(['/pmi-control']);
        }
      });
  }

  ngOnDestroy(): void {
    this._onDestroy$.next(true);
    this._onDestroy$.unsubscribe();
  }

  ngOnInit(): void {
    this.createForm();

    this.initData();
    this.getUserInfo();
  }

  initData(): void {
    this.pmiControlDataService
      .getDataById(this.idEquipment)
      .pipe(takeUntil(this._onDestroy$))
      .subscribe((response) => {
        this.detailPmiControl = response.pmiControlData;
        this.setDefaultValue(response.pmiControlData as PmiControlDTO);
      });
  }

  setDefaultValue(inventory: PmiControlDTO) {
    this.AddPmiControlForm.patchValue({
      id_equipment: inventory.equipmentId,
      pmiId: inventory?.pmiData[0].pmiDataId,
      pmi_activity: inventory?.pmiData[0].pmiActivity,
      pmi_result: inventory?.pmiData[0].pmiResult,
      type_id: inventory.type.typeId,
      aircraft_type_id: inventory.aircraftType.aircraftTypeId,
      part_number: inventory.partNumber,
      serial_number: inventory.serialNumber,
      manufacture_id: inventory.manufacture.manufactureId,
      next_pmi_due_date: inventory.pmiData[0].nextPmiDueDate,
      pmi_date: inventory.pmiData[0].pmiDate,
      inventory_number: inventory.inventoryNumber,
    });
  }

  createForm(): void {
    this.AddPmiControlForm = this.formBuilder.group({
      equipmentId: ['', [Validators.nullValidator]],
      pmi_date: ['', [Validators.nullValidator]],
      next_pmi_due_date: ['', [Validators.nullValidator]],
      pmi_result: ['', [Validators.nullValidator]],
      pmi_activity: ['', [Validators.nullValidator]],
      ideal_value1: ['', [Validators.nullValidator]],
      actual_value1: ['', [Validators.nullValidator]],
      ideal_value2: ['', [Validators.nullValidator]],
      actual_value2: ['', [Validators.nullValidator]],
      ideal_value3: ['', [Validators.nullValidator]],
      actual_value3: ['', [Validators.nullValidator]],
      pmiId: ['', [Validators.nullValidator]],
    });
  }

  resetForm(): void {
    this.AddPmiControlForm.reset();
  }

  storeData(input: any): void {
    const requestBody = {
      pmiId: input.pmiId,
      object: {
        pmi_date: input.pmi_date,
        next_pmi_due_date: input.next_pmi_due_date,
        pmi_activity: input.pmi_activity,
        pmi_result: input.pmi_result,
        updated_by: this.userInfo.personalNumber,
        updated_at: new Date(),
      },
      pmiPartDetailData: [
        {
          pmi_m_part_id: 1,
          pmi_id: input.pmiId,
          ideal_value: input.ideal_value1,
          actual_value: input.actual_value1,
          created_by: this.userInfo.personalNumber,
          updated_by: this.userInfo.personalNumber,
        },
        {
          pmi_m_part_id: 2,
          pmi_id: input.pmiId,
          ideal_value: input.ideal_value2,
          actual_value: input.actual_value2,
          created_by: this.userInfo.personalNumber,
          updated_by: this.userInfo.personalNumber,
        },
        {
          pmi_m_part_id: 3,
          pmi_id: input.pmiId,
          ideal_value: input.ideal_value3,
          actual_value: input.actual_value3,
          created_by: this.userInfo.personalNumber,
          updated_by: this.userInfo.personalNumber,
        },
      ],
    };

    this.pmiControlDataService.storeData(requestBody).subscribe(
      (success) => {
        this.toastr.success('Data stored successfully', 'Success!');
        // this.router.navigate(['/pmi-control']);
      },
      (error) =>
        this.toastr.error('Something went wrong, nothing changed', 'Oopps!')
    );
  }

  updateData(input: any): void {
    const requestBody = {
      idPmi: input.pmiId,
      objectPmi: {
        pmi_date: input.pmi_date,
        next_pmi_due_date: input.next_pmi_due_date,
        pmi_activity: input.pmi_activity,
        pmi_result: input.pmi_result,
        updated_by: this.userInfo.personalNumber,
        updated_at: new Date(),
      },
      pmiDetail: [
        {
          where: {
            id_pmi_part_detail: {
              _eq: this.detailPmiControl.pmiData[0].pmiPartDetails[0]
                .idPmiPartDetail,
            },
          },
          _set: {
            ideal_value:
              input.ideal_value1 ||
              this.detailPmiControl.pmiData[0].pmiPartDetails[0].idealValue,
            actual_value:
              input.actual_value1 ||
              this.detailPmiControl.pmiData[0].pmiPartDetails[0].actualValue,
            created_by: this.userInfo.personalNumber,
            updated_by: this.userInfo.personalNumber,
          },
        },
        {
          where: {
            id_pmi_part_detail: {
              _eq: this.detailPmiControl.pmiData[0].pmiPartDetails[1]
                .idPmiPartDetail,
            },
          },
          _set: {
            ideal_value:
              input.ideal_value2 ||
              this.detailPmiControl.pmiData[0].pmiPartDetails[1].idealValue,
            actual_value:
              input.actual_value2 ||
              this.detailPmiControl.pmiData[0].pmiPartDetails[1].actualValue,
            created_by: this.userInfo.personalNumber,
            updated_by: this.userInfo.personalNumber,
          },
        },
        {
          where: {
            id_pmi_part_detail: {
              _eq: this.detailPmiControl.pmiData[0].pmiPartDetails[2]
                .idPmiPartDetail,
            },
          },
          _set: {
            ideal_value:
              input.ideal_value3 ||
              this.detailPmiControl.pmiData[0].pmiPartDetails[2].idealValue,
            actual_value:
              input.actual_value3 ||
              this.detailPmiControl.pmiData[0].pmiPartDetails[2].actualValue,
            created_by: this.userInfo.personalNumber,
            updated_by: this.userInfo.personalNumber,
          },
        },
      ],
    };

    this.pmiControlDataService.updateData(requestBody).subscribe(
      (success) => {
        this.toastr.success('Data updated successfully', 'Success!');
        // this.router.navigate(['/pmi-control']);
      },
      (error) =>
        this.toastr.error('Something went wrong, nothing changed', 'Oopps!')
    );
  }

  onSubmit() {
    this.storeData(this.AddPmiControlForm.value);
  }

  onUpdate() {
    this.updateData(this.AddPmiControlForm.value);
  }

  get pmi_date() {
    return this.AddPmiControlForm.get('pmi_date');
  }

  get next_pmi_due_date() {
    return this.AddPmiControlForm.get('next_pmi_due_date');
  }

  get pmi_result() {
    return this.AddPmiControlForm.get('pmi_result');
  }

  get pmi_activity() {
    return this.AddPmiControlForm.get('pmi_activity');
  }

  get ideal_value1() {
    return this.AddPmiControlForm.get('ideal_value1');
  }

  get actual_value1() {
    return this.AddPmiControlForm.get('actual_value1');
  }
  get ideal_value2() {
    return this.AddPmiControlForm.get('ideal_value2');
  }

  get actual_value2() {
    return this.AddPmiControlForm.get('actual_value2');
  }
  get ideal_value3() {
    return this.AddPmiControlForm.get('ideal_value3');
  }

  get actual_value3() {
    return this.AddPmiControlForm.get('actual_value3');
  }

  getUserInfo(): void {
    this.userService
      .getUser()
      .pipe(takeUntil(this._onDestroy$))
      .subscribe((response) => (this.userInfo = response.body));
  }
}
