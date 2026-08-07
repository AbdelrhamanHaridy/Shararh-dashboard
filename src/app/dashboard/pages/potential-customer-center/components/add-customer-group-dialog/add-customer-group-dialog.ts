import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

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
export class AddCustomerGroupDialog implements OnDestroy {
  maxFiles = 3;
  allowedTypes = 'pdf , word , png , jpg , jpeg, excel';

  files: UploadFile[] = [];

  isDraggingOver = false;
  private nextId = 3;
  private intervals = new Map<number, ReturnType<typeof setInterval>>();

  get uploadingFile(): UploadFile | undefined {
    return this.files.find((file) => !file.completed);
  }

  get completedFiles(): UploadFile[] {
    return this.files.filter((file) => file.completed);
  }

  get remainingSlots(): number {
    return Math.max(0, this.maxFiles - this.files.length);
  }

  onBrowseClick(fileInput: HTMLInputElement): void {
    fileInput.click();
  }

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.addFiles(input.files);
      input.value = '';
    }
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
    if (event.dataTransfer?.files) {
      this.addFiles(event.dataTransfer.files);
    }
  }

  private addFiles(fileList: FileList): void {
    const availableSlots = this.remainingSlots;
    Array.from(fileList)
      .slice(0, availableSlots)
      .forEach((file) => this.startUpload(file.name));
  }

  private startUpload(name: string): void {
    const uploadFile: UploadFile = { id: this.nextId++, name, progress: 0, completed: false };
    this.files.push(uploadFile);

    // Show progress immediately after selecting/dropping a file.
    this.advanceProgress(uploadFile);

    const interval = setInterval(() => {
      this.advanceProgress(uploadFile);

      if (uploadFile.completed) {
        clearInterval(interval);
        this.intervals.delete(uploadFile.id);
      }
    }, 250);

    this.intervals.set(uploadFile.id, interval);
  }

  private advanceProgress(uploadFile: UploadFile): void {
    uploadFile.progress = Math.min(100, uploadFile.progress + 15);
    if (uploadFile.progress >= 100) {
      uploadFile.completed = true;
    }
  }

  removeFile(file: UploadFile): void {
    const interval = this.intervals.get(file.id);
    if (interval) {
      clearInterval(interval);
      this.intervals.delete(file.id);
    }
    this.files = this.files.filter((f) => f.id !== file.id);
  }

  onClose(): void {
    // TODO: close dialog
  }

  onUploadFiles(): void {
    console.log('Submitting files', this.completedFiles);
    // TODO: send completed files to the API
  }

  ngOnDestroy(): void {
    this.intervals.forEach((interval) => clearInterval(interval));
    this.intervals.clear();
  }
}
