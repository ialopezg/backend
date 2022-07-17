import { Component, HttpStatus } from '@ialopezg/corejs';

import { ValidationException } from '../../../common/exceptions';
import { Response } from '../../../common/interfaces';
import { getValue, parseValue, validate } from '../../../common/utils';
import { CreatePreferenceDto, UpdatePreferenceDto } from '../dtos';
import { defaultValues, Preference } from '../entities';

@Component()
export class PreferenceService {
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

      // If uuid get result by id
      if (key === 'uuid') {
        return Preference.findById(options.uuid);
      }

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

  async getValue(key: string): Promise<any> {
    // get main key, the key before first dot
    const keyName = key.split('.').shift();
    const subKeyName = key.substring(keyName.length + 1);

    let preference = await this.getPreference({ key: keyName });
    if (!preference) {
      // search default value
      const defaultValue = parseValue(subKeyName, getValue(key, defaultValues));
      const value = JSON.stringify(defaultValue);
      const { data, error: error } = await this.createPreference({
        key: keyName,
        value,
      });
      // set preference
      preference = !error && data.preference;
    }

    // parse preference value from JSON notation to object
    const result = getValue(subKeyName, JSON.parse(preference.value));
    // if not property required
    if (!result) {
      // search default value
      const defaultValue = parseValue(subKeyName, getValue(key, defaultValues));
      // parse stored values
      const currentValue = JSON.parse(preference.value);
      // combine stored and default values
      const value = JSON.stringify(Object.assign(currentValue, defaultValue));
      // update preference new value
      const { data, error: error } = await this.updatePreference(preference.id, {
        value,
      });
      // set preference
      preference = !error && data.preference;
    }

    // finally return from recently preference updated
    return getValue(subKeyName, JSON.parse(preference.value));
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
