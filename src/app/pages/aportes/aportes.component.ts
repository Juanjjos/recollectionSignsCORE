import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-aportes',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './aportes.component.html',
  styleUrls: ['./aportes.component.css']
})
export class AportesComponent implements OnInit {
  showDonationModal = false;
  copied = false;
  copiedPhone = false;
  accountNumber = '123456789012'; // Reemplaza con el número real
  phoneNumber = '3001234567'; // Reemplaza con el número real
  // Nu donation key
  nuKey = '@PRC819';
  // Link to open Nu donation page (configurable)
  nuLink = 'https://www.nu.com/';
  copiedNu = false;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    const donate = this.route.snapshot.queryParamMap.get('donate');
    if (donate === 'true') {
      this.openDonationModal();
      // quitar el parámetro para evitar reabrir el modal al refrescar
      this.router.navigate([], { relativeTo: this.route, queryParams: { donate: null }, queryParamsHandling: 'merge', replaceUrl: true });
    }
  }

  openDonationModal() {
    this.showDonationModal = true;
    document.body.style.overflow = 'hidden';
  }

  closeDonationModal() {
    this.showDonationModal = false;
    document.body.style.overflow = 'auto';
    this.copied = false;
    this.copiedPhone = false;
  }

  copyAccountNumber() {
    navigator.clipboard.writeText(this.accountNumber).then(() => {
      this.copied = true;
      setTimeout(() => {
        this.copied = false;
      }, 2000);
    }).catch(err => console.error('Copy failed', err));
  }

  copyPhoneNumber() {
    navigator.clipboard.writeText(this.phoneNumber).then(() => {
      this.copiedPhone = true;
      setTimeout(() => {
        this.copiedPhone = false;
      }, 2000);
    }).catch(err => console.error('Copy failed', err));
  }

  copyNuKey() {
    navigator.clipboard.writeText(this.nuKey).then(() => {
      this.copiedNu = true;
      setTimeout(() => {
        this.copiedNu = false;
      }, 2000);
    }).catch(err => console.error('Copy failed', err));
  }
}