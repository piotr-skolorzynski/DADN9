import { Component, input, output, signal } from '@angular/core';

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.html',
})
export class ImageUpload {
  public loading = input.required<boolean>();
  public uploadFile = output<File>();

  protected imageSrc = signal<string | ArrayBuffer | null | undefined>(null);
  protected isDragging = false;

  private fileToUpload: File | null = null;

  public onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  public onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  public onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    if (event.dataTransfer?.files.length) {
      const file = event.dataTransfer.files[0];
      this.previewImage(file);
      this.fileToUpload = file;
    }
  }

  public onCancel(): void {
    this.fileToUpload = null;
    this.imageSrc.set(null);
  }

  public onUploadFile(): void {
    if (this.fileToUpload) {
      this.uploadFile.emit(this.fileToUpload);
    }
  }

  private previewImage(file: File): void {
    const reader = new FileReader();
    reader.onload = e => this.imageSrc.set(e.target?.result);
    reader.readAsDataURL(file);
  }
}
