import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Footer } from '../footer/footer.component';

@Component({
  selector: 'app-store-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, Footer],
  templateUrl: './store-layout.component.html',
})

export class StoreLayoutComponent { }
