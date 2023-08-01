import { Component, Input } from '@angular/core';

@Component({
  selector: 'jiki-editable-input',
  templateUrl: './editable-input.component.html',
  styleUrls: ['./editable-input.component.css']
})
export class EditableInputComponent {
  @Input() text: string;
  @Input() name: string;

}
