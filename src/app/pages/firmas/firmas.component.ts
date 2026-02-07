import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Formulario_firmaComponent } from '../../components/formularioFirmas/formulario_firmas';

@Component({
  selector: 'app-firmas',
  standalone: true,
  imports: [CommonModule, Formulario_firmaComponent],
  templateUrl: './firmas.component.html',
  styleUrls: ['./firmas.component.css']
})
export class FirmasComponent implements OnInit {
  
  ngOnInit() {
    // El componente de formulario maneja la lógica
  }
}
