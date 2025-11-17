// import React, { useState, useRef, useEffect } from "react";
// import Box from "@mui/material/Box";
// import IconButton from "@mui/material/IconButton";
// import Button from "@mui/material/Button";
// import Tooltip from "@mui/material/Tooltip";
// import AddIcon from "@mui/icons-material/Add";
// import RemoveIcon from "@mui/icons-material/Remove";
// import GridOnIcon from "@mui/icons-material/GridOn";
// import "../styles/maxsheet.css";

// const defaultCols = 10;
// const defaultRows = 20;

// function colLabel(n) {
//   let s = "";
//   while (n >= 0) {
//     s = String.fromCharCode((n % 26) + 65) + s;
//     n = Math.floor(n / 26) - 1;
//   }
//   return s;
// }

// // تبدیل CSV به آرایه
// function parseCSV(csvText) {
//   return csvText
//     .trim()
//     .split("\n")
//     .map((line) => line.split(","));
// }

// export default function MaxSheet() {
//   const [rows, setRows] = useState(
//     Array.from({ length: defaultRows }, () =>
//       Array.from({ length: defaultCols }, () => "")
//     )
//   );
//   const [cols, setCols] = useState(defaultCols);
//   const [selection, setSelection] = useState({ r: null, c: null });
//   const [editing, setEditing] = useState({ r: null, c: null });
//   const containerRef = useRef(null);

//   // ---------- مدیریت ردیف و ستون ----------
//   const addRow = (index = rows.length) => {
//     const newRow = Array.from({ length: cols }, () => "");
//     const next = rows.slice();
//     next.splice(index, 0, newRow);
//     setRows(next);
//   };

//   const removeRow = (index) => {
//     if (rows.length <= 1) return;
//     const next = rows.slice();
//     next.splice(index, 1);
//     setRows(next);
//   };

//   const addCol = (index = cols) => {
//     const next = rows.map((r) => {
//       const nr = r.slice();
//       nr.splice(index, 0, "");
//       return nr;
//     });
//     setRows(next);
//     setCols((c) => c + 1);
//   };

//   const removeCol = (index) => {
//     if (cols <= 1) return;
//     const next = rows.map((r) => {
//       const nr = r.slice();
//       nr.splice(index, 1);
//       return nr;
//     });
//     setRows(next);
//     setCols((c) => c - 1);
//   };

//   // ---------- ویرایش سلول ----------
//   const updateCell = (r, c, value) => {
//     setRows((prev) => {
//       const next = prev.map((row) => row.slice());
//       if (!next[r]) return prev;
//       next[r][c] = value;
//       return next;
//     });
//   };

//   const handleCellClick = (r, c) => {
//     setSelection({ r, c });
//     setEditing({ r: null, c: null });
//   };

//   const handleDouble = (r, c) => {
//     setSelection({ r, c });
//     setEditing({ r, c });
//   };

//   // ---------- کیبورد ----------
//   useEffect(() => {
//     const onKey = (e) => {
//       if (e.key === "Enter") {
//         if (editing.r == null && selection.r != null) setEditing({ ...selection });
//       }
//       if (e.key === "ArrowDown") {
//         setSelection((s) => ({ r: Math.min(rows.length - 1, (s.r ?? -1) + 1), c: s.c }));
//       }
//       if (e.key === "ArrowUp") {
//         setSelection((s) => ({ r: Math.max(0, (s.r ?? 0) - 1), c: s.c }));
//       }
//       if (e.key === "ArrowLeft") {
//         setSelection((s) => ({ r: s.r, c: Math.max(0, (s.c ?? 0) - 1) }));
//       }
//       if (e.key === "ArrowRight") {
//         setSelection((s) => ({ r: s.r, c: Math.min(cols - 1, (s.c ?? -1) + 1) }));
//       }
//       if (e.key === "Tab") {
//         e.preventDefault();
//         setSelection((s) => ({ r: s.r, c: Math.min(cols - 1, (s.c ?? -1) + 1) }));
//       }
//     };
//     window.addEventListener("keydown", onKey);
//     return () => window.removeEventListener("keydown", onKey);
//   }, [editing, selection, rows.length, cols]);

