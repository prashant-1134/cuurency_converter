import React, { useEffect, useState } from "react";
import axios from "axios";
import "./CurrencyConverter.css"; // styling file

const CurrencyConverter = () => {
  const [currencies, setCurrencies] = useState([]);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("INR");
  const [amount, setAmount] = useState(1);
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [rate, setRate] = useState(null);

  // Fetch list of currencies (only once on mount)
  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const res = await axios.get("https://open.er-api.com/v6/latest/USD");
        setCurrencies(Object.keys(res.data.rates));
      } catch (err) {
        console.error("Error fetching currencies:", err);
      }
    };
    fetchCurrencies();
  }, []);

  // Convert whenever amount, fromCurrency, or toCurrency changes
  useEffect(() => {
    const convertCurrency = async () => {
      try {
        if (!amount) return;
        const res = await axios.get(
          `https://open.er-api.com/v6/latest/${fromCurrency}`
        );
        const newRate = res.data.rates[toCurrency];
        setRate(newRate);
        setConvertedAmount((amount * newRate).toFixed(2));
      } catch (err) {
        console.error("Error converting:", err);
      }
    };

    convertCurrency();
  }, [amount, fromCurrency, toCurrency]); // dependencies

  return (
    <div className="converter-container">
      <h2> Currency Converter</h2>

      <div className="input-group">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <select
          value={fromCurrency}
          onChange={(e) => setFromCurrency(e.target.value)}
        >
          {currencies.map((cur) => (
            <option key={cur} value={cur}>
              {cur}
            </option>
          ))}
        </select>

        <span>→</span>

        <select
          value={toCurrency}
          onChange={(e) => setToCurrency(e.target.value)}
        >
          {currencies.map((cur) => (
            <option key={cur} value={cur}>
              {cur}
            </option>
          ))}
        </select>
      </div>

      {convertedAmount && (
        <div className="result">
          <p>
             {amount} {fromCurrency} ={" "}
            <strong>
              {convertedAmount} {toCurrency}
            </strong>
          </p>
          <p>
             Exchange Rate: 1 {fromCurrency} = {rate} {toCurrency}
          </p>
        </div>
      )}
    </div>
  );
};

export default CurrencyConverter;
