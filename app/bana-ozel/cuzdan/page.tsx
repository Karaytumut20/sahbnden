import React from 'react';
import { getWalletServer, getTransactionsServer } from '@/lib/actions/wallet-actions';
import WalletOverview from '@/components/wallet/WalletOverview';
import TransactionHistory from '@/components/wallet/TransactionHistory';

export default async function WalletPage() {
  const wallet = await getWalletServer();
  const transactions = await getTransactionsServer();

  if (!wallet) return <div className="p-6">Cüzdan bilgisi alınamadı.</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Cüzdanım</h1>

      <WalletOverview balance={Number(wallet.balance)} currency={wallet.currency} />

      <TransactionHistory transactions={transactions} />

      <div className="mt-4 text-xs text-gray-400 text-center">
        * Cüzdan bakiyeniz ile doping satın alabilir veya mağaza açılış ücretlerini ödeyebilirsiniz.
        <br/> Tüm işlemler SSL güvencesi altındadır.
      </div>
    </div>
  );
}