//   const renderCell = (r, c) => {
//     const value = rows[r][c];
//     const isSelected = selection.r === r && selection.c === c;
//     const isEditing = editing.r === r && editing.c === c;
//     return (
//       <td
//         key={`cell-${r}-${c}`}
//         className={`ms-cell ${isSelected ? "ms-cell-selected" : ""} ${isEditing ? "ms-cell-editing" : ""}`}
//         onClick={() => handleCellClick(r, c)}
//         onDoubleClick={() => handleDouble(r, c)}
//       >
//         {isEditing ? (
//           <input
//             className="ms-input"
//             autoFocus
//             value={value}
//             onChange={(e) => updateCell(r, c, e.target.value)}
//             onBlur={() => setEditing({ r: null, c: null })}
//             onKeyDown={(e) => {
//               e.stopPropagation();
//               if (e.key === "Enter") {
//                 setEditing({ r: null, c: null });
//                 setSelection({ r: Math.min(rows.length - 1, r + 1), c });
//               }
//             }}
//           />
//         ) : (
//           <div className="ms-cell-content">{value}</div>
//         )}
//       </td>
//     );
//   };

//   // ---------- آپلود CSV ----------
//   const handleUpload = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     const reader = new FileReader();
//     reader.onload = (evt) => {
//       const text = evt.target.result;
//       const data = parseCSV(text);
//       setRows(data);
//       setCols(Math.max(...data.map((r) => r.length)));
//     };
//     reader.readAsText(file);
//   };

//   return (
//     <Box className="ms-root" sx={{ p: 2 }}>
//       <Box className="ms-toolbar" sx={{ display: "flex", gap: 1, alignItems: "center", mb: 1 }}>
//         <Tooltip title="Add row">
//           <IconButton size="small" onClick={() => addRow(rows.length)}>
//             <AddIcon />
//           </IconButton>
//         </Tooltip>
//         <Tooltip title="Remove last row">
//           <IconButton size="small" onClick={() => removeRow(rows.length - 1)}>
//             <RemoveIcon />
//           </IconButton>
//         </Tooltip>
//         <Tooltip title="Add column">
//           <IconButton size="small" onClick={() => addCol(cols)}>
//             <AddIcon />
//           </IconButton>
//         </Tooltip>
//         <Tooltip title="Remove last column">
//           <IconButton size="small" onClick={() => removeCol(cols - 1)}>
//             <RemoveIcon />
//           </IconButton>
//         </Tooltip>
//         <Button variant="outlined" size="small" onClick={() => setRows(rows.map(r => r.map(() => "")))}>
//           Clear
//         </Button>
//         <Button variant="contained" component="label" size="small">
//           Upload CSV
//           <input type="file" accept=".csv" hidden onChange={handleUpload} />
//         </Button>
//         <Box sx={{ flex: 1 }} />
//         <Button startIcon={<GridOnIcon />} size="small" variant="text">
//           MaxSheet
//         </Button>
//       </Box>

