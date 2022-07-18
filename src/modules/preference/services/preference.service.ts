import { Component, HttpStatus } from '@ialopezg/corejs';

import { ValidationException } from '../../../common/exceptions';
import { Response } from '../../../common/interfaces';
import { getValue, parseValue, validate } from '../../../common/utils';
import { CreatePreferenceDto, UpdatePreferenceDto } from '../dtos';
import { defaultValues, Preference } from '../entities';

@Component()
export class PreferenceService {
  private static preferences: { [key: string]: any } = defaultValues;

  async createDefaultValues(values: { [key: string]: any } = defaultValues): Promise<void> {
    if (!(await this.empty())) {
      return;
    }

    for (const key of Object.keys(values)) {
      await this.createPreference({
        key,
        value: JSON.stringify(values[key]),
      });
    }
    console.log('Default preferences have been initiated');
  }


  async empty(): Promise<boolean> {
    const count = await Preference.countDocuments({});

    return count <= 0;
  }

  async createPreference(
    createPreferenceDto: CreatePreferenceDto,
  ): Promise<Response> {
    // validate errors
    const errors = await validate(createPreferenceDto, CreatePreferenceDto);
    if (errors) {
      throw new ValidationException(errors);
    }

    // try to store the preference
    const preference = await Preference.create(createPreferenceDto);

    // return the result
    return {
      data: { preference },
      message: 'Preference creation successful',
      status: HttpStatus.CREATED,
    };
  }

  async getPreference(
    options: Partial<{ uuid: string; key: string }>,
    coincidence = false,
    exactMatch = true,
  ): Promise<any> {
    // Get simple comparison result
    if (!coincidence) {
      const key = Object.keys(options).shift();
      const value = options[key];

      // Otherwise compare first options key value
      return Preference.findOne({
        [key]: exactMatch ? value : new RegExp(`^${value}$`, 'i'),
      });
    }

    // Get options keys
    const keys = Object.keys(options);
    // If coincidence and keys length equals 1, return non-coincidence and exact match
    if (keys.length > 0 && keys.length < 2) {
      return this.getPreference(options);
    }

    // If keys length > 1 make coincidence search
    const filters = [];
    keys.forEach((key: string) => {
      filters.push({
        [key]: exactMatch ? options[key] : new RegExp(`^${options[key]}$`, 'i'),
      });
    });

    return Preference.findOne({ $or: filters });
  }

  async getValue(key: string, defaultValue?: any): Promise<any> {
    // divide key pieces
    const keys = key.split('.');
    // get main key, the key before first dot
    const keyName = keys.shift();
    // search mainKey value
    const preference = await this.getPreference({ key: keyName });
    // if no preference for main key
    if (!preference) {
      // and default value provide
      if (defaultValue) {
        await this.setValue(keyName, defaultValue);

        // return default value
        return defaultValue;
      }

      // else return null
      return null;
    }
    // if main key value found but no more dot-notation keys
    if (keys.length === 0) {
      // return the main key value decoded
      return JSON.parse(preference.value);
    }
    const subKeyName = key.substring(keyName.length + 1);
    // parse current preference value from JSON notation to object
    const currentValue = JSON.parse(preference.value);
    // search key requested into current main key value
    let value = getValue(subKeyName, currentValue);
    // if not property required
    if (!value) {
      if (defaultValue) {
        // parse default value to object
        defaultValue = parseValue(subKeyName, defaultValue ?? getValue(key, defaultValues));
        value = Object.assign(currentValue, defaultValue);
        await this.setValue(keyName, value, preference);

        return value;
      }

      return null;
    }

    // else return main key value stored in database.
    return value;
  }

  async setValue(key: string, value: any, preference?: any) {
    value = JSON.stringify(value);
    if (!preference) {
      return this.createPreference({
        key,
        value,
      });
    }

    return this.updatePreference(preference.id, {
      value,
    });
  }

  async updatePreference(
    uuid: any,
    updatePreferenceDto: UpdatePreferenceDto,
  ): Promise<Response> {
    // Data validation
    const errors = await validate(updatePreferenceDto, UpdatePreferenceDto);
    if (errors) {
      throw new ValidationException(errors);
    }

    const preference = await Preference.findByIdAndUpdate(
      uuid,
      updatePreferenceDto,
    );

    return {
      data: { preference },
      message: 'Preference updated successful',
      status: HttpStatus.OK,
    };
  }
}
