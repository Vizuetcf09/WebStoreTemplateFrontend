import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PrintfulProductInterface } from '../../../interfaces/printful/printful.interfaces';
import { WebPagePrintfulService } from '../../../services/webPagePrintful.service';
import { WebPageProductsService } from '../../../services/webPageProducts.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-admin-printful',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-printful.component.html'
})
export class AdminPrintfulComponent implements OnInit {
  private printfulService = inject(WebPagePrintfulService);
  private productsService = inject(WebPageProductsService);
  private toast = inject(ToastService);

  products = this.printfulService.printfulProductsSignal;
  loading = this.printfulService.loadingPrintfulProductsSignal;
  error = this.printfulService.printfulErrorSignal;
  configured = signal(false);
  storeIdConfigured = signal(false);
  selectedIds = signal<Set<number>>(new Set());
  expandedId = signal<number | null>(null);
  detail = signal<any>(null);
  detailLoading = signal(false);
  syncing = signal(false);
  category = 'Printful';
  markupPercent = 0;

  ngOnInit() {
    void this.loadStatus();
    this.printfulService.loadWebPagePrintfulProducts();
  }

  async loadStatus() {
    try {
      const response = await this.printfulService.getStatus();
      this.configured.set(Boolean(response.data?.configured));
      this.storeIdConfigured.set(Boolean(response.data?.storeIdConfigured));
    } catch {
      this.configured.set(false);
    }
  }

  refresh() {
    this.printfulService.loadWebPagePrintfulProducts();
  }

  toggleSelected(id: number) {
    const next = new Set(this.selectedIds());
    if (next.has(id)) next.delete(id);
    else next.add(id);
    this.selectedIds.set(next);
  }

  isSelected(id: number) {
    return this.selectedIds().has(id);
  }

  toggleAll() {
    if (this.selectedIds().size === this.products().length) {
      this.selectedIds.set(new Set());
      return;
    }
    this.selectedIds.set(new Set(this.products().map((item) => item.id)));
  }

  async toggleDetails(product: PrintfulProductInterface) {
    if (this.expandedId() === product.id) {
      this.expandedId.set(null);
      this.detail.set(null);
      return;
    }

    this.expandedId.set(product.id);
    this.detailLoading.set(true);
    try {
      const response = await this.printfulService.getProductDetail(product.id);
      this.detail.set(response.data);
    } catch (error) {
      this.toast.error(this.readError(error, 'No se pudieron cargar las variantes'));
      this.expandedId.set(null);
    } finally {
      this.detailLoading.set(false);
    }
  }

  async importOne(product: PrintfulProductInterface) {
    this.syncing.set(true);
    try {
      await this.printfulService.syncProduct(product.id, {
        category: this.category,
        markupPercent: this.markupPercent
      });
      this.toast.success(`${product.name} importado al catálogo local`);
      this.afterSync();
    } catch (error) {
      this.toast.error(this.readError(error, 'No se pudo importar el producto'));
    } finally {
      this.syncing.set(false);
    }
  }

  async importSelected() {
    const ids = [...this.selectedIds()];
    if (!ids.length) {
      this.toast.error('Selecciona al menos un producto');
      return;
    }

    this.syncing.set(true);
    try {
      const result = await this.printfulService.importSelected(ids, {
        category: this.category,
        markupPercent: this.markupPercent
      });
      this.toast.success(result.message || 'Productos importados');
      this.selectedIds.set(new Set());
      this.afterSync();
    } catch (error) {
      this.toast.error(this.readError(error, 'No se pudieron importar los productos seleccionados'));
    } finally {
      this.syncing.set(false);
    }
  }

  async syncAll() {
    this.syncing.set(true);
    try {
      const result = await this.printfulService.syncAll({
        category: this.category,
        markupPercent: this.markupPercent
      });
      this.toast.success(result.message || 'Catálogo sincronizado');
      this.afterSync();
    } catch (error) {
      this.toast.error(this.readError(error, 'Falló la sincronización con Printful'));
    } finally {
      this.syncing.set(false);
    }
  }

  statusLabel(status?: string) {
    if (status === 'synced') return 'Sincronizado';
    if (status === 'local-deleted') return 'Eliminado en local';
    return 'Pendiente';
  }

  private afterSync() {
    this.printfulService.loadWebPagePrintfulProducts();
    this.productsService.loadWebPageProducts();
  }

  private readError(error: unknown, fallback: string) {
    if (error instanceof HttpErrorResponse) {
      return error.error?.message || error.error?.error || fallback;
    }
    return fallback;
  }
}
