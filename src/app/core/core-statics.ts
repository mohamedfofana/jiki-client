import { SearchResultComponent } from './search/search-result/search-result.component';
import { FooterComponent } from './layout/footer/footer.component';
import { LeftMenuComponent } from './layout/left-menu/left-menu.component';
import { TopMenuComponent } from './layout/top-menu/top-menu.component';
export class CoreStatics {
  static components = [      TopMenuComponent,
    LeftMenuComponent,
    FooterComponent,
    SearchResultComponent]
}
