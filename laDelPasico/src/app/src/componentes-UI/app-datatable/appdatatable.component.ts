import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  input,
  InputSignal,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-appdatatable',
  standalone: false,
  templateUrl: './appdatatable.component.html',
  styleUrls: ['./appdatatable.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppDataTableComponent implements OnChanges {
  $lista: InputSignal<any> = input();
  $cabeceras: InputSignal<any> = input();
  $identificador: InputSignal<string> = input('');

  filteredData: any[] = []; // full filtered data

  // Pagination settings
  pageSize = 10;
  currentPage = 1;

  filterText = '';

  @Output() rowSelected = new EventEmitter<any>();

  selectedRow: any = null;

  selectRow(row: any): void {
    this.selectedRow = row;
    this.rowSelected.emit(row);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['$lista']) {
      this.applyFilter();
    }
  }

  comparaFila(row: any) {
    return JSON.stringify(row) === JSON.stringify(this.selectedRow)
  }

  sortData(col: string): void {
    if (this.sortColumn === col) {
      // toggle direction
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = col;
      this.sortDirection = 'asc';
    }
    this.applyFilter(); // reapply filter which will also sort
  }

  onFilterChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.filterText = input.value;
    this.applyFilter();
  }

  applyFilter(): void {
    const text = this.filterText?.toLowerCase() ?? '';
    if (!text) {
      this.filteredData = [...this.$lista()];
    } else {
      const normalize = (s: string) =>
        s.normalize('NFD').replace(/\p{Diacritic}/gu, '');
      this.filteredData = this.$lista().filter((row: any) =>
        Object.values(row).some((v) => {
          const str = typeof v === 'string' ? v : String(v);
          return normalize(str.toLowerCase()).includes(normalize(text));
        }),
      );
    }

    // Apply sorting after filtering
    if (this.sortColumn) {
      const col = this.sortColumn;
      const dir = this.sortDirection === 'asc' ? 1 : -1;
      this.filteredData.sort((a, b) => {
        const aVal = a[col];
        const bVal = b[col];
        if (typeof aVal === 'string' && typeof bVal === 'string') {
          return dir * aVal.localeCompare(bVal);
        }
        if (aVal < bVal) return -1 * dir;
        if (aVal > bVal) return 1 * dir;
        return 0;
      });
    }

    this.adjustCurrentPage();
  }

  // Sorting state
  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredData.length / this.pageSize));
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  // Sorting state
  sortColumn: string | null = null;
  sortDirection: 'asc' | 'desc' = 'asc';

  get pageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisible = 5;
    let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
    let end = start + maxVisible - 1;

    if (end > this.totalPages) {
      end = this.totalPages;
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  }

  get paginatedData(): any[] {
    const startIdx = (this.currentPage - 1) * this.pageSize;
    return this.filteredData.slice(startIdx, startIdx + this.pageSize);
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  private adjustCurrentPage() {
    const maxPage = this.totalPages;
    if (this.currentPage > maxPage) {
      this.currentPage = maxPage;
    }
  }

  exportCsv() {
    if (!this.filteredData.length) return;

    const headers = Object.keys(this.$lista()[0] || {});
    const csvRows = [headers.join(',')];
    for (const row of this.filteredData) {
      const csvRow = headers
        .map((h) => {
          const val = row[h];
          if (typeof val === 'string') {
            // escape quotes
            return `"${val.replace(/"/g, '""')}"`;
          }
          return String(val);
        })
        .join(',');
      csvRows.push(csvRow);
    }
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
