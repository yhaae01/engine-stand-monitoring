import { Component, Input, OnInit } from '@angular/core';
import { ModalSize } from './modal.size';
@Component({
  selector: 'app-modal[title][idSelector]',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})

export class ModalComponent implements OnInit {

  @Input() size: ModalSize = 'lg';
  @Input() title: string = '';
  @Input() idSelector: string = '';
  @Input() modalName: string = 'sm';

  modalSize: string = 'md';

  constructor() {

  }

  ngOnInit(): void {
    this.getModalSize();
  }

  getModalSize(): void {
    switch(this.size) {
      case 'sm':
        this.modalSize = 'sm';
        break;
      case 'md':
        this.modalSize = 'md';
        break;
      case 'lg':
        this.modalSize = 'lg';
        break;
      case 'xl':
        this.modalSize = 'xl';
        break
      default:
        this.size = 'md';
    }
  }
}