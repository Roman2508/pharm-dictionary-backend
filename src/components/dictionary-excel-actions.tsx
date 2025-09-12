'use client'

import * as XLSX from 'xlsx'
import saveAs from 'file-saver'
import { FC, useRef, useState } from 'react'

const excelFromObject = (data: any) => {
  // 2. Преобразуем данные для Excel
  const worksheetData = data.docs.map((item: any) => ({
    ukrainian: item.ukrainian,
    latin: item.latin,
  }))

  // 3. Создаем рабочий лист
  const worksheet = XLSX.utils.json_to_sheet(worksheetData)

  // 4. Создаем книгу
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Dictionary')

  // 5. Генерируем Excel-файл и сохраняем
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
  const blob = new Blob([excelBuffer], { type: 'application/octet-stream' })
  saveAs(blob, 'dictionary.xlsx')
}

const excelFromArray = (data: any) => {
  // 2. Преобразуем данные для Excel
  const worksheetData = data.docs.map((item: any) => [item.ukrainian, item.latin, item.category.id])

  // 3. Создаем рабочий лист без заголовков
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData) // используем массив массивов

  // 4. Создаем книгу
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Dictionary')

  // 5. Генерируем Excel-файл и сохраняем
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
  const blob = new Blob([excelBuffer], { type: 'application/octet-stream' })
  saveAs(blob, 'dictionary.xlsx')
}

const ExcelImportButton: FC = () => {
  const fileRef = useRef<HTMLInputElement | null>(null)

  const [status, setStatus] = useState<string>('')
  const [isImporting, setIsImporting] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  const onClickUpload = () => {
    if (!fileRef.current) return
    fileRef.current.click()
  }

  const handleUpload = async (e: any) => {
    e.preventDefault()

    setStatus('Завантаження...')
    setIsImporting(true)

    const files = (e.target as HTMLInputElement).files

    if (!files?.length) return

    const f = files[0]

    const reader = new FileReader()
    reader.onload = async function (e) {
      const data = e.target?.result
      let readedData = XLSX.read(data, { type: 'binary' })
      const wsname = readedData.SheetNames[0]
      const ws = readedData.Sheets[wsname]

      /* Convert array to json*/
      const dataParse = XLSX.utils.sheet_to_json(ws, { header: 1 })

      const res = await fetch('/api/dictionary/import-excel', {
        method: 'POST',
        body: JSON.stringify(dataParse),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `JWT ${localStorage.getItem('payload-token')}`,
        },
      })
      setIsImporting(false)

      if (res.ok) {
        setStatus(`✅ Імпортовано рядків: ${dataParse.length}`)
      } else {
        setStatus(`❌ Помилка!`)
      }
    }
    reader.readAsBinaryString(f)
  }

  const downloadAllWords = async () => {
    try {
      setIsExporting(true)
      // 1. Получаем все записи из коллекции dictionary через Payload API
      const res = await fetch('/api/dictionary?limit=100000', {
        headers: {
          Authorization: `JWT ${localStorage.getItem('payload-token')}`,
        },
      })
      const data = await res.json()
      excelFromArray(data)
    } catch (error) {
      console.error('Помилка при завантаженні слів:', error)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div style={{ display: 'flex', gap: '12px', marginBottom: 16 }}>
      <div className="">
        <input
          type="file"
          ref={fileRef}
          accept=".xlsx,.xls"
          onChange={handleUpload}
          style={{ display: 'none' }}
        />

        <button
          type="button"
          disabled={isImporting || isExporting}
          onClick={onClickUpload}
          style={{
            padding: '6px 12px',
            border: '1px solid #ccc',
            borderRadius: 4,
            background: '#222',
            color: '#fff',
            cursor: 'pointer',
            width: '140px',
          }}
        >
          {isImporting ? 'Завантаження...' : 'Імпортувати Excel'}
        </button>
        {status && <p>{status}</p>}
      </div>

      <div className="">
        <button
          onClick={downloadAllWords}
          disabled={isImporting || isExporting}
          style={{
            padding: '6px 12px',
            border: '1px solid rgb(221, 221, 221)',
            borderRadius: 4,
            background: 'rgb(221, 221, 221)',
            color: '#222',
            cursor: 'pointer',
            width: '140px',
          }}
        >
          {isExporting ? 'Завантаження...' : 'Експортувати Excel'}
        </button>
      </div>
    </div>
  )
}

export default ExcelImportButton
