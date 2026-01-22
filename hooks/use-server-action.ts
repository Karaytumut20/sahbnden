import { useState } from 'react';
import { useToast } from '@/context/ToastContext';

/**
 * Server Action'ları client tarafında yönetmek için custom hook.
 * Loading state ve hata yönetimini otomatikleştirir.
 */
export function useServerAction<T>(
    action: (...args: any[]) => Promise<{ success: boolean; data?: T; error?: string }>,
    onSuccess?: (data?: T) => void
) {
    const [loading, setLoading] = useState(false);
    const { addToast } = useToast();

    const runAction = async (...args: any[]) => {
        setLoading(true);
        try {
            const result = await action(...args);
            if (result.success) {
                if (onSuccess) onSuccess(result.data);
            } else {
                addToast(result.error || 'Bir hata oluştu.', 'error');
            }
            return result;
        } catch (err) {
            addToast('Beklenmedik bir hata oluştu.', 'error');
            console.error(err);
            return { success: false, error: 'Kritik hata.' };
        } finally {
            setLoading(false);
        }
    };

    return { runAction, loading };
}