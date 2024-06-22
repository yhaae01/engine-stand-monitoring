import { OnDestroy, OnInit } from '@angular/core';
import { BaseComponentAbstract } from './base.component.abstract';

export interface BaseComponent extends OnInit, OnDestroy, BaseComponentAbstract {}
