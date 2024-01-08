import BaseMask from './_base.mask'
import CustomMask from './custom.mask'

// const PHONE_8_MASK = '99 99 99 99';
// const PHONE_9_MASK = '9 99 99 99 99';
const PHONE_INTERNATIONAL = '+999 999 999 999'

const MASKS = {
    8: '99 99 99 99',
    9: '9 99 99 99 99',
    10: '99 99 99 99 99',
    11: '9 99 99 99 99 99',
    // 12: '99 99 99 99 99 99',
    // 13: '9 99 99 99 99 99 99',
}

const MASK_TYPES = {
    BRL: 'BRL',
    INTERNATIONAL: 'INTERNATIONAL'
}

const CEL_PHONE_SETTINGS = {
    maskType: MASK_TYPES.BRL,
    withDDD: true,
    dddMask: '(99) '
}

export default class CelPhoneMask extends BaseMask {
    static getType() {
        return 'cel-phone'
    }

    getValue(value, settings) {
        let cleanedValue = super.removeNotNumbers(value)
        let mask = this.getMask(cleanedValue, settings)
        return CustomMask.shared.getValue(cleanedValue, { mask, reversed: settings ? settings.reversed : false })
    }

    getRawValue(maskedValue, settings) {
        return super.removeNotNumbers(maskedValue)
    }

    validate(value, settings) {
        let valueToValidate = super.getDefaultValue(value)
        valueToValidate = this.getValue(value, settings)

        let mask = this.getMask(value, settings)

        return valueToValidate.length === mask.length
    }

    getMask(value, settings) {
        let mergedSettings = super.mergeSettings(CEL_PHONE_SETTINGS, settings)

        if (mergedSettings.maskType === MASK_TYPES.INTERNATIONAL) {
            return PHONE_INTERNATIONAL
        }

        let numbers = super.removeNotNumbers(value)
        // let mask = PHONE_8_MASK
        let length;

        if (mergedSettings.digits > 0) {
            length = mergedSettings.digits;
        } else if (mergedSettings.withDDD) {
            let numbersDDD = super.removeNotNumbers(mergedSettings.dddMask)
            let remainingValueNumbers = numbers.substr(numbersDDD.length)
            length = Math.max(8, remainingValueNumbers.length);
        } else {
            length = Math.max(8, numbers.length);
        }
        if (length > 11) {
            length = 11;
        }

        let mask = MASKS[length]

        if (mergedSettings.withDDD) {
            mask = `${mergedSettings.dddMask}${mask}`
        }

        return mask
    }
}
