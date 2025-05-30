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

  const searchParams = useSearchParams();

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

    if (schoolIdFromUrl) {
      fetch(`/api/schools/${schoolIdFromUrl}`)
        .then(res => res.json())
        .then(data => {
          if (data.name) {
            setSelectedSchool(data.name);
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
    // Optionally close the school suggestion popup after selection
    setFilteredNeeds([]);
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
    setSelectedSchool(''); // Clear selected school after adding
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
      setShowPaymentPopup(false); // Close popup on success
      setAmount('');
      setCardNumber('');
      setCardName('');
      setCardExpiry('');
      setCardCVV('');
      // setTimeout(() => window.location.href = '/', 3000); // Optional redirect
    } catch {
      toast({ type: 'error', title: 'Sunucu Hatası', description: 'Bağış işlenemedi.', open: true, onOpenChange: () => {} });
    }
  };

  const showSchoolPopup = inputItem.trim() && donationCount > 0 && filteredNeeds.length > 0 && !selectedSchool;

  return (
    <div className="min-h-screen bg-white flex flex-col p-2 sm:p-4">
      {/* Logo and Header can go here if needed */}
      {/* <div className="flex justify-center py-4">
        <YucLogo />
      </div> */}

      {/* Main container for donation boxes */}
      <div className="flex-1 flex flex-col md:flex-row justify-center items-start md:items-stretch max-w-screen-2xl mx-auto w-full gap-4 md:gap-6">

        {/* Sol Kutu: Malzeme Yardımı */}
        <div
          className="w-full md:flex-1 flex flex-col justify-start p-4 sm:p-6 border border-gray-300 md:border-blue-700 rounded-xl shadow-lg bg-white md:border-r-2"
        >
          <div className="card h-full w-full flex flex-col">
            <div className="flex justify-center mb-4">
              <span
                className={`inline-block bg-blue-100 text-blue-700 font-bold px-4 py-2 sm:px-6 rounded-full shadow text-base sm:text-lg ${activeBox !== 'material' ? 'cursor-pointer hover:bg-blue-200' : ''}`}
                onClick={() => activeBox !== 'material' && setActiveBox('material')}
              >
                MALZEME YARDIMI
              </span>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full items-center mt-4 sm:mt-8 relative">
              <input
                className="custom-amount w-full sm:w-2/3 text-sm sm:text-base"
                placeholder="Yardım yapmak istediğiniz eşyayı giriniz"
                value={inputItem}
                onChange={e => setInputItem(e.target.value)}
              />
              <input
                type="number"
                min="1"
                className="custom-amount w-full sm:w-1/3 mt-2 sm:mt-0 text-sm sm:text-base"
                placeholder="Adet"
                value={donationCount === 0 ? '' : donationCount} // Show placeholder if 0
                onChange={(e) => setDonationCount(Number(e.target.value))}
              />
              {matchedItems.length > 0 && (
                <ul className="absolute left-0 right-0 top-full mt-1 w-full rounded-lg border border-blue-400 bg-white shadow-md max-h-60 overflow-y-auto text-xs sm:text-sm z-30">
                  {matchedItems.map((item, index) => (
                    <li
                      key={index}
                      onClick={() => handleItemSelect(item)}
                      className="px-3 py-2 sm:px-4 hover:bg-blue-100 hover:text-blue-700 cursor-pointer font-semibold"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* School selection moved up for better flow */}
            <div className="flex flex-col sm:flex-row items-center justify-center w-full mt-4 gap-2">
                <input
                    type="text"
                    className="custom-amount w-full sm:flex-1 text-sm sm:text-base" // sm:flex-1 to take available space
                    placeholder="Okul adı (Öneri için ▼ tıklayın)"
                    value={selectedSchool}
                    onChange={(e) => setSelectedSchool(e.target.value)}
                    onFocus={() => { // Show suggestions when input is focused and item/count are present
                        if (inputItem.trim() && donationCount > 0 && allNeeds.length > 0) {
                            const matchingSchools = allNeeds.filter(
                                (need) => need.item.toLowerCase() === inputItem.toLowerCase()
                              );
                            setFilteredNeeds(matchingSchools.length > 0 ? matchingSchools : []);
                        }
                    }}
                />
                <button
                    type="button"
                    className="flex items-center justify-center bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-full w-10 h-10 shadow text-xl p-0"
                    onClick={() => {
                        if (inputItem.trim() && donationCount > 0) {
                            const matchingSchools = allNeeds.filter(
                                (need) => need.item.toLowerCase() === inputItem.toLowerCase()
                              );
                            setFilteredNeeds(filteredNeeds.length > 0 ? [] : (matchingSchools.length > 0 ? matchingSchools : allNeeds));
                        } else {
                            setFilteredNeeds(filteredNeeds.length > 0 ? [] : allNeeds);
                        }
                    }}
                    title="Okul seçimi için öneri aç/kapat"
                    disabled={!inputItem.trim() || donationCount <= 0} // Disable if no item/count
                >
                    <span className="text-2xl">▼</span>
                </button>
            </div>


            <button className="donate-confirm mt-6 sm:mt-8 text-sm sm:text-base" onClick={handleAddItem}>Listeye Ekle</button>

            {donationItems.length > 0 && (
              <div className="mt-4 border-t pt-4">
                <h4 className="font-semibold mb-2 text-sm sm:text-base">Bağış Listesi:</h4>
                <ul className="space-y-2">
                  {donationItems.map((item, idx) => (
                    <li key={idx} className="flex justify-between items-center bg-gray-100 rounded-lg px-3 py-2 sm:px-4 text-xs sm:text-sm">
                      <span className="font-medium">
                        {item.item} - {item.count} adet <span className="text-gray-500">({item.school})</span>
                      </span>
                      <button
                        className="text-white bg-red-500 hover:bg-red-600 px-2 py-1 sm:px-3 rounded-md text-xs sm:text-sm"
                        onClick={() => removeItem(idx)}
                      >
                        Sil
                      </button>
                    </li>
                  ))}
                </ul>
                <button className="donate-confirm mt-4 w-full text-sm sm:text-base" onClick={handleDonationSubmit}>Malzeme Bağışını Tamamla</button>
              </div>
            )}


            {/* Okul öneri popup'u */}
            {showSchoolPopup && (
              <div className="fixed inset-0 z-30 flex items-center justify-center bg-black bg-opacity-40 p-4">
                <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 max-w-md w-full relative">
                  <button
                    className="absolute top-2 right-2 text-gray-500 hover:text-black text-2xl leading-none"
                    onClick={() => setFilteredNeeds([])}
                  >
                    &times; {/* Nicer X symbol */}
                  </button>
                  <h4 className="font-bold text-base sm:text-lg mb-3 sm:mb-4 text-blue-700">"{inputItem}" İçin İhtiyacı Olan Okullar</h4>
                  {filteredNeeds.length > 0 ? (
                    <>
                      <div className="max-h-60 overflow-y-auto">
                        <table className="min-w-full text-left text-xs sm:text-sm mb-2">
                          <thead className="bg-gray-100 font-medium sticky top-0">
                            <tr>
                              <th className="px-3 py-2 sm:px-4">OKUL ADI</th>
                              <th className="px-3 py-2 sm:px-4">İHTİYAÇ ADEDİ</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredNeeds.map((entry, index) => (
                              <tr
                                key={index}
                                className={`cursor-pointer hover:bg-gray-100 ${selectedSchool === entry.school ? 'bg-blue-50' : ''}`}
                                onClick={() => {
                                    handleSchoolSelect(entry.school);
                                    setFilteredNeeds([]); // Close popup on select
                                }}
                              >
                                <td className="px-3 py-2 sm:px-4 border-b border-gray-200">{entry.school}</td>
                                <td className="px-3 py-2 sm:px-4 border-b border-gray-200">{entry.count}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">Bir okula tıklayarak seçebilirsiniz.</p>
                    </>
                  ) : (
                    <p className="text-sm text-gray-600">Bu eşya için kayıtlı ihtiyaç bulunan okul yok veya okul zaten seçili.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sağ Kutu: Para Yardımı */}
        <div
          className="w-full md:flex-1 flex flex-col justify-start p-4 sm:p-6 border border-gray-300 md:border-green-700 rounded-xl shadow-lg bg-white"
        >
          <div className="card h-full w-full flex flex-col">
            <div className="flex justify-center mb-4">
              <span
                className={`inline-block bg-green-100 text-green-700 font-bold px-4 py-2 sm:px-6 rounded-full shadow text-base sm:text-lg ${activeBox !== 'money' ? 'cursor-pointer hover:bg-green-200' : ''}`}
                onClick={() => activeBox !== 'money' && setActiveBox('money')}
              >
                PARA YARDIMI
              </span>
            </div>
            <div className="donation-options flex flex-wrap justify-center gap-2 sm:gap-3 mt-4 sm:mt-8">
              <button className="amount-btn text-sm sm:text-base px-3 py-1 sm:px-4 sm:py-2" onClick={() => setAmount(100)}>100₺</button>
              <button className="amount-btn text-sm sm:text-base px-3 py-1 sm:px-4 sm:py-2" onClick={() => setAmount(300)}>300₺</button>
              <button className="amount-btn text-sm sm:text-base px-3 py-1 sm:px-4 sm:py-2" onClick={() => setAmount('')}>DİĞER</button>
            </div>
            <div className="flex justify-center w-full mt-3 sm:mt-4">
              <input
                type="number"
                className="custom-amount w-full max-w-xs text-sm sm:text-base"
                placeholder="Tutar giriniz (₺)"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <button className="donate-confirm mt-6 sm:mt-8 text-sm sm:text-base" onClick={() => {
              if (!amount || Number(amount) <= 0) {
                toast({ type: 'error', title: 'Geçersiz Tutar', description: 'Lütfen geçerli bir tutar girin.', open: true, onOpenChange: () => {} });
                return;
              }
              setShowPaymentPopup(true);
            }}>
              ÖDEMEYE GEÇ
            </button>
          </div>
        </div>
      </div>

      {/* Ödeme popup'ı */}
      {showPaymentPopup && (
  <div className="popup-overlay ...">
    <div className="popup-content ...">
      <CreditCard 
        cardNumber={cardNumber} 
        cardName={cardName} 
        cardExpiry={cardExpiry} 
        cardCVV={cardCVV} // Bu prop CreditCard component'i içinde görsel olarak kullanılmıyor ama iletiliyor
      />
      <input
        className="popup-input ..."
        placeholder="Kart Numarası"
        value={cardNumber}
        onChange={(e) => setCardNumber(e.target.value)}
        // ... diğer inputlar
      />
      <input
        className="popup-input w-full mt-3 text-sm sm:text-base"
        placeholder="Kart Üzerindeki İsim"
        value={cardName}
        onChange={(e) => setCardName(e.target.value)}
      />
      <div className="flex flex-col sm:flex-row gap-3 mt-3 w-full">
        <input
          className="popup-input w-full sm:w-1/2 text-sm sm:text-base"
          placeholder="Son Kullanma (AA/YY)"
          value={cardExpiry}
          onChange={(e) => setCardExpiry(e.target.value)}
          maxLength={5}
        />
        <input
          className="popup-input w-full sm:w-1/2 text-sm sm:text-base"
          placeholder="CVV"
          value={cardCVV}
          onChange={(e) => setCardCVV(e.target.value)}
          maxLength={3}
        />
      </div>
    </div>
  </div>
)}
    </div>
  );
}