//       <div className="ms-table-wrap" ref={containerRef}>
//         <table className="ms-table">
//           <thead>
//             <tr>
//               <th className="ms-sticky ms-header ms-row-num-header" />
//               {Array.from({ length: cols }).map((_, c) => (
//                 <th key={`h-${c}`} className="ms-sticky ms-header">
//                   <div className="ms-col-header">
//                     <span>{colLabel(c)}</span>
//                   </div>
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {rows.map((row, r) => (
//               <tr key={`r-${r}`} className="ms-row">
//                 <td className="ms-sticky ms-row-num">{r + 1}</td>
//                 {Array.from({ length: cols }).map((_, c) => renderCell(r, c))}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </Box>
//   );
// }
import React, { useState, useRef, useEffect } from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import GridOnIcon from "@mui/icons-material/GridOn";
import "../styles/maxsheet.css";

const defaultCols = 10;
const defaultRows = 20;

function colLabel(n) {
  let s = "";
  while (n >= 0) {
    s = String.fromCharCode((n % 26) + 65) + s;
    n = Math.floor(n / 26) - 1;
  }
  return s;
}

function parseCSV(csvText) {
  return csvText
    .trim()
    .split("\n")
    .map((line) => line.split(","));
}

export default function MaxSheet() {
  const [rows, setRows] = useState(
    Array.from({ length: defaultRows }, () =>
      Array.from({ length: defaultCols }, () => "")
    )
  );
  const [cols, setCols] = useState(defaultCols);
  const [selection, setSelection] = useState({ r: null, c: null });
  const [editing, setEditing] = useState({ r: null, c: null });
  const containerRef = useRef(null);

  // ---------- مدیریت ردیف و ستون ----------
  const addRow = (index = rows.length) => {
    const newRow = Array.from({ length: cols }, () => "");
    const next = rows.slice();
    next.splice(index, 0, newRow);
    setRows(next);
  };

  const removeRow = (index) => {
    if (rows.length <= 1) return;
    const next = rows.slice();
    next.splice(index, 1);
    setRows(next);
  };

  const addCol = (index = cols) => {
    const next = rows.map((r) => {
      const nr = r.slice();
      nr.splice(index, 0, "");
      return nr;
    });
    setRows(next);
    setCols((c) => c + 1);
  };

  const removeCol = (index) => {
    if (cols <= 1) return;
    const next = rows.map((r) => {
      const nr = r.slice();
      nr.splice(index, 1);
      return nr;
    });
    setRows(next);
    setCols((c) => c - 1);
  };

  // ---------- ویرایش سلول ----------
  const updateCell = (r, c, value) => {
    setRows((prev) => {
      const next = prev.map((row) => row.slice());
      if (!next[r]) return prev;
      next[r][c] = value;
      return next;
    });
  };

  const handleCellClick = (r, c) => {
    setSelection({ r, c });
    setEditing({ r: null, c: null });
  };

  const handleDouble = (r, c) => {
    setSelection({ r, c });
    setEditing({ r, c });
  };

  // ---------- کیبورد ----------
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Enter") {
        if (editing.r == null && selection.r != null)
          setEditing({ ...selection });
      }
      if (e.key === "ArrowDown") {
        setSelection((s) => ({
          r: Math.min(rows.length - 1, (s.r ?? -1) + 1),
          c: s.c,
        }));
      }
      if (e.key === "ArrowUp") {
        setSelection((s) => ({ r: Math.max(0, (s.r ?? 0) - 1), c: s.c }));
      }
      if (e.key === "ArrowLeft") {
        setSelection((s) => ({ r: s.r, c: Math.max(0, (s.c ?? 0) - 1) }));
      }
      if (e.key === "ArrowRight") {
        setSelection((s) => ({
          r: s.r,
          c: Math.min(cols - 1, (s.c ?? -1) + 1),
        }));
      }
      if (e.key === "Tab") {
        e.preventDefault();
        setSelection((s) => ({
          r: s.r,
          c: Math.min(cols - 1, (s.c ?? -1) + 1),
        }));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [editing, selection, rows.length, cols]);

  const renderCell = (r, c) => {
    const value = rows[r][c];
    const isSelected = selection.r === r && selection.c === c;
    const isEditing = editing.r === r && editing.c === c;
    return (
      <td
        key={`cell-${r}-${c}`}
        className={`ms-cell ${isSelected ? "ms-cell-selected" : ""} ${
          isEditing ? "ms-cell-editing" : ""
        }`}
        onClick={() => handleCellClick(r, c)}
        onDoubleClick={() => handleDouble(r, c)}
      >
        {isEditing ? (
          <input
            className="ms-input"
            autoFocus
            value={value}
            onChange={(e) => updateCell(r, c, e.target.value)}
            onBlur={() => setEditing({ r: null, c: null })}
            onKeyDown={(e) => {
              e.stopPropagation();
              if (e.key === "Enter") {
                setEditing({ r: null, c: null });
                setSelection({ r: Math.min(rows.length - 1, r + 1), c });
              }
            }}
          />
        ) : (
          <div className="ms-cell-content">{value}</div>
        )}
      </td>
    );
  };

  // ---------- آپلود CSV ----------
  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target.result;
      const data = parseCSV(text);
      setRows(data);
      setCols(Math.max(...data.map((r) => r.length)));
      e.target.value = ""; // ✅ ریست کردن input بعد از آپلود
    };
    reader.readAsText(file);
  };

  return (
    <Box className="ms-root" sx={{ p: 2 }}>
      <Box
        className="ms-toolbar"
        sx={{ display: "flex", gap: 1, alignItems: "center", mb: 1 }}
      >
        <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
          {/* گروه ردیف */}
          <Box sx={{ display: "flex", gap: 1 }}>
            <Tooltip title="Add row">
              <IconButton size="small" onClick={() => addRow(rows.length)}>
                <AddIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Remove last row">
              <IconButton
                size="small"
                onClick={() => removeRow(rows.length - 1)}
              >
                <RemoveIcon />
              </IconButton>
            </Tooltip>
          </Box>

          {/* گروه ستون */}
          <Box sx={{ display: "flex", gap: 1, ml: 2 }}>
            <Tooltip title="Add column">
              <IconButton size="small" onClick={() => addCol(cols)}>
                <AddIcon /> {/* می‌تونی اینو با ArrowRightAlt عوض کنی */}
              </IconButton>
            </Tooltip>
            <Tooltip title="Remove last column">
              <IconButton size="small" onClick={() => removeCol(cols - 1)}>
                <RemoveIcon /> {/* می‌تونی اینو با ArrowLeft عوض کنی */}
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Button variant="outlined" component="label" size="small">
          Upload CSV
          <input type="file" accept=".csv" hidden onChange={handleUpload} />
        </Button>
        <Button
          variant="outlined"
          size="small"
          onClick={() => {
            // درخواست نام فایل از کاربر
            let fileName = prompt("Enter file name:", "maxsheet");
            if (!fileName) return; // اگر کاربر Cancel کرد، کاری انجام نشه

            // اضافه کردن پسوند csv اگر ندارد
            if (!fileName.toLowerCase().endsWith(".csv")) {
              fileName += ".csv";
            }

            // تبدیل جدول به CSV
            const csvContent = rows.map((row) => row.join(",")).join("\n");
            const blob = new Blob([csvContent], {
              type: "text/csv;charset=utf-8;",
            });
            const url = URL.createObjectURL(blob);

            // ایجاد لینک موقت برای دانلود
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", fileName);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }}
        >
          Save to CSV
        </Button>
        <Button
          variant="outlined"
          size="small"
          onClick={() => {
            // حالت ویرایش تمام جدول یا اولین سلول
            setSelection({ r: 0, c: 0 }); // اولین سلول انتخاب میشه
            setEditing({ r: 0, c: 0 }); // آماده ویرایش میشه
          }}
        >
          Edit Sheets
        </Button>

        <Button
          variant="outlined"
          size="small"
          onClick={() => setRows(rows.map((r) => r.map(() => "")))}
        >
          Clear
        </Button>
        <Box sx={{ flex: 1 }} />
        <Button startIcon={<GridOnIcon />} size="small" variant="text">
          MaxSheet
        </Button>
      </Box>

      <div className="ms-table-wrap" ref={containerRef}>
        <table className="ms-table">
          <thead>
            <tr>
              <th className="ms-sticky ms-header ms-row-num-header" />
              {Array.from({ length: cols }).map((_, c) => (
                <th key={`h-${c}`} className="ms-sticky ms-header">
                  <div className="ms-col-header">
                    <span>{colLabel(c)}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, r) => (
              <tr key={`r-${r}`} className="ms-row">
                <td className="ms-sticky ms-row-num">{r + 1}</td>
                {Array.from({ length: cols }).map((_, c) => renderCell(r, c))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Box>
  );
}
