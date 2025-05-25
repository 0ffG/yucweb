"use client";

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
  const [filteredNeeds, setFilteredNeeds] = useState<Need[]>([]);

  const userId = 1; // TODO: Oturumdan al

  interface Need {
    school: string;
    item: string;
    count: number;
  }

  const searchParams = useSearchParams(); //to read schoolId and item from the url

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
        setFilteredNeeds([]);
        return;
      }
      try {
        const res = await fetch(`/api/needs?item=${encodeURIComponent(inputItem)}`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        setFilteredNeeds(data);
      } catch {
        toast({
          type: 'error',
          title: 'Hata',
          description: 'İhtiyaçlar alınamadı.',
          open: true,
          onOpenChange: () => {},
        });
      }
    };   

    fetchNeeds();
  }, [inputItem]);

  const handleSchoolSelect = (schoolName: string) => {
    setSelectedSchool(schoolName);
  };

  const handleDonationSubmit = async () => {
    if (!selectedSchool || !donationCount || !inputItem) {
      toast({
        type: 'error',
        title: 'Eksik Bilgi',
        description: 'Lütfen okul, eşya ve adet bilgilerini doldurun.',
        open: true,
        onOpenChange: () => {},
      });
      return;
    }

    try {
      const res = await fetch('/api/donate-material', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          schoolName: selectedSchool,
          itemName: inputItem,
          count: donationCount,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast({
          type: 'error',
          title: 'Bağış Başarısız',
          description: data.error || 'Bir hata oluştu.',
          open: true,
          onOpenChange: () => {},
        });
        return;
      }

      toast({
        type: 'success',
        title: 'Bağış Başarılı!',
        description: `${selectedSchool} okuluna ${donationCount} adet "${inputItem}" bağışı yapıldı.`,
        open: true,
        onOpenChange: () => {},
      });

      setFilteredNeeds(prev =>
        prev.map(need =>
          need.school === selectedSchool && need.item.toLowerCase() === inputItem.toLowerCase()
            ? { ...need, count: need.count - donationCount }
            : need
        )
      );

      setDonationCount(0);
    } catch (err) {
      toast({
        type: 'error',
        title: 'Sunucu Hatası',
        description: 'Bağış yapılırken bir sorun oluştu.',
        open: true,
        onOpenChange: () => {},
      });
    }
  };

  const handleMoneyDonation = async () => {
    if (!amount || Number(amount) <= 0) {
      toast({
        type: 'error',
        title: 'Geçersiz Tutar',
        description: 'Lütfen geçerli bir bağış miktarı girin.',
        open: true,
        onOpenChange: () => {},
      });
      return;
    }

    try {
      const res = await fetch('/api/donate-money', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          amount: Number(amount),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast({
          type: 'error',
          title: 'Bağış Başarısız',
          description: data.error || 'Bir hata oluştu.',
          open: true,
          onOpenChange: () => {},
        });
        return;
      }

      toast({
        type: 'success',
        title: 'Ödeme Alındı',
        description: `Bağışınız başarıyla işlendi: ${amount}₺`,
        open: true,
        onOpenChange: () => {},
      });

      setTimeout(() => window.location.href = '/', 3000);
    } catch (err) {
      toast({
        type: 'error',
        title: 'Sunucu Hatası',
        description: 'Bağış işlenemedi.',
        open: true,
        onOpenChange: () => {},
      });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="logo-slogan-box">
        <div className="logo" style={{ transform: 'scale(1.2)' }}>
          <Image src="/logo2.jpeg" alt="Logo" width={100} height={100} className="site-icon" />
        </div>
        <div className="slogan">Bir çocuk daha mutlu olsun!</div>
      </div>

      <div className="button-group">
        <button className="donate-btn item" onClick={() => setDonationType('material')}>MALZEME YARDIMI</button>
        <button className="donate-btn money" onClick={() => setDonationType('money')}>PARA YARDIMI</button>
      </div>

      <hr />

      <div className="dynamic-section">
        <div className="card">
          {donationType === 'material' && (
            <>
              <h3>YARDIM YAPMAK İSTEDİĞİNİZ EŞYAYI GİRİNİZ</h3>
              <input
                className="custom-amount"
                placeholder="Yardım yapmak istediğiniz eşyayı giriniz"
                value={inputItem}
                onChange={e => setInputItem(e.target.value)}
              />

              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', marginBottom: '20px' }}>
                <div style={{ textAlign: 'left' }}>
                  <label style={{ display: 'block', marginBottom: '10px' }}>
                    <strong>Seçilen Okul:</strong>
                    <input
                      type="text"
                      className="custom-amount"
                      value={selectedSchool}
                      placeholder="Okul adı yazın veya listeden seçin"
                      onChange={(e) => setSelectedSchool(e.target.value)}
                    />
                  </label>
                  <label style={{ display: 'block', marginBottom: '10px' }}>
                    <strong>Bağış Adedi:</strong>
                    <input
                      type="number"
                      min="1"
                      className="custom-amount"
                      value={donationCount}
                      onChange={(e) => setDonationCount(Math.max(0, Number(e.target.value)))}
                    />
                  </label>
                </div>
              </div>

              <button className="donate-confirm" style={{ marginTop: '20px' }} onClick={handleDonationSubmit}>
                Bağış Yap
              </button>

              <div style={{ maxHeight: '300px', overflowY: 'auto', marginTop: '20px' }}>
                <table>
                  <thead>
                    <tr>
                      <th>OKUL ADI</th>
                      <th>İHTİYAÇ ADEDİ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredNeeds.map((entry, index) => (
                      <tr
                        key={index}
                        style={{ cursor: 'pointer', backgroundColor: selectedSchool === entry.school ? '#f1f1f1' : '' }}
                        onClick={() => handleSchoolSelect(entry.school)}
                      >
                        <td>{entry.school}</td>
                        <td>{entry.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {donationType === 'money' && (
            <>
              <h3>YOUR SINGLE DONATION</h3>
              <div className="donation-options">
                <button className="amount-btn" onClick={() => setAmount(100)}>100₺</button>
                <button className="amount-btn" onClick={() => setAmount(300)}>300₺</button>
                <button className="amount-btn" onClick={() => setAmount('')}>DİĞER</button>
              </div>
              <input
                type="number"
                className="custom-amount"
                placeholder="Tutar giriniz"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <button className="donate-confirm" onClick={() => setShowPaymentPopup(true)}>
                Ödemeyi Bitir
              </button>
            </>
          )}
        </div>
      </div>

      {showPaymentPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <CreditCard />
            <input className="popup-input" placeholder="Card Number" />
            <input className="popup-input" placeholder="Cardholder Name" />
            <div className="popup-row">
              <input className="popup-input half" placeholder="MM/YY" />
              <input className="popup-input half" placeholder="CVV" />
            </div>
            <button
              className="popup-confirm"
              onClick={handleMoneyDonation}
            >
              Ödemeyi Onayla
            </button>
            <button onClick={() => setShowPaymentPopup(false)} className="popup-cancel">
              İptal
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
