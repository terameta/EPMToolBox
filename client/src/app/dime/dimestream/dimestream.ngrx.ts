import { AppState } from '../../ngstore/models';
import { DimeStreamBackend } from './dimestream.backend';
import { Actions, Effect } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { DimeStream } from '../../../../../shared/model/dime/stream';
import * as _ from 'lodash';


