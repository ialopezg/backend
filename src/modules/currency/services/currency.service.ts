import { Component } from '@ialopezg/corejs';

import { Currency } from '../../../models';

@Component()
export class CurrencyService {
  async getCurrencies(): Promise<any[]> {
    return new Promise((resolve) => {
      Currency.find((error: any, currencies: any[]) => {
        if (error) {
          console.log(error);
          throw new Error(error.toString());
        }

        resolve(currencies);
      });
    });
  }

  async getCurrencyByCode(code: string): Promise<any> {
    return new Promise((resolve) => {
      Currency.findOne({ code }, (error: any, currency: any) => {
        if (error) {
          console.log(error);
          throw new Error(error.toString());
        }

        resolve(currency);
      });
    });
  }
}
