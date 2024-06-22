import { Component, Input, OnInit } from '@angular/core';
import { HeroIconName } from 'ng-heroicon';
import { ButtonColor } from './interfaces/button-color.interface';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit{

  public buttonColor = ButtonColor;

  @Input() size: string = 'small';
  @Input() color: string = 'primary';
  @Input() round: string = 'small';
  @Input() icon?: HeroIconName;
  @Input() customStyle?: string;
  @Input() customHeroStyle?: string;
  @Input() outline: boolean = false;

  // CSS Class
  colorClass: string = "";
  sizeClass: string = "";
  roundClass: string = "";
  heroStyle: string = "";
  heroContainer: string = "";

  // End of CSS Class

  constructor() { }
  
  onClick(): void {
  }

  ngOnInit(): void {

    this.setRound();
    this.setSize();
    this.setColor();
  }

  setRound(): void{
    switch(this.round){
      case 'small' : {
        this.roundClass = " rounded-sm "
        break
      }
      case 'medium' : {
        this.roundClass = " rounded-md "
        break
      }
      case 'large' : {
        this.roundClass = " rounded-lg "
        break
      }
      case 'extra-large' : {
        this.roundClass = " rounded-2xl "
        break
      }
      case 'full' : {
        this.roundClass = " rounded-full "
        break
      }
      default: {
        this.roundClass = " rounded-md "
        break;
      }
    }
  }

  setSize(): void{
    switch(this.size){
      case 'medium' : {
        this.sizeClass = "px-4 py-1 h-10 w-12 text-sm w-auto ";
        this.heroContainer = "pr-2";
        this.heroStyle = "h-5 w-5";
        break
      }
      case 'large' : {
        this.sizeClass = "px-6 py-1 h-14 w-auto";
        this.heroContainer = "pr-4";
        this.heroStyle = "h-6 w-6";
        break
      }
      case 'full' : {
        this.sizeClass = "px-4 py-2 text-lg w-full"
        this.heroContainer = "pr-1";
        this.heroStyle = "h-6 w-6";
        break
      }
      case 'small' : {
        this.sizeClass = "px-2 h-6 w-16 text-xs w-auto"
        this.heroContainer = "pr-1";
        this.heroStyle = "h-4 w-4";
        break
      }
      default: {

        this.sizeClass = "px-4 py-1 h-10 w-12 text-sm w-auto ";
        this.heroContainer = "pr-2";
        this.heroStyle = "h-5 w-5";
        break;
      }
    }
  }
  
  setColor(): void {
    switch(this.color) {
      case 'primary': {
        this.colorClass = "bg-dbx-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded";
        this.heroStyle = this.heroStyle+" text-dbx-neutral-50"
        break;
      }
      case 'secondary': {
        this.colorClass = "bg-dbx-neutral-50 hover:bg-dbx-neutral-100 font-jakarta text-dbx-neutral-800 border border-dbx-neutral-800 ";
        this.heroStyle = this.heroStyle+" text-dbx-neutral-700"
        break;
      }
      case 'warning': {
        this.colorClass = "bg-dbx-warning-500 hover:bg-dbx-warning-600 font-jakarta text-dbx-neutral-800 ";
        this.heroStyle = this.heroStyle+" text-dbx-neutral-700"
        break;
      }
      case 'error': {
        this.colorClass = "bg-dbx-error-600 hover:bg-dbx-error-500 font-jakarta text-dbx-neutral-50 ";
        this.heroStyle = this.heroStyle+" text-dbx-neutral-50"
        break;
      }
      case 'success': {
        this.colorClass = "bg-dbx-green-500 hover:bg-dbx-green-600 font-jakarta text-dbx-neutral-50 ";
        this.heroStyle = this.heroStyle+" text-dbx-neutral-50"
        break;
      }
      default: {
        this.colorClass = "bg-dbx-blue-500 hover:bg-dbx-blue-600 font-jakarta text-dbx-neutral-50 ";
        this.heroStyle = this.heroStyle+" text-dbx-neutral-50"
        break;
      }
    }
  }


}

