import React, { useRef } from 'react';
import { Download, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useExportImport } from '@/hooks/useExportImport';

const ExportImportButtons = () => {
  const { exportData, importData } = useExportImport();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      importData(file);
    }
    // Reset input
    event.target.value = '';
  };

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={exportData}
        className="gap-2"
      >
        <Download className="w-4 h-4" />
        Exportar
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={handleImportClick}
        className="gap-2"
      >
        <Upload className="w-4 h-4" />
        Importar
      </Button>
      
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};

export default ExportImportButtons;