"use client";
export const dynamic = "force-dynamic";

import { useState, useEffect } from 'react';
import { YucLogo } from '@/components/yuc-logo';
import { useSearchParams } from "next/navigation";
import Image from 'next/image';
import CreditCard from '@/components/CreditCard';
import '@/styles/donation.css';
import { toast } from '@/hooks/use-toast';

export default function DonationPage() {
  const [donationType, setDonationType] = useState<'material' | 'money' | null>(null);
  const [inputItem, setInputItem] = useState('');
  const [amount, setAmount] = useState<string | number>('');
  const [selectedSchool, setSelectedSchool] = useState('');
  const [donationCount, setDonationCount] = useState<number>(0);
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [allNeeds, setAllNeeds] = useState<Need[]>([]);
  const [matchedItems, setMatchedItems] = useState<string[]>([]);
  const [filteredNeeds, setFilteredNeeds] = useState<Need[]>([]);
  const [donationItems, setDonationItems] = useState<{ item: string; count: number; school: string }[]>([]);

  //for credit card details
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVV, setCardCVV] = useState('');


  const userId = 1;

  interface Need {
    school: string;
    item: string;
    count: number;
  }

  const searchParams = useSearchParams(); //to read schoolId and item from the url


  const handleItemSelect = (item: string) => {
    setInputItem(item);
    setMatchedItems([]);
    const matchingSchools = allNeeds.filter(
      (need) => need.item.toLowerCase() === item.toLowerCase()
    );
    setFilteredNeeds(matchingSchools);
  };

    useEffect(() => {
    const itemFromUrl = searchParams.get("item");
    const schoolIdFromUrl = searchParams.get("schoolId");

    if (itemFromUrl) {
      setInputItem(itemFromUrl);
    }

    if (schoolIdFromUrl) {//otomatik olarak form dolu olsun diye
      fetch(`/api/schools/${schoolIdFromUrl}`)
        .then(res => res.json())
        .then(data => {
          if (data.name) {
            setSelectedSchool(data.name);//fills in the school field in donation form
          }
        })
        .catch(() => {
          toast({
            title: "Hata",
            description: "Okul bilgisi alınamadı.",
            type: "error",
            open: true,
            onOpenChange: () => {},
          });
        });
    }
  }, [searchParams]);



  useEffect(() => {
    const fetchNeeds = async () => {
      if (!inputItem.trim()) {
        setAllNeeds([]);
        setMatchedItems([]);
        setFilteredNeeds([]);
        return;
      }
      try {
        const res = await fetch(`/api/needs?item=${encodeURIComponent(inputItem)}`);
        if (!res.ok) throw new Error();
        const data: Need[] = await res.json();
        setAllNeeds(data);
        const uniqueItems = Array.from(
          new Set(
            data
              .map((need) => need.item)
              .filter((item) => item.toLowerCase().includes(inputItem.toLowerCase()))
          )
        );
        setMatchedItems(uniqueItems);
      } catch {
        toast({ type: 'error', title: 'Hata', description: 'İhtiyaçlar alınamadı.', open: true, onOpenChange: () => {} });
      }
    };
    fetchNeeds();
  }, [inputItem]);

  const handleSchoolSelect = (schoolName: string) => {
    setSelectedSchool(schoolName);
  };

  const handleAddItem = () => {
    if (!inputItem || donationCount <= 0) {
      toast({ type: 'error', title: 'Eksik Bilgi', description: 'Malzeme ve adet girin.', open: true, onOpenChange: () => {} });
      return;
    }
    if (!selectedSchool) {
      toast({ type: 'error', title: 'Okul Seçilmedi', description: 'Listeye eklemeden önce lütfen bir okul seçin.', open: true, onOpenChange: () => {} });
      return;
    }
    const exists = donationItems.find(item => item.item.toLowerCase() === inputItem.toLowerCase() && item.school === selectedSchool);
    if (exists) {
      toast({ type: 'error', title: 'Zaten Eklendi', description: 'Bu eşya zaten aynı okula eklenmiş.', open: true, onOpenChange: () => {} });
      return;
    }
    setDonationItems([...donationItems, { item: inputItem, count: donationCount, school: selectedSchool }]);
    setInputItem('');
    setDonationCount(0);
    setMatchedItems([]);
    setFilteredNeeds([]);
  };

  const removeItem = (index: number) => {
    setDonationItems(donationItems.filter((_, i) => i !== index));
  };

  const handleDonationSubmit = async () => {
    if (donationItems.length === 0) {
      toast({ type: 'error', title: 'Eksik Bilgi', description: 'Bağış listesi boş olamaz.', open: true, onOpenChange: () => {} });
      return;
    }
    try {
      for (const donation of donationItems) {
        const res = await fetch('/api/donate-material', {
          method: 'POST',
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            schoolName: donation.school,
            itemName: donation.item,
            count: donation.count,
          }),
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData?.error || 'Bağış işlemi başarısız.');
        }
      }

      toast({ type: 'success', title: 'Bağış Başarılı!', description: 'Tüm bağışlar ilgili okullara gönderildi.', open: true, onOpenChange: () => {} });
      setDonationItems([]);
    } catch (err: any) {
      toast({ type: 'error', title: 'Sunucu Hatası', description: err.message || 'Bağış yapılırken sorun oluştu.', open: true, onOpenChange: () => {} });
    }
  };

  const handleMoneyDonation = async () => {
    if (!cardNumber || !cardName || !cardExpiry || !cardCVV) {
      toast({
        type: 'error',
        title: 'Eksik Bilgi',
        description: 'Lütfen tüm ödeme alanlarını doldurun.',
        open: true,
        onOpenChange: () => {},
      });
    return;
    }
    if (!amount || Number(amount) <= 0) {
      toast({ type: 'error', title: 'Geçersiz Tutar', description: 'Geçerli bir tutar girin.', open: true, onOpenChange: () => {} });
      return;
    }
    try {
      await fetch('/api/donate-money', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, amount: Number(amount) }),
      });
      toast({ type: 'success', title: 'Ödeme Alındı', description: `Bağışınız: ${amount}₺`, open: true, onOpenChange: () => {} });
      setTimeout(() => window.location.href = '/', 3000);
    } catch {
      toast({ type: 'error', title: 'Sunucu Hatası', description: 'Bağış işlenemedi.', open: true, onOpenChange: () => {} });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="text-center py-6">
        <Image src="/logo2.jpeg" alt="Logo" width={100} height={100} className="mx-auto" />
        <h2 className="text-xl font-semibold mt-2">Bir çocuk daha mutlu olsun!</h2>
      </div>

      <div className="flex justify-center gap-4 mb-6">
        <button className="donate-btn item" onClick={() => setDonationType('material')}>MALZEME YARDIMI</button>
        <button className="donate-btn money" onClick={() => setDonationType('money')}>PARA YARDIMI</button>
      </div>

      <div className="card mx-auto w-full max-w-xl">
        {donationType === 'material' && (
          <>
            <input
              className="custom-amount w-full"
              placeholder="Yardım yapmak istediğiniz eşyayı giriniz"
              value={inputItem}
              onChange={e => setInputItem(e.target.value)}
            />
            {matchedItems.length > 0 && (
              <ul className="absolute left-0 right-0 mt-1 w-full rounded-lg border border-blue-400 bg-white shadow-md max-h-60 overflow-y-auto text-sm z-20">
                {matchedItems.map((item, index) => (
                  <li
                    key={index}
                    onClick={() => handleItemSelect(item)}
                    className="px-4 py-2 hover:bg-blue-100 hover:text-blue-700 cursor-pointer font-semibold"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            )}
            <input
              type="number"
              min="1"
              className="custom-amount mt-2 w-full"
              placeholder="Adet"
              value={donationCount}
              onChange={(e) => setDonationCount(Number(e.target.value))}
            />
            <button className="donate-confirm mt-2" onClick={handleAddItem}>Listeye Ekle</button>

            <div className="mt-4 border-t pt-4">
  <h4 className="font-semibold mb-2">Bağış Listesi:</h4>
  <ul className="space-y-2">
    {donationItems.map((item, idx) => (
      <li key={idx} className="flex justify-between items-center bg-gray-100 rounded-lg px-4 py-2">
        <span className="font-medium">
          {item.item} - {item.count} adet <span className="text-gray-500">({item.school})</span>
        </span>
        <button
          className="text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded-md text-sm"
          onClick={() => removeItem(idx)}
        >
          Sil
        </button>
      </li>
    ))}
  </ul>

            </div>

            <input
              type="text"
              className="custom-amount mt-4 w-full"
              placeholder="Okul adı"
              value={selectedSchool}
              onChange={(e) => setSelectedSchool(e.target.value)}
            />

            <button className="donate-confirm mt-4" onClick={handleDonationSubmit}>Bağış Yap</button>

            <div className="mt-6">
              <h4 className="font-semibold mb-2">Okullar:</h4>
              <div className="max-h-48 overflow-y-auto border rounded-md">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-gray-100 font-medium">
                    <tr>
                      <th className="px-4 py-2">OKUL ADI</th>
                      <th className="px-4 py-2">İHTİYAÇ ADEDİ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredNeeds.map((entry, index) => (
                      <tr
                        key={index}
                        className={`cursor-pointer ${selectedSchool === entry.school ? 'bg-gray-100' : ''}`}
                        onClick={() => handleSchoolSelect(entry.school)}
                      >
                        <td className="px-4 py-2">{entry.school}</td>
                        <td className="px-4 py-2">{entry.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {donationType === 'money' && (
          <>
            <div className="donation-options">
              <button className="amount-btn" onClick={() => setAmount(100)}>100₺</button>
              <button className="amount-btn" onClick={() => setAmount(300)}>300₺</button>
              <button className="amount-btn" onClick={() => setAmount('')}>DİĞER</button>
            </div>
            <input
              type="number"
              className="custom-amount mt-2"
              placeholder="Tutar giriniz"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <button className="donate-confirm mt-4" onClick={() => setShowPaymentPopup(true)}>Ödemeyi Bitir</button>
          </>
        )}
      </div>

      {showPaymentPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <CreditCard />
            <input
              className="popup-input"
              placeholder="Card Number"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
            />
            <input
              className="popup-input"
              placeholder="Cardholder Name"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
            />
            <div className="popup-row">
              <input
                className="popup-input half"
                placeholder="MM/YY"
                value={cardExpiry}
                onChange={(e) => setCardExpiry(e.target.value)}
              />
              <input
                className="popup-input half"
                placeholder="CVV"
                value={cardCVV}
                onChange={(e) => setCardCVV(e.target.value)}
              />
            </div>
            <button className="popup-confirm" onClick={handleMoneyDonation}>Ödemeyi Onayla</button>
            <button onClick={() => setShowPaymentPopup(false)} className="popup-cancel">İptal</button>
          </div>
        </div>
      )}
    </div>
  );
}
