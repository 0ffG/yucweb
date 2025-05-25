"use client";

import React from 'react';
import '@/styles/CreditCard.css'; // CSS'i ayrıca aşağıda vereceğim

export default function CreditCard() {
  return (
    <div className="credit-card">
      <div className="card-top">
        <div className="mastercard-logo">
          <div className="circle red"></div>
          <div className="circle yellow"></div>
        </div>
        <div className="chip"></div>
      </div>

      <div className="card-number-label">Card Number</div>
      <div className="card-number">8050 5040 2030 3020</div>

      <div className="card-bottom">
        <div className="card-name"><h1>card name : ****** </h1></div>
        <div className="card-expiration">
          <span className="label">Valid Thru</span>
          <span className="date">05/28</span>
        </div>
      </div>
    </div>
  );
}
