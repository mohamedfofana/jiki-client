import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { LoaderService } from '../services/loader/loader.service';

@Component({
  selector: 'jiki-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent implements OnInit {

  loading: boolean = false;
  constructor(private _loaderService: LoaderService, private _cdRef: ChangeDetectorRef) {
   
  }

  ngOnInit(): void {
    this.bindLoaderServiceStateToSpinnerState();
  }

  bindLoaderServiceStateToSpinnerState() {
      this._loaderService.getSub().subscribe(state => {
        this.loading = state;
        this._cdRef.detectChanges();
      }
    );
  }



}


