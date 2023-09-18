import { ConstantType } from "src/app/shared/constants/constant.type";

export function findEnumByValue(_enum: Object, _value: any){ 
    return Object.entries(_enum).find(([key, value]) => value === _value);   
}

export function findEnumValueByKey(_enum: Object, _key: any): string{ 
    const valueIndex = Object.keys(_enum).indexOf(_key)

    return Object.values(_enum)[valueIndex];
}

export function findEnumKeyByValue(_enum: Object, _value: any): string{ 
    const keyIndex = Object.values(_enum).indexOf(_value)

    return Object.keys(_enum)[keyIndex];
}

export function isEnumValue(_enum: Object, _value: any): boolean{ 
    return Object.values(_enum).includes(_value);   
}

export function findConstantValueByCode(_arr: ConstantType[], _code: any): string{ 
    const obj =  _arr.find(t => t.code === _code);
    return obj? obj.value : '';
}