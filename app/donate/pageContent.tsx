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
  const [activeBox, setActiveBox] = useState<'material' | 'money'>('material');

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

  // Pop-up gösterme koşulu: hem eşya hem adet girilmişse ve öneri varsa
  const showSchoolPopup = inputItem.trim() && donationCount > 0 && filteredNeeds.length > 0;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Yardım kutularını saran ana konteyner */}

      <div className="flex-1 flex justify-center items-stretch max-w-screen-2xl mx-auto w-full px-2 pb-8 border border-gray-700 border-t-2 border-b-2 border-t-blue-700 border-b-blue-700 rounded-xl shadow-lg bg-white">
        {/* Sol Kutu: Malzeme Yardımı */}
        <div
          className="flex-1 flex flex-col justify-stretch mr-2 pr-4 border-r-2 border-blue-700 bg-white rounded-l-xl shadow-lg border-t-0 border-b-0"
        >
          <div className="card h-full w-full flex flex-col">
            <div className="flex justify-center mb-4">
              <span
                className={`inline-block bg-blue-100 text-blue-700 font-bold px-6 py-2 rounded-full shadow text-lg ${activeBox !== 'material' ? 'cursor-pointer hover:bg-blue-200' : ''}`}
                onClick={() => activeBox !== 'material' && setActiveBox('material')}
              >
                MALZEME YARDIMI
              </span>
            </div>
            <div className="flex gap-2 w-full items-center mt-16 relative">
              <input
                className="custom-amount w-2/3"
                placeholder="Yardım yapmak istediğiniz eşyayı giriniz"
                value={inputItem}
                onChange={e => setInputItem(e.target.value)}
              />
              <input
                type="number"
                min="1"
                className="custom-amount w-1/3"
                placeholder="Adet"
                value={donationCount}
                onChange={(e) => setDonationCount(Number(e.target.value))}
              />
              {matchedItems.length > 0 && (
                <ul className="absolute left-0 right-0 top-full mt-1 w-full rounded-lg border border-blue-400 bg-white shadow-md max-h-60 overflow-y-auto text-sm z-30">
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
            </div>
            <button className="donate-confirm mt-16" onClick={handleAddItem}>Listeye Ekle</button>

            <div className="mt-4 border-t pt-4">
              <h4 className="font-semibold mb-2">Seçilen Okul:</h4>
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

            <div className="flex justify-center w-full mt-4">
              <input
                type="text"
                className="custom-amount w-full max-w-xs"
                placeholder="Okul adı"
                value={selectedSchool}
                onChange={(e) => setSelectedSchool(e.target.value)}
              />
              <button
                type="button"
                className="ml-2 flex items-center justify-center bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-full w-10 h-10 shadow text-xl"
                onClick={() => setFilteredNeeds(filteredNeeds.length > 0 ? [] : allNeeds)}
                title="Okul seçimi için öneri aç"
              >
                <span className="text-2xl">▼</span>
              </button>
            </div>

            <button className="donate-confirm mt-4" onClick={handleDonationSubmit}>Bağış Yap</button>

            {/* Okul öneri popup'u */}
            {showSchoolPopup && (
              <div className="fixed inset-0 z-30 flex items-center justify-center bg-black bg-opacity-40">
                <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full relative">
                  <button
                    className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl"
                    onClick={() => setFilteredNeeds([])}
                  >
                    ×
                  </button>
                  <h4 className="font-bold text-lg mb-4 text-blue-700">İhtiyacı Olan Okullar</h4>
                  <table className="min-w-full text-left text-sm mb-2">
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
                          onClick={() => setSelectedSchool(entry.school)}
                        >
                          <td className="px-4 py-2">{entry.school}</td>
                          <td className="px-4 py-2">{entry.count}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <p className="text-xs text-gray-500">Bir okula tıklayarak seçebilirsiniz.</p>
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Sağ Kutu: Para Yardımı */}
        <div
          className="flex-1 flex flex-col justify-stretch ml-2 pl-4 bg-white rounded-r-xl shadow-lg border-t-0 border-b-0"
        >
          <div className="card h-full w-full flex flex-col">
            <div className="flex justify-center mb-4">
              <span
                className={`inline-block bg-green-100 text-green-700 font-bold px-6 py-2 rounded-full shadow text-lg ${activeBox !== 'money' ? 'cursor-pointer hover:bg-green-200' : ''}`}
                onClick={() => activeBox !== 'money' && setActiveBox('money')}
              >
                PARA YARDIMI
              </span>
            </div>
            <div className="donation-options">
              <button className="amount-btn" onClick={() => setAmount(100)}>100₺</button>
              <button className="amount-btn" onClick={() => setAmount(300)}>300₺</button>
              <button className="amount-btn" onClick={() => setAmount('')}>DİĞER</button>
            </div>
            <div className="flex justify-center w-full mt-2">
              <input
                type="number"
                className="custom-amount w-full max-w-xs mt-2"
                placeholder="Tutar giriniz"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <button className="donate-confirm mt-4" onClick={() => setShowPaymentPopup(true)}>Ödemeyi Bitir</button>
          </div>
        </div>
      </div>

      {/* Ödeme popup'ı aynı şekilde kalabilir */}
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
