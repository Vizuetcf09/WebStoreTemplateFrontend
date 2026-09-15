import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductInterface } from '../../../interfaces/products/products.interfaces';
import { ProductPayload, WebPageProductsService } from '../../../services/webPageProducts.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './admin-products.component.html'
})
export class AdminProductsComponent implements OnInit {
  private productsService = inject(WebPageProductsService);
  private toast = inject(ToastService);
  private fb = inject(FormBuilder);

  products = signal<ProductInterface[]>([]);
  categories = signal<string[]>([]);
  loading = signal(false);
  saving = signal(false);
  viewMode = signal<'table' | 'grid'>('table');

  search = '';
  category = '';
  status = 'all';
  page = 1;
  limit = 8;
  total = 0;
  pages = 1;

  showForm = false;
  editingId: string | null = null;
  productToDelete: ProductInterface | null = null;

  form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0)]],
    costPrice: [0, [Validators.min(0)]],
    category: ['', Validators.required],
    stock: [0, [Validators.required, Validators.min(0)]],
    imageUrl: ['', Validators.required],
    images: [''],
    status: this.fb.nonNullable.control<'active' | 'inactive'>('active')
  });

  ngOnInit() {
    void this.loadProducts();
  }

  async loadProducts() {
    this.loading.set(true);
    try {
      const result = await this.productsService.getManagedProducts({
        search: this.search,
        category: this.category,
        status: this.status,
        page: this.page,
        limit: this.limit
      });
      this.products.set(result.items);
      this.categories.set(result.categories);
      this.total = result.total;
      this.pages = result.pages;
    } catch (error) {
      this.toast.error(this.readError(error, 'No se pudo cargar el catálogo interno'));
    } finally {
      this.loading.set(false);
    }
  }

  applyFilters() {
    this.page = 1;
    void this.loadProducts();
  }

  changePage(delta: number) {
    const next = this.page + delta;
    if (next < 1 || next > this.pages) return;
    this.page = next;
    void this.loadProducts();
  }

  openCreate() {
    this.editingId = null;
    this.form.reset({
      name: '',
      description: '',
      price: 0,
      costPrice: 0,
      category: '',
      stock: 0,
      imageUrl: '',
      images: '',
      status: 'active'
    });
    this.showForm = true;
  }

  openEdit(product: ProductInterface) {
    this.editingId = product.id;
    this.form.reset({
      name: product.name,
      description: product.description,
      price: product.price,
      costPrice: product.costPrice ?? 0,
      category: product.category,
      stock: product.stock,
      imageUrl: product.imageUrl,
      images: (product.images || []).join('\n'),
      status: product.status === 'inactive' ? 'inactive' : 'active'
    });
    this.showForm = true;
  }

  closeForm() {
    this.showForm = false;
    this.editingId = null;
  }

  async saveProduct() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toast.error('Completa los campos obligatorios');
      return;
    }

    const value = this.form.getRawValue();
    const extraImages = value.images
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean);

    const payload: ProductPayload = {
      name: value.name.trim(),
      description: value.description.trim(),
      price: Number(value.price),
      costPrice: Number(value.costPrice) || 0,
      category: value.category.trim(),
      stock: Number(value.stock),
      imageUrl: value.imageUrl.trim(),
      images: extraImages.length ? extraImages : [value.imageUrl.trim()],
      status: value.status
    };

    this.saving.set(true);
    try {
      if (this.editingId) {
        await this.productsService.updateProduct(this.editingId, payload);
        this.toast.success('Producto actualizado');
      } else {
        await this.productsService.createProduct(payload);
        this.toast.success('Producto creado');
      }
      this.closeForm();
      this.productsService.loadWebPageProducts();
      await this.loadProducts();
    } catch (error) {
      this.toast.error(this.readError(error, 'No se pudo guardar el producto'));
    } finally {
      this.saving.set(false);
    }
  }

  confirmDelete(product: ProductInterface) {
    this.productToDelete = product;
  }

  async deleteProduct(hard = false) {
    if (!this.productToDelete) return;
    try {
      await this.productsService.deleteProduct(this.productToDelete.id, hard);
      this.toast.success(hard ? 'Producto eliminado' : 'Producto desactivado');
      this.productToDelete = null;
      this.productsService.loadWebPageProducts();
      await this.loadProducts();
    } catch (error) {
      this.toast.error(this.readError(error, 'No se pudo eliminar el producto'));
    }
  }

  async toggleStatus(product: ProductInterface) {
    const nextStatus = product.status === 'active' ? 'inactive' : 'active';
    try {
      await this.productsService.updateProduct(product.id, { status: nextStatus });
      this.toast.success(nextStatus === 'active' ? 'Producto activado' : 'Producto desactivado');
      await this.loadProducts();
    } catch (error) {
      this.toast.error(this.readError(error, 'No se pudo cambiar el estado'));
    }
  }

  statusLabel(status?: string) {
    if (status === 'inactive') return 'Inactivo';
    if (status === 'deleted') return 'Eliminado';
    return 'Activo';
  }

  private readError(error: unknown, fallback: string) {
    if (error instanceof HttpErrorResponse) {
      const details = error.error?.details?.[0]?.message;
      return details || error.error?.message || fallback;
    }
    return fallback;
  }
}
