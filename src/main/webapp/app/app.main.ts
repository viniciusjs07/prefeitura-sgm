import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {ProdConfig} from './blocks/config/prod.config';
import {SGMAdminCoreAppModule} from './app.module';
import 'hammerjs';

ProdConfig();

if (module['hot']) {
    module['hot'].accept();
}

platformBrowserDynamic()
    .bootstrapModule(SGMAdminCoreAppModule, { preserveWhitespaces: true })
// eslint-disable-next-line no-console
    .then(() => console.log('Application started'))
    .catch((err) => console.error(err));
