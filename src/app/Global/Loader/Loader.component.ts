import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../../Services/loader.service';

@Component({
  selector: 'app-loader',
  templateUrl: './Loader.component.html',
  styleUrls: ['./Loader.component.scss']
})
export class LoaderComponent implements OnInit {
  loading: boolean = false;

  constructor(private loaderService: LoaderService) {}

  ngOnInit() {
    this.loaderService.loading$.subscribe(
      (loading) => {
        this.loading = loading;
      }
    );
  }
}
