import React from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  getPaginationRowModel,
} from '@tanstack/react-table';
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from 'lucide-react';
import type { Database } from '../../lib/database.types';

type StockItem = Database['public']['Tables']['stock_items']['Row'];

interface StockLevelsProps {
  items: StockItem[];
}

const columnHelper = createColumnHelper<StockItem>();

const columns = [
  columnHelper.accessor('name', {
    header: 'Ürün Adı',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('category', {
    header: 'Kategori',
    cell: info => {
      const categories = {
        feed: 'Yem',
        raw_material: 'Hammadde',
        veterinary: 'Veteriner',
        dairy_product: 'Süt Ürünü',
        equipment: 'Ekipman',
      };
      return (
        <span className={`px-2 py-1 rounded-full text-sm ${
          info.getValue() === 'feed' ? 'bg-green-100 text-green-800' :
          info.getValue() === 'raw_material' ? 'bg-blue-100 text-blue-800' :
          info.getValue() === 'veterinary' ? 'bg-red-100 text-red-800' :
          info.getValue() === 'dairy_product' ? 'bg-purple-100 text-purple-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {categories[info.getValue() as keyof typeof categories] || info.getValue()}
        </span>
      );
    },
  }),
  columnHelper.accessor('quantity', {
    header: 'Miktar',
    cell: info => `${info.getValue()} ${info.row.original.unit}`,
  }),
  columnHelper.accessor('min_quantity', {
    header: 'Min. Stok',
    cell: info => `${info.getValue()} ${info.row.original.unit}`,
  }),
  columnHelper.accessor('location', {
    header: 'Konum',
    cell: info => info.getValue() || '-',
  }),
  columnHelper.accessor('price', {
    header: 'Birim Fiyat',
    cell: info => `₺${info.getValue().toFixed(2)}`,
  }),
  columnHelper.accessor('updated_at', {
    header: 'Son Güncelleme',
    cell: info => new Date(info.getValue()).toLocaleDateString('tr-TR'),
  }),
];

export const StockLevels: React.FC<StockLevelsProps> = ({ items }) => {
  const [sorting, setSorting] = React.useState([]);

  const table = useReactTable({
    data: items,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6 border-b">
        <h2 className="text-lg font-semibold">Stok Seviyeleri</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-left text-sm font-medium text-gray-500 border-b"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center gap-2">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {header.column.getIsSorted() ? (
                        header.column.getIsSorted() === 'asc' ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )
                      ) : null}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr
                key={row.id}
                className="hover:bg-gray-50 cursor-pointer"
              >
                {row.getVisibleCells().map(cell => (
                  <td
                    key={cell.id}
                    className="px-4 py-3 text-sm text-gray-900 border-b"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            Toplam {table.getPrePaginationRowModel().rows.length} kayıt
          </span>
          <select
            value={table.getState().pagination.pageSize}
            onChange={e => table.setPageSize(Number(e.target.value))}
            className="px-2 py-1 border rounded-lg text-sm"
          >
            {[10, 20, 30, 40, 50].map(pageSize => (
              <option key={pageSize} value={pageSize}>
                {pageSize} kayıt/sayfa
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="p-1 rounded-lg hover:bg-gray-100 disabled:opacity-50"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm">
            Sayfa {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
          </span>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="p-1 rounded-lg hover:bg-gray-100 disabled:opacity-50"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};