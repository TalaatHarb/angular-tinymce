import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { EditorComponent } from '@tinymce/tinymce-angular';
import { Editor } from 'tinymce';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, EditorComponent, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  content = '<p>This is the initial content of the document.</p>';
  pageHeightPx = 1122; // A4 height in pixels at 96 DPI
  setupEditor(editor: Editor) {
    editor.ui.registry.addButton('pagebreak', {
      text: 'Page Break',
      onAction: () => {
        editor.insertContent('<div style="page-break-after: always;"></div>');
      }
    });
  }

  onContentChange(event: any) {
    const editorBody = (document.querySelector('.tox-edit-area iframe') as any).contentDocument.body;
    const contentHeight = editorBody.scrollHeight;

    // Check if content exceeds A4 height
    if (contentHeight > this.pageHeightPx) {
      this.addPageBreak(editorBody);
    }
  }

  addPageBreak(editorBody: HTMLElement) {
    // Get the editor instance and add a page break if the content exceeds A4
    const paragraphs = editorBody.querySelectorAll('p');
    let currentHeight = 0;

    paragraphs.forEach((para, index) => {
      currentHeight += para.offsetHeight;
      if (currentHeight > this.pageHeightPx) {
        para.insertAdjacentHTML(
          'afterend',
          '<div style="page-break-after: always; border-bottom: 1px solid #ddd; margin-bottom: 20px;"></div>'
        );
        currentHeight = 0; // Reset height after page break
      }
    });
  }

  saveDocument() {
    console.log('Document saved:', this.content);
  }

  printDocument() {
    const printWindow = window.open('', '_blank') as Window;
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Document</title>
          <style>
            body { font-family: Arial, sans-serif; }
            @media print {
              div.page-break {
                page-break-after: always;
              }
            }
          </style>
        </head>
        <body>
          ${this.content}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  }
}
