import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { Header } from "../../../layout/header/header.component";

@Component({
  selector: 'Hero',
  standalone: true,
  imports: [CommonModule, Header],
  templateUrl: './hero.componet.html'
})
export class Hero {
}