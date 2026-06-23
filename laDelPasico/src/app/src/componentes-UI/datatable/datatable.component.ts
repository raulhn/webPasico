import {
  Component,
  Input,
  EventEmitter,
  Output,
  input,
  effect,
  signal,
  WritableSignal,
} from '@angular/core';
import { Constantes } from '../../logica/constantes';

@Component({
  selector: 'app-datatable',
  templateUrl: './datatable.component.html',
  styleUrl: './datatable.component.css',
  standalone: false,
})
export class DatatableComponent {}
