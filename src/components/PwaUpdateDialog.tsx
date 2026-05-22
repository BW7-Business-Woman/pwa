import { useEffect } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { usePwaUpdate } from '@/hooks/usePwaUpdate';

export function PwaUpdateDialog() {
  const { updateAvailable, updateApp } = usePwaUpdate();

  return (
    <AlertDialog open={updateAvailable}>
      <AlertDialogContent className="max-w-sm">
        <AlertDialogHeader>
          <AlertDialogTitle>Atualização Disponível</AlertDialogTitle>
          <AlertDialogDescription>
            Uma nova versão do BW7 Marketplace está disponível. Atualize agora para obter os últimos recursos e melhorias de desempenho.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex gap-3 justify-end">
          <AlertDialogCancel>Depois</AlertDialogCancel>
          <AlertDialogAction onClick={updateApp} className="bg-[#3e006c] hover:bg-[#2d0050]">
            Atualizar Agora
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
