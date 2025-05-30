"use client";

import React from 'react';
import '@/styles/CreditCard.css'; // Bu CSS dosyası stilleri tanımlayacak

interface CreditCardProps {
  cardNumber?: string;
  cardName?: string;
  cardExpiry?: string;
  cardCVV?: string; // CVV bu component'te görsel olarak kullanılmıyor
}

export default function CreditCard({
  cardNumber: cardNumberProp,
  cardName: cardNameProp,
  cardExpiry: cardExpiryProp,
}: CreditCardProps) {
  const displayNumber = cardNumberProp || '•••• •••• •••• ••••';
  const displayName = cardNameProp || 'AD SOYAD';
  const displayExpiry = cardExpiryProp || 'MM/YY';

  return (
    <div className="credit-card">
      <div className="card-top">
        <div className="mastercard-logo"> {/* Logo yapınıza göre güncelleyebilirsiniz */}
          <div className="circle red"></div>
          <div className="circle yellow"></div>
        </div>
        <div className="chip"></div>
      </div>

      <div className="card-number">{displayNumber}</div>

      <div className="card-bottom">
        <div className="card-holder">
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