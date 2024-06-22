import { BehaviorSubject } from 'rxjs';

export interface ModalPropsInterface {
  isModalShowed: boolean;
}

export class ModalService {
  modalTitle: string = '';

  public modalprops$ = new BehaviorSubject<ModalPropsInterface>({
    isModalShowed: false,
  });

  openModal() {
    this.modalprops$.next({
      ...this.modalprops$.value,
      isModalShowed: true,
    });
  }
  closeModal() {
    this.modalprops$.next({
      ...this.modalprops$.value,
      isModalShowed: false,
    });
  }
}
