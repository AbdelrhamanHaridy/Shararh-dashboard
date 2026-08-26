import { Component, inject, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import {
  PotentialCustomerCenterExcelService,
  ParsedLeadRow,
} from '../../services/potential-customer-center-excel.service';
import { PotentialCustomerCenterService } from '../../services/potential-customer-center.service';
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
      this.errorMessage.set('تعذر إنشاء القالب');
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
      this.errorMessage.set('الملفات المسموحة: xlsx فقط');
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
      this.errorMessage.set(err?.message ?? 'تعذر قراءة الملف');
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
        this.ref.close({ success: true, data: response, count: this.parsedLeads.length });
      },
      error: (err) => {
        console.error('Import failed:', err);
        this.stage.set('error');
        this.errorMessage.set(err?.error?.message ?? 'تعذر استيراد الملف، يرجى المحاولة مرة أخرى');
      },
    });
  }

  onClose(): void {
    this.ref.close();
  }
}
