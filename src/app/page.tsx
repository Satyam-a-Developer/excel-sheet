"use client";
import React, { useState, useEffect } from "react";

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
  initialCols = 16,
}) => {
  const ROWS = initialRows;
  const COLS = initialCols;

  // State with type annotations
  const [cells, setCells] = useState<CellGrid>(
    Array(ROWS)
      .fill("")
      .map(() => Array(COLS).fill(""))
  );
  const [selectedCells, setSelectedCells] = useState<CellPosition[]>([]);
  const [shouldUpdate, setShouldUpdate] = useState<boolean>(false);
  const [lastSelectedCell, setLastSelectedCell] = useState<CellPosition | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [startCell, setStartCell] = useState<CellPosition | null>(null);

  // Convert column number to letter (A-P for 16 columns)
  const getColumnLabel = (index: number): string => {
    return String.fromCharCode(65 + index);
  };



  // Add this function to your Spreadsheet component
  // Add useEffect import if not already imported

  // Inside your component:
  useEffect(() => {
    if (shouldUpdate && lastSelectedCell) {
      const [lastRow, lastCol] = lastSelectedCell;
      const newCells = [...cells];
      newCells[lastRow][lastCol] = sumvaule;
      setCells(newCells);
      setShouldUpdate(false);
    }
  }, [shouldUpdate, lastSelectedCell,cells]);


  const handleCellChange = (
    rowIndex: number,
    colIndex: number,
    value: string,
  ): void => {
    const newCells = [...cells];
    newCells[rowIndex][colIndex] = value;
    setCells(newCells);
  };


  const calculateMultiple = (): string => {
    let multiple = 1;
    let hasValidNumber = false;

    selectedCells.forEach(([row, col]) => {

      const value = parseFloat(cells[row][col]);
      if (!isNaN(value)) {
        multiple = multiple * value;
        hasValidNumber = true;
      }
    });

    return hasValidNumber ? multiple.toFixed(2) : "0.00";
  };

  const calculateSum = (): string => {
    let sum = 0;
    selectedCells.forEach(([row, col]) => {
      const value = parseFloat(cells[row][col]);
      if (!isNaN(value)) {
        sum += value;
      }
    });
    // setsumvalue(sum);  
    return sum.toFixed(2);
  };

  const sumvaule = calculateSum()
  

  const calculateSimpleInterest = (): string => {
    if (selectedCells.length < 3) return "0.00";

    // Assuming first selected cell is principal, second is rate, third is time
    const [principal, rate, time] = selectedCells.slice(0, 3).map(([row, col]) => {
      return parseFloat(cells[row][col]) || 0;
    });

    const interest = (principal * rate * time) / 100;
    return interest.toFixed(2);
  };

  const calculateCompoundInterest = (): string => {
    if (selectedCells.length < 3) return "0.00";

    // Assuming first selected cell is principal, second is rate, third is time
    const [principal, rate, time] = selectedCells.slice(0, 3).map(([row, col]) => {
      return parseFloat(cells[row][col]) || 0;
    });

    const amount = principal * Math.pow(1 + rate / 100, time);
    const interest = amount - principal;
    return interest.toFixed(2);
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

    const minRow = Math.min(startRow, rowIndex);
    const maxRow = Math.max(startRow, rowIndex);
    const minCol = Math.min(startCol, colIndex);
    const maxCol = Math.max(startCol, colIndex);

    for (let r = minRow; r <= maxRow; r++) {
      for (let c = minCol; c <= maxCol; c++) {
        newSelectedCells.push([r, c]);
      }
    }
    setLastSelectedCell([rowIndex, colIndex]);
    setSelectedCells(newSelectedCells);
  };

  const handleMouseUp = (): void => {
    setShouldUpdate(true);
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
      <div className="p-4 flex justify-center">
        <div className="overflow-x-auto flex-row flex border border-gray-300 rounded-sm p-4 shadow-lg">
          <div className="flex items-center gap-2 m-10">
            <span className="font-bold">Sum:</span>
            <span className=" px-3 py-1 rounded">
              {calculateSum()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold">Multiple:</span>
            <span className=" px-3 py-1 rounded">
              {calculateMultiple()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold">Simple Interest:</span>
            <span className=" px-3 py-1 rounded">
              {calculateSimpleInterest()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold">Compound Interest:</span>
            <span className=" px-3 py-1 rounded">
              {calculateCompoundInterest()}
            </span>
          </div>
        </div>
      </div>
      <div className="p-4">
        <div className="overflow-x-auto border border-gray-300 rounded-lg shadow-lg">
          <div className="flex flex-col">
            <div className="flex ">
              <div className="w-12 h-10 flex items-center justify-center border-b border-r border-gray-300  font-bold sticky left-0 z-20">
                #
              </div>
              {Array(COLS)
                .fill(0)
                .map((_, colIndex) => (
                  <div
                    key={`col-${colIndex}`}
                    className="w-24 h-10 flex items-center justify-center border-b border-r border-gray-300  font-bold"
                  >
                    {getColumnLabel(colIndex)}
                  </div>
                ))}
            </div>

            {Array(ROWS)
              .fill(0)
              .map((_, rowIndex) => (
                <div key={`row-${rowIndex}`} className="flex">
                  <div className="w-12 h-8 flex items-center justify-center border-b border-r border-gray-300  font-bold sticky left-0 z-10">
                    {rowIndex + 1}
                  </div>
                  {Array(COLS)
                    .fill(0)
                    .map((_, colIndex) => (
                      <div
                        key={`cell-${rowIndex}-${colIndex}`}
                        className={`w-24 h-8 border-b border-r border-gray-300 ${isCellSelected(rowIndex, colIndex)
                          ? "bg-blue-600"
                          : ""
                          }`}
                        onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
                        onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
                        onMouseUp={handleMouseUp}
                      >
                        <input
                          type="text"
                          value={cells[rowIndex][colIndex]}
                          onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
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