import { Directive, ElementRef, Input } from '@angular/core';


@Directive({
  selector: '[bgColor]'
})
export class BgColorDirective {
    @Input('bgColor') color: string;
    constructor(el: ElementRef) {
        el.nativeElement.style.backgroundColor = 'yellow';
        // el.nativeElement.style.border = '2 px solid rgba(0,0,0,.54)!important';
    }
}
