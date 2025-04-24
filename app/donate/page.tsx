'use client';

import { useState } from 'react';
import { YucLogo } from '@/components/yuc-logo';
import needsData from '@/data/needsData';
import Image from 'next/image';
import CreditCard from '@/components/CreditCard';
import '@/styles/donation.css';

type DonationType = 'material' | 'money' | null;

export default function DonationPage() {
  const [donationType, setDonationType] = useState<DonationType>(null);
  const [inputItem, setInputItem] = useState('');
  const [amount, setAmount] = useState<string | number>('');
  const [selectedSchool, setSelectedSchool] = useState<string>('');
  const [donationCount, setDonationCount] = useState<number>(0);
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);

  const filteredNeeds = needsData
    .filter(entry => entry.item.toLowerCase() === inputItem.toLowerCase())
    .sort((a, b) => b.count - a.count);

  const handleSchoolSelect = (schoolName: string) => {
    setSelectedSchool(schoolName);
  };

  const handleDonationSubmit = () => {
    if (!selectedSchool || !donationCount) {
      alert('Lütfen okul seçin ve adet belirtin.');
      return;
    }
    alert(`${selectedSchool} okuluna ${donationCount} adet "${inputItem}" bağışı yapılacak.`);
  };

  return (
    <>
      <div className="min-h-screen bg-white">
        <div className="logo-slogan-box">
          <div className="logo">
            <Image
              src="/logo1.jpeg"
              alt="Logo"
              width={100}
              height={100}
              className="site-icon"
            />
          </div>
          <div className="slogan">Bir çocuk daha mutlu olsun!</div>
        </div>

        <div className="button-group">
          <button
            className="donate-btn item"
            onClick={() => setDonationType('material')}
          >
            MALZEME YARDIMI
          </button>
          <button
            className="donate-btn money"
            onClick={() => setDonationType('money')}
          >
            PARA YARDIMI
          </button>
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

                {/* Seçim ve Adet inputları buraya alındı */}
                {/* Seçim ve Adet inputları buraya alındı ve ortalandı */}
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
                    onChange={(e) =>
                      setDonationCount(Math.max(0, Number(e.target.value)))
                    }
                  />
                </label>
              </div>
            </div>
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
                        style={{
                          cursor: 'pointer',
                          backgroundColor:
                            selectedSchool === entry.school ? '#f1f1f1' : '',
                        }}
                        onClick={() => handleSchoolSelect(entry.school)}
                      >
                        <td>{entry.school}</td>
                        <td>{entry.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <button className="donate-confirm" style={{ marginTop: '20px' }} onClick={handleDonationSubmit}>
                  Bağış Yap
                </button>
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
                  onChange={e => setAmount(e.target.value)}
                />
                <button
                  className="donate-confirm"
                  onClick={() => setShowPaymentPopup(true)}
                >
                  Ödemeyi Bitir
                </button>
              </>
            )}
          </div>
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

            <button className="popup-confirm">Ödemeyi Onayla</button>
            <button onClick={() => setShowPaymentPopup(false)} className="popup-cancel">İptal</button>
          </div>
        </div>
      )}
    </>
  );
}
