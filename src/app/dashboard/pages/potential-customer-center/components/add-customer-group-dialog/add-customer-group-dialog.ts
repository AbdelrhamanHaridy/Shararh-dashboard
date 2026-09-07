import { Component, inject, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import {
  PotentialCustomerCenterExcelService,
  ParsedLeadRow,
} from '../../services/potential-customer-center-excel.service';
import { PotentialCustomerCenterService } from '../../services/potential-customer-center.service';
import { ToastService } from '../../../../shared/services/toast.service';
type ImportStage = 'idle' | 'parsing' | 'ready' | 'uploading' | 'error';

interface UploadFile {
  id: number;
  name: string;
  progress: number;
  completed: boolean;
}

@Component({
  selector: 'app-add-customer-group-dialog',
  imports: [CommonModule],
  templateUrl: './add-customer-group-dialog.html',
  styleUrl: './add-customer-group-dialog.scss',
})
export class AddCustomerGroupDialog {
  private excelService = inject(PotentialCustomerCenterExcelService);
  private potentialCustomerService = inject(PotentialCustomerCenterService);
  private toastService = inject(ToastService);
  public ref = inject(DynamicDialogRef);

  allowedTypes = 'xlsx';

  selectedFile: File | null = null;
  parsedLeads: ParsedLeadRow[] = [];
  stage = signal<ImportStage>('idle');
  errorMessage = signal('');
  isDraggingOver = false;

  isDownloadingTemplate = false;

  async downloadTemplate() {
    this.isDownloadingTemplate = true;
    try {
      await this.excelService.generateLeadsTemplate();
    } catch (err) {
      console.error('Template generation error:', err);
      const message = 'تعذر إنشاء القالب';
      this.errorMessage.set(message);
      this.toastService.error('فشل تحميل القالب', message);
    } finally {
      this.isDownloadingTemplate = false;
    }
  }

  onBrowseClick(fileInput: HTMLInputElement): void {
    fileInput.click();
  }

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) this.handleFile(file);
    input.value = '';
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDraggingOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDraggingOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDraggingOver = false;
    const file = event.dataTransfer?.files?.[0];
    if (file) this.handleFile(file);
  }

  private async handleFile(file: File): Promise<void> {
    if (!file.name.endsWith('.xlsx')) {
      this.stage.set('error');
      const message = 'الملفات المسموحة: xlsx فقط';
      this.errorMessage.set(message);
      this.toastService.error('ملف غير صالح', message);
      return;
    }

    this.selectedFile = file;
    this.stage.set('parsing');
    this.errorMessage.set('');

    try {
      this.parsedLeads = await this.excelService.parseLeadsFile(file);
      this.stage.set('ready');
    } catch (err: any) {
      this.stage.set('error');
      const message = err?.message ?? 'تعذر قراءة الملف';
      this.errorMessage.set(message);
      this.toastService.error('فشل قراءة الملف', message);
      this.selectedFile = null;
      this.parsedLeads = [];
    }
  }

  removeFile(): void {
    this.selectedFile = null;
    this.parsedLeads = [];
    this.stage.set('idle');
    this.errorMessage.set('');
  }

  onUploadFiles(): void {
    if (!this.selectedFile || this.parsedLeads.length === 0) return;

    this.stage.set('uploading');
    this.errorMessage.set('');

    const payload = {
      file: this.selectedFile.name,
      leads: this.parsedLeads,
    };

    this.potentialCustomerService.importLeads(payload).subscribe({
      next: (response) => {
        this.toastService.success('تم الاستيراد', 'تم استيراد العملاء المحتملين بنجاح');
        this.ref.close({ success: true, data: response, count: this.parsedLeads.length });
      },
      error: (err) => {
        console.error('Import failed:', err);
        this.stage.set('error');
        const message = err?.error?.message ?? 'تعذر استيراد الملف، يرجى المحاولة مرة أخرى';
        this.errorMessage.set(message);
        this.toastService.error('فشل الاستيراد', message);
      },
    });
  }

  onClose(): void {
    this.ref.close();
  }
}
