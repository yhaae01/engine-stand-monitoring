import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil, tap } from 'rxjs';
import { UserDataDTO } from 'src/app/core/dto/user-data.dto';
import { UserDataService } from 'src/app/core/services/user-data.service';
import { ToastrService } from 'ngx-toastr';
import { SearchEngineDataService } from 'src/app/core/services/search-engine.service';
import { SearchEngineDTO } from 'src/app/core/dto/search-engine.dto';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-detail-search',
  templateUrl: './detail-search.component.html',
  styleUrls: ['./detail-search.component.css'],
})
export class DetailSearchComponent implements OnInit, OnDestroy {
  idEquipment: number;
  detailSearch: SearchEngineDTO;
  _onDestroy$: Subject<Boolean> = new Subject<Boolean>();
  userInfo: UserDataDTO = <UserDataDTO>{};
  imageData: any;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly userService: UserDataService,
    private readonly toastr: ToastrService,
    private readonly searchEngineDataService: SearchEngineDataService
  ) {
    const equipmentId = Number(this.route.snapshot.paramMap.get('equipmentId'));
    this.idEquipment = equipmentId;

    this.searchEngineDataService
      .getDataById(equipmentId)
      .pipe(takeUntil(this._onDestroy$))
      .subscribe((response) => {
        if (response.searchEngineData == null) {
          Swal.fire('Oops!', 'What are you looking for?', 'error');
          this.router.navigate(['/search-engine-apu-stand']);
        }
      });
  }

  getUserInfo(): void {
    this.userService
      .getUser()
      .pipe(takeUntil(this._onDestroy$))
      .subscribe((response) => (this.userInfo = response.body));
  }

  toExternalURL(url: string): void {
    if (!url.match(/^http?:\/\//i) || !url.match(/^https?:\/\//i)) {
      url = 'http://' + url;
    }

    window.open(url, '_blank');
  }

  addRequest(equipmentId: number): void {
    this.router.navigate(['/request-form/add/', equipmentId]);
  }

  detailHome(requestId: number): void {
    this.router.navigate(['/home/details', requestId]);
  }

  defaultPhoto(event: any) {
    event.target.src = '../../../assets/images/image-default.jpg';
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
  }

  initData(): void {
    this.searchEngineDataService
      .getDataById(this.idEquipment)
      .pipe(
        tap((response) => {
          response.searchEngineData['overall'] = Math.round(
            (response.searchEngineData.pmiData[0].pmiAggregate.aggregate.sum
              .actualValue /
              response.searchEngineData.pmiData[0].pmiAggregate.aggregate.sum
                .idealValue) *
              100
          );
        }),
        takeUntil(this._onDestroy$)
      )
      .subscribe((response) => {
        this.detailSearch = response.searchEngineData;
        this.imageData =
          environment.apiMedia +
          '/preview/' +
          response.searchEngineData.imagePath +
          '?full_size=true';
      });
  }
}
