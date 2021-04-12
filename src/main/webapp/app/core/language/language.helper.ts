import {Injectable, Renderer2, RendererFactory2} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {ActivatedRouteSnapshot, Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';

import {LANGUAGES} from 'app/core/language/language.constants';

@Injectable({ providedIn: 'root' })
export class JhiLanguageHelper {

  private readonly renderer: Renderer2 = null;

  constructor(
    private readonly translateService: TranslateService,
    private readonly titleService: Title,
    private readonly router: Router,
    rootRenderer: RendererFactory2
  ) {
      this.renderer = rootRenderer.createRenderer(document.querySelector('html'), null);
      this.init();
  }

  getAll(): string[] {
      return LANGUAGES;
  }

  /**
   * Update the window title using params in the following
   * order:
   * 1. titleKey parameter
   * 2. $state.$current.data.pageTitle (current state page title)
   * 3. 'global.title'
   */
  updateTitle(titleKey?: string) {
      if (!titleKey) {
          titleKey = this.getPageTitle(this.router.routerState.snapshot.root);
      }

      this.translateService.get(titleKey).subscribe((title) => {
          this.titleService.setTitle(title);
      });
  
  }

  private init() {
      this.translateService.onLangChange.subscribe(() => {
          this.renderer.setAttribute(document.querySelector('html'), 'lang', this.translateService.currentLang);
          this.updateTitle();
      });
  }

  private getPageTitle(routeSnapshot: ActivatedRouteSnapshot) {
      let title: string = routeSnapshot.data && routeSnapshot.data.pageTitle ? routeSnapshot.data.pageTitle : 'sgmSystem';
      if (routeSnapshot.firstChild) {
          title = this.getPageTitle(routeSnapshot.firstChild) || title;
      }
      return title;
  }
}
