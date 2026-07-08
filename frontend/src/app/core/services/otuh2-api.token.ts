import { EnvironmentProviders, InjectionToken, makeEnvironmentProviders } from '@angular/core';

import { Otuh2Api } from './otuh2-api.interface';
import { HttpOtuh2Api } from './http-otuh2-api.service';

export const OTUH2_API = new InjectionToken<Otuh2Api>('OTUH2_API');

export function provideOtuh2Api(): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: OTUH2_API,
      useClass: HttpOtuh2Api
    }
  ]);
}
