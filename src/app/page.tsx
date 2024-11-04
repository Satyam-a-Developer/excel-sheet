"use client";
import e from "cors";
import React, { useState } from "react";

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
  const [input , setinput ] = useState( )
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [startCell, setStartCell] = useState<CellPosition | null>(null);

  // Convert column number to letter (A-P for 16 columns)
  const getColumnLabel = (index: number): string => {
    return String.fromCharCode(65 + index);
  };
  const handleCellChange = (
    rowIndex: number,
    colIndex: number,
    value: string,
  ): void => {

    const newCells = [...cells];
    newCells[rowIndex][colIndex] = value;
    setCells(newCells);
    // setinput
  };
  //Input value change on calulation.
  const Inputvalue =  (rowIndex:number , colIndex:number) => 
    {
      cells[rowIndex][colIndex]
    }
  const calculateMultiple = (): string => {
    let multiple = 1; // Start with 1 instead of 3 as multiplication identity
    let hasValidNumber = false;

    selectedCells.forEach(([row, col]) => {
      const value = parseFloat(cells[row][col]);
      if (!isNaN(value)) {
        multiple = multiple * value;
        hasValidNumber = true;
      }
    });

    // Return '0.00' if no valid numbers were found
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
    return sum.toFixed(2);
  };

  const debugCellSelection = (rowIndex: number, colIndex: number): void => {
    const columnLetter = String.fromCharCode(65 + colIndex);
    const displayRow = rowIndex + 1;
    console.log("Selected Cell Details:");
    console.log(rowIndex, "this is row index", colIndex, "this is col index");
    selectedCells.forEach(([row, col]) => {
      let value = parseFloat(cells[row][col]);
      console.log(value, "this is value inside the debug function ");
    });
  };

  const calculateSimpleInterest = (): string => {
    let simpleInterest = 0;
    selectedCells.forEach(([row, col]) => {
      const value = parseFloat(cells[row][col]);
    });
    return simpleInterest.toFixed(2);
  };

  const calculateCompundInterest = (): string => {
    let compoundInterest = 0;
    // coming soon
  };

  const handleMouseDown = (rowIndex: number, colIndex: number): void => {
    setIsDragging(true);
    setStartCell([rowIndex, colIndex]);
    setSelectedCells([[rowIndex, colIndex]]);
    debugCellSelection(rowIndex, colIndex);
    Inputvalue(rowIndex, colIndex);
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
    for (let r = minRow; r <= maxRow; r++) {
      for (let c = minCol; c <= maxCol; c++) {
        newSelectedCells.push([r, c]);
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
      <div className="p-4 flex justify-center">
        <div className="overflow-x-auto flex-row flex border border-gray-300 rounded-sm p-4 shadow-lg">
          <div className="flex items-center gap-2 m-10">
            <span className="font-bold">Sum of selected cells:</span>
            <span className="bg-blue-100 px-3 py-1 rounded">
              {calculateSum()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold">Multiple of selected cells:</span>
            <span className="bg-blue-100 px-3 py-1 rounded">
              {calculateMultiple()}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-bold">
              Simple interest of selected cells:
            </span>
            <span className="bg-blue-100 px-3 py-1 rounded">
              {calculateSimpleInterest()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold">
              Compound interest of selected cells:
            </span>
            <span className="bg-blue-100 px-3 py-1 rounded">
              {calculateCompundInterest()}
            </span>
          </div>
        </div>
      </div>
      <div className="p-4">
        <div className="overflow-x-auto border border-gray-300 rounded-lg shadow-lg">
          <div className="flex flex-col">
            {/* Header Row */}
            <div className="flex bg-gray-50">
              <div className="w-12 h-10 flex items-center justify-center border-b border-r border-gray-300 bg-gray-100 font-bold sticky left-0 z-20">
                #
              </div>
              {Array(COLS)
                .fill(0)
                .map((_, colIndex) => (
                  <div
                    key={`col-${colIndex}`}
                    className="w-24 h-10 flex items-center justify-center border-b border-r border-gray-300 bg-gray-100 font-bold"
                  >
                    {getColumnLabel(colIndex)}
                  </div>
                ))}
            </div>

            {/* Grid Rows */}
            {Array(ROWS)
              .fill(0)
              .map((_, rowIndex) => (
                <div key={`row-${rowIndex}`} className="flex">
                  <div className="w-12 h-8 flex items-center justify-center border-b border-r border-gray-300 bg-gray-100 font-bold sticky left-0 z-10">
                    {rowIndex + 1}
                  </div>
                  {Array(COLS)
                    .fill(0)
                    .map((_, colIndex) => (
                      <div
                        key={`cell-${rowIndex}-${colIndex}`}
                        className={`w-24 h-8 border-b border-r border-gray-300 ${
                          isCellSelected(rowIndex, colIndex)
                            ? "bg-blue-100"
                            : ""
                        }`}
                        onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
                        onMouseEnter={() =>
                          handleMouseEnter(rowIndex, colIndex)
                        }
                        onMouseUp={handleMouseUp}
                      >
                        <input
                          type="text"
                          value={cells[rowIndex][colIndex]}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleCellChange(rowIndex, colIndex,e.target.value)
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
