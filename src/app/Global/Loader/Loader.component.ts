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

  // Función simple para manejar rutas de assets en producción
  getAssetUrl(path: string): string {
    // En desarrollo: http://localhost:4200/assets/...
    // En producción: https://domain.com/interamericana/assets/...
    return path;
  }
}
