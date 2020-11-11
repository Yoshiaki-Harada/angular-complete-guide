import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'exercise5';
  loadFeature ='others'

  onNavigate(feature: string) {
    this.loadFeature=feature
  }
}
