import { Injectable } from '@angular/core';
import { LocalStorageServiceInterface } from '../interfaces/localstorage.service.interface';
import * as Crypto from 'crypto-js';
import { environment } from 'src/environments/environment';
import collect, { Collection } from 'collect.js';

export class LocalstorageService implements LocalStorageServiceInterface{

  private _result: string = '';
  
  constructor() { }

  saveData(key: string, data: string): void {
    const _test = this.encrypt(data);
    localStorage.setItem(key, _test);
  }

  removeData(key: string): void {    
    localStorage.removeItem(key);
  }
  
  clearData(): void {
    localStorage.clear();
  }

  getData(key: string): this {
    const _data = localStorage.getItem(key) || '';
    this._result = this.decrypt(_data);
    return this;
  }

  toString(): string {
    return this._result as string;
  }

  toCollection<T>(): Collection<T> {
    const _temp = this._result !== undefined || this._result !== '' ? JSON.parse(this._result as string) : {}; 
    return collect(_temp);
  }

  toObject<T>(): T {
    return JSON.parse(this._result);
  }

  private encrypt(data: string): string {
    return Crypto.AES.encrypt(data, environment.localKey,).toString();
  }

  private decrypt(data: string): string {
    return Crypto.AES.decrypt(data, environment.localKey).toString(Crypto.enc.Utf8);
  }
}
