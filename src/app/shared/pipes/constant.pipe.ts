import { Pipe, PipeTransform } from '@angular/core';
import { ConstantType } from '../constants/constant.type';

@Pipe({ name: 'constantType' })
export class ConstantPipe implements PipeTransform {

  transform(_arr: ConstantType[], _code: string) {
    const obj =  _arr.find(t => t.code === _code);
    return obj? obj.value : '';
  }
}