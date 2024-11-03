'use client'
import React, { useState } from 'react';

// Type definitions
type CellValue = string;
type CellGrid = CellValue[][];
type CellPosition = [number, number]; // [row, col]

interface SpreadsheetProps {
  initialRows?: number;
  initialCols?: number;
}

const Spreadsheet: React.FC<SpreadsheetProps> = ({ 
  initialRows = 16, 
  initialCols = 16 
}) => {
  const ROWS = initialRows;
  const COLS = initialCols;

  // State with type annotations
  const [cells, setCells] = useState<CellGrid>(
    Array(ROWS).fill('').map(() => Array(COLS).fill(''))
  );
  const [selectedCells, setSelectedCells] = useState<CellPosition[]>([]);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [startCell, setStartCell] = useState<CellPosition | null>(null);

  // Convert column number to letter (A-P for 16 columns)
  const getColumnLabel = (index: number): string => {
    return String.fromCharCode(65 + index);
  };

  const handleCellChange = (rowIndex: number, colIndex: number, value: string): void => {
    const newCells = [...cells];
    newCells[rowIndex][colIndex] = value;
    setCells(newCells);
  };

  const calculateSum = (): string => {
    let sum = 0;
    selectedCells.forEach(([row, col]) => {
      const value = parseFloat(cells[row][col]);
      if (!isNaN(value)) {
        sum += value;
        console.log(value);
      }
    });
    return sum.toFixed(2);
  };

  const handleMouseDown = (rowIndex: number, colIndex: number): void => {
    setIsDragging(true);
    setStartCell([rowIndex, colIndex]);
    setSelectedCells([[rowIndex, colIndex]]);
  };

  const handleMouseEnter = (rowIndex: number, colIndex: number): void => {
    if (!isDragging || !startCell) return;

    const [startRow, startCol] = startCell;
    const newSelectedCells: CellPosition[] = [];

    // Calculate the range of cells to select
    const minRow = Math.min(startRow, rowIndex);
    const maxRow = Math.max(startRow, rowIndex);
    const minCol = Math.min(startCol, colIndex);
    const maxCol = Math.max(startCol, colIndex);

    // Add all cells in the range to selection
    console.log(minRow, maxRow, minCol, maxCol, selectedCells);
    for (let r = minRow; r <= maxRow; r++) {
      for (let c = minCol; c <= maxCol; c++) {
        newSelectedCells.push([r, c]);
        console.log(r, c);
      }
    }

    setSelectedCells(newSelectedCells);
  };

  const handleMouseUp = (): void => {
    setIsDragging(false);
  };

  const isCellSelected = (rowIndex: number, colIndex: number): boolean => {
    return selectedCells.some(([r, c]) => r === rowIndex && c === colIndex);
  };

  return (
    <>
      <div className="p-4 flex flex-row justify-center text-3xl">
        <h1>Excel sheet</h1>
      </div>
      <div className="p-4 flex flex-col justify-center">
        <div className="overflow-x-auto border border-gray-300 rounded-sm p-4 shadow-lg">
          <div className="flex items-center gap-2">
            <span className="font-bold">Sum of selected cells:</span>
            <span className="bg-blue-100 px-3 py-1 rounded">{calculateSum()}</span>
          </div>
        </div>
      </div>
      <div className="p-4">
        <div className="overflow-x-auto border border-gray-300 rounded-lg shadow-lg">
          <div className="flex flex-col">
            {/* Header Row */}
            <div className="flex bg-gray-50">
              <div className="w-12 h-10 flex items-center justify-center border-b border-r border-gray-300 bg-gray-100 font-bold sticky left-0 z-20">
                0
              </div>
              {Array(COLS).fill(0).map((_, colIndex) => (
                <div
                  key={`col-${colIndex}`}
                  className="w-24 h-10 flex items-center justify-center border-b border-r border-gray-300 bg-gray-100 font-bold"
                >
                  {getColumnLabel(colIndex)}
                </div>
              ))}
            </div>

            {/* Grid Rows */}
            {Array(ROWS).fill(0).map((_, rowIndex) => (
              <div key={`row-${rowIndex}`} className="flex">
                <div className="w-12 h-8 flex items-center justify-center border-b border-r border-gray-300 bg-gray-100 font-bold sticky left-0 z-10">
                  {rowIndex + 1}
                </div>
                {Array(COLS).fill(0).map((_, colIndex) => (
                  <div
                    key={`cell-${rowIndex}-${colIndex}`}
                    className={`w-24 h-8 border-b border-r border-gray-300 ${
                      isCellSelected(rowIndex, colIndex) ? 'bg-blue-100' : ''
                    }`}
                    onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
                    onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
                    onMouseUp={handleMouseUp}
                  >
                    <input
                      type="text"
                      value={cells[rowIndex][colIndex]}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                        handleCellChange(rowIndex, colIndex, e.target.value)
                      }
                      className="w-full h-full px-2 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-transparent"
                      aria-label={`${getColumnLabel(colIndex)}${rowIndex + 1}`}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Spreadsheet;