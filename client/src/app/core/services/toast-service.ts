import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor() {
    this.createToastContainer();
  }

  public success(message: string, duration?: number): void {
    this.createToastElement(message, 'alert-success', duration);
  }

  public error(message: string, duration?: number): void {
    this.createToastElement(message, 'alert-error', duration);
  }

  public warning(message: string, duration?: number): void {
    this.createToastElement(message, 'alert-warning', duration);
  }

  public info(message: string, duration?: number): void {
    this.createToastElement(message, 'alert-info', duration);
  }

  private createToastContainer(): void {
    if (!document.getElementById('toast-container')) {
      const container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast toast-bottom toast-end';
      document.body.appendChild(container);
    }
  }

  private createToastElement(
    message: string,
    alertClass: string,
    duration = 5000
  ): void {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
      return;
    }

    const toast = document.createElement('div');
    toast.classList.add('alert', alertClass, 'shadow-lg');
    toast.innerHTML = `
      <span>${message}</span>
      <button class="ml-4 btn btn-sm btn-ghost">x</button>  
    `;

    toast.querySelector('button')?.addEventListener('click', () => {
      toastContainer.removeChild(toast);
    });

    toastContainer.appendChild(toast);

    setTimeout(() => {
      if (toastContainer.contains(toast)) {
        toastContainer.removeChild(toast);
      }
    }, duration);
  }
}
