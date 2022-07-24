import { Controller, RequestMapping } from '@ialopezg/corejs';
import { Request, Response } from 'express';

import { getPath } from '../../../common/utils';
import { CurrencyService } from '../../currency/services';
import { ProductService } from '../../product/services';

@Controller({ path: '/' })
export class PreferenceController {
  constructor(
    private readonly productService: ProductService,
    private readonly currencyService: CurrencyService,
  ) {
  }

  @RequestMapping({ path: 'config' })
  async getConfig(request: Request, response: Response): Promise<void> {
    const currency = await this.currencyService.getCurrencyByCode('USD');

    response.json({
      urls: {
        base: {
          productImageUrl: this.productService.getImagePath(),
          productThumbnailUrl: this.productService.getImagePath(true),
          brandImageUrl: getPath('brand'),
          customerImageUrl: getPath('customer'),
          bannerImageUrl: getPath('banner'),
          categoryImageUrl: getPath('category'),
          reviewImageUrl: getPath('review'),
          sellerImageUrl: getPath('seller'),
          shopImageUrl: getPath('shop'),
          notificationImageUrl: getPath('notification'),
        },
        static: {
          about: 'about',
          faq: 'faq',
          tos: 'tos',
          contact: 'contact',
          brands: 'brands',
          categories: 'categories',
          account: 'account',
        },
      },
      currencies: await this.currencyService.getCurrencies(),
      languages: [{ name: 'English', code: 'en-US' }],
      language: 'en-US',
      currency,
    });
  }
}
