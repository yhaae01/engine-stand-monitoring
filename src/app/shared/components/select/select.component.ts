/* eslint-disable @angular-eslint/no-input-rename */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SelectionListInterface } from './select.interface';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.css']
})
export class SelectComponent implements OnInit {

  selectedValue: string = '';

  @Input('selection-list')
  selectionList: Array<any | SelectionListInterface> = [''];

  @Input()
  selected: any = '';

  @Input()
  placeholder: string = 'Selection';

  @Input('selection-class')
  selectionClass: string = '';

  @Output()
  selectedChange: EventEmitter<any> = new EventEmitter<any>();

  isChildShow: boolean = false;

  constructor() { }

  ngOnInit(): void {
    this.isChildShow = false;
    if (this.selected === '' || this.selected === null || this.selected === undefined || this.selected === 0) {
      this.selected = 'Select';
    }
  }

  toggleChild() {
    this.isChildShow = !this.isChildShow;
  }

  onChildSelected(value: SelectionListInterface) {
    this.selected = value.key;
    this.selectedValue = value.value;
    this.selectedChange.emit(value.key);
    this.toggleChild();
  }


  onBlur(event:any) {
    this.isChildShow = false;
  }

}
