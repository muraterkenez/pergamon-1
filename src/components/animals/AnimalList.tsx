import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
} from '@tanstack/react-table';
import {
  Search,
  Filter,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Plus,
  FileDown,
  FileUp,
  RefreshCw,
} from 'lucide-react';
import { useAnimals } from '../../hooks/useAnimals';
import { AnimalStats } from './AnimalStats';
import type { Database } from '../../lib/database.types';
import toast from 'react-hot-toast';

type Animal = Database['public']['Tables']['animals']['Row'];

const columnHelper = createColumnHelper<Animal>();

const columns = [
  columnHelper.accessor('national_id', {
    header: 'Kulak No',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('name', {
    header: 'İsim',
    cell: info => info.getValue() || '-',
  }),
  columnHelper.accessor('birth_date', {
    header: 'Doğum Tarihi',
    cell: info => new Date(info.getValue()).toLocaleDateString('tr-TR'),
  }),
  columnHelper.accessor('breed', {
    header: 'Irk',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('group_type', {
    header: 'Grup',
    cell: info => {
      const groups = {
        lactating: 'Laktasyonda',
        dry: 'Kurudaki',
        young: 'Genç',
        treatment: 'Tedavide',
      };
      return (
        <span className={`px-2 py-1 rounded-full text-sm ${
          info.getValue() === 'lactating' ? 'bg-green-100 text-green-800' :
          info.getValue() === 'dry' ? 'bg-yellow-100 text-yellow-800' :
          info.getValue() === 'young' ? 'bg-blue-100 text-blue-800' :
          'bg-red-100 text-red-800'
        }`}>
          {groups[info.getValue() as keyof typeof groups]}
        </span>
      );
    },
  }),
  columnHelper.accessor('status', {
    header: 'Durum',
    cell: info => {
      const statuses = {
        active: 'Aktif',
        sold: 'Satıldı',
        deceased: 'Ölüm',
      };
      return (
        <span className={`px-2 py-1 rounded-full text-sm ${
          info.getValue() === 'active' ? 'bg-green-100 text-green-800' :
          info.getValue() === 'sold' ? 'bg-blue-100 text-blue-800' :
          'bg-red-100 text-red-800'
        }`}>
          {statuses[info.getValue() as keyof typeof statuses]}
        </span>
      );
    },
  }),
  columnHelper.accessor('lactation_number', {
    header: 'Laktasyon',
    cell: info => info.getValue() || '-',
  }),
  columnHelper.accessor('weight', {
    header: 'Ağırlık (kg)',
    cell: info => info.getValue() || '-',
  }),
];

export const AnimalList: React.FC = () => {
  const navigate = useNavigate();
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('all');

  const { animals, loading, error, fetchAnimals } = useAnimals();

  useEffect(() => {
    fetchAnimals();
  }, []);

  const filteredAnimals = animals.filter(animal => {
    const matchesSearch = 
      animal.national_id.toLowerCase().includes(globalFilter.toLowerCase()) ||
      (animal.name?.toLowerCase().includes(globalFilter.toLowerCase()) ?? false) ||
      animal.breed.toLowerCase().includes(globalFilter.toLowerCase());
    
    const matchesGroup = selectedGroup === 'all' || animal.group_type === selectedGroup;
    
    return matchesSearch && matchesGroup;
  });

  const table = useReactTable({
    data: filteredAnimals,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">Veriler yüklenirken bir hata oluştu</p>
          <button
            onClick={() => fetchAnimals()}
            className="mt-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
          >
            Yeniden Dene
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* İstatistikler */}
      <AnimalStats animals={animals} />

      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Hayvan Listesi</h2>
            <div className="flex gap-4">
              <button
                onClick={() => navigate('/animals/new')}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                <Plus className="w-5 h-5" />
                Yeni Hayvan
              </button>
              <button
                onClick={() => fetchAnimals()}
                className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                <RefreshCw className="w-5 h-5" />
                Yenile
              </button>
            </div>
          </div>

          {/* Filtreler */}
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Kulak no, isim veya ırk ile ara..."
                value={globalFilter}
                onChange={e => setGlobalFilter(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tüm Gruplar</option>
              <option value="lactating">Laktasyonda</option>
              <option value="dry">Kurudaki</option>
              <option value="young">Genç</option>
              <option value="treatment">Tedavide</option>
            </select>
          </div>
        </div>

        {/* Tablo */}
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
                  onClick={() => navigate(`/animals/${row.original.id}`)}
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

        {/* Sayfalama */}
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
    </div>
  );
};