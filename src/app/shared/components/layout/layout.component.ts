import { Component, ViewChild } from '@angular/core';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { Subject, takeUntil } from 'rxjs';
import { UserDataDTO } from 'src/app/core/dto/user-data.dto';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReviewService } from 'src/app/core/services/review.service';
import { ToastrService } from 'ngx-toastr';
import { UserDataService } from 'src/app/core/services/user-data.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
})
export class LayoutComponent {
  @ViewChild('closeFeedbackModal') closeModal;

  _onDestroy$: Subject<Boolean> = new Subject<Boolean>();
  currentUser: UserDataDTO = <UserDataDTO>{};
  feedbackForm: FormGroup;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly reviewService: ReviewService,
    private readonly userService: UserDataService,
    private readonly toastr: ToastrService,
    private iconLibrary: FaIconLibrary
  ) {
    iconLibrary.addIconPacks(fas, far);
  }

  ngOnInit(): void {
    this.feedbackForm = this.formBuilder.group({
      rate: [5, Validators.required],
      review: ['', Validators.required],
      scope: ['', Validators.nullValidator],
    });

    this.getUserInfo();
  }

  getUserInfo(): void {
    this.userService
      .getUser()
      .pipe(takeUntil(this._onDestroy$))
      .subscribe((response) => (this.currentUser = response.body));
  }

  submitFeedback(): void {
    const requestBody = {
      app: 'engine-stand',
      personal_number: Number(this.currentUser.personalNumber),
      rating: this.feedbackForm.value.rate,
      review_text: this.feedbackForm.value.review,
      scope: this.feedbackForm.value.scope,
    };

    this.reviewService
      .sendFeedback(requestBody)
      .pipe(takeUntil(this._onDestroy$))
      .subscribe(
        (success) =>
          this.toastr.success('Your feedback has been sent', 'Success!'),
        (error) =>
          this.toastr.error('Something went wrong, nothing stored', 'Oops!')
      );

    this.closeModal.nativeElement.click();
  }

  resetFeedbackForm(): void {
    this.feedbackForm.reset();
    this.feedbackForm.patchValue({
      rate: 5,
      review: '',
      scope: '',
    });
  }

  onRatingChange(rate: number): void {
    this.feedbackForm.patchValue({
      rate: rate,
    });
  }

  ngOnDestroy(): void {
    this._onDestroy$.next(true);
    this._onDestroy$.unsubscribe();
  }

  sidebarOpenStatus: boolean = true;

  eventSidebar($event): void {
    this.sidebarOpenStatus = $event;
  }
}
