import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.css']
})
export class SearchResultComponent  {

  // constructor(private _articleService: ArticleService, private _route: ActivatedRoute,) { }
  // searchText: String;
  // errorMessage: string;
  // articles: IArticle[];

  // ngOnInit() {
  //    this._route.params.subscribe(params => {
  //      this.doInit(params['q']);
  //   });
  // }

  //  doInit(searchText: string): void {
  //    this.searchText = searchText;
  //    this._articleService.getArticleByText(this.searchText)
        // .pipe(take(1)).subscribe(articles => this.articles = articles, error => this.errorMessage = <any>error);
  // }

}
