import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subject, takeUntil, tap } from 'rxjs';
import { MasterOwnerDTO } from 'src/app/core/dto/master-owner.dto';
import { MasterOwnerDataService } from 'src/app/core/services/master-owner-data.service';
import { OwnerDataRequest } from './request/owner-data.request';
import { PaginatorRequest } from 'src/app/core/requests/paginator.request';

@Component({
  selector: 'app-master-owner',
  templateUrl: './master-owner.component.html',
  styleUrls: ['./master-owner.component.css'],
})
export class MasterOwnerComponent implements OnInit, OnDestroy {
  ownerData: MasterOwnerDTO[];
  _onDestroy$: Subject<Boolean> = new Subject<Boolean>();
  dataRequest: OwnerDataRequest;
  paginator: PaginatorRequest;

  constructor(
    private readonly masterOwnerDataService: MasterOwnerDataService
  ) {}

  ngOnInit(): void {
    this.initData();
  }

  ngOnDestroy(): void {
    this._onDestroy$.next(true);
    this._onDestroy$.unsubscribe();
  }

  initData(): void {
    this.masterOwnerDataService
      .getOwnerData(this.dataRequest)
      .pipe(takeUntil(this._onDestroy$))
      .subscribe((response) => {
        this.ownerData = response.owner;
      });

    this.masterOwnerDataService
      .getOwnerData()
      .pipe(takeUntil(this._onDestroy$))
      .subscribe((response) => {
        this.paginator.totalData = response.owner.length;
        this.paginator.totalPage = Math.floor(
          (response.owner.length + this.paginator.pageSize - 1) /
            this.paginator.pageSize
        );
      });
  }
}
