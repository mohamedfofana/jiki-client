export function findEnumByValue(_enum: Object, _value: any){ 
    return Object.entries(_enum).find(([key, value]) => value === _value);   
}

export function findEnumValueByKey(_enum: Object, _key: any){ 
    return Object.entries(_enum).find(([key, value]) => key === _key)?.[0];   
}

export function findEnumKeyByValue(_enum: Object, _value: any){ 
    return Object.entries(_enum).find(([key, value]) => value === _value)?.[1];   
}

export function isEnumValue(_enum: Object, _value: any){ 
    return Object.values(_enum).includes(_value);   
}