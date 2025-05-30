"use client";

import React from 'react';
import '@/styles/CreditCard.css'; // Bu CSS dosyasının stilleri doğru şekilde tanımladığını varsayıyoruz.

interface CreditCardProps {
  cardNumber?: string;
  cardName?: string;
  cardExpiry?: string;
  cardCVV?: string; // CVV genellikle kartın ön yüzünde gösterilmez.
}

export default function CreditCard({
  cardNumber: cardNumberProp, // Props'ları farklı isimle alıp içinde işleyebiliriz
  cardName: cardNameProp,
  cardExpiry: cardExpiryProp,
  // cardCVV prop'u bu component'te görsel olarak kullanılmıyor.
}: CreditCardProps) {
  // Eğer prop olarak gelen değer boşsa (kullanıcı henüz giriş yapmadıysa veya sildiyse),
  // kart üzerinde genel bir yer tutucu göster. Doluysa, gelen değeri göster.
  const displayNumber = cardNumberProp || '•••• •••• •••• ••••';
  const displayName = cardNameProp || 'AD SOYAD';
  const displayExpiry = cardExpiryProp || 'MM/YY';

  return (
    <div className="credit-card">
      <div className="card-top">
        <div className="mastercard-logo"> {/* veya Visa, Amex etc. logo eklenebilir */}
          <div className="circle red"></div>
          <div className="circle yellow"></div>
        </div>
        <div className="chip"></div>
      </div>

      {/* Card Number Label kaldırıldı, direkt numara gösterimi daha yaygın */}
      {/* <div className="card-number-label">Card Number</div> */}
      <div className="card-number">{displayNumber}</div>

      <div className="card-bottom">
        <div className="card-holder"> {/* card-name yerine card-holder daha yaygın bir class ismi olabilir */}
          <span className="label">Card Holder</span>
          <span className="name">{displayName}</span>
        </div>
        <div className="card-expiration">
          <span className="label">Valid Thru</span>
          <span className="date">{displayExpiry}</span>
        </div>
      </div>
    </div>
  );
}