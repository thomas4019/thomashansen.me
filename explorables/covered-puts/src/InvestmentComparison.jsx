import React, { useState, useEffect } from "react";

const hysaRate = 0.04;
const moneyMarketRate = 0.04;
const sliderMin = 225;
const sliderMax = 300;

const InvestmentComparison = () => {
  const [startDateStr, setStartDate] = useState(null);
  const [expirationDate, setExpirationDate] = useState(null);
  const [initialVTI, setInitialVTI] = useState(null);
  const [putStrike, setPutStrike] = useState(null);
  const [putPremium, setPutPremium] = useState(null);
  const [vtiEnd, setVtiEnd] = useState(null);

  // Function to get the query params from the URL and return them with defaults
  const getQueryParam = (param, defaultValue) => {
    const urlParams = new URLSearchParams(window.location.search);
    const value = urlParams.get(param);
    return value ? (isNaN(value) ? value : parseFloat(value)) : defaultValue;
  };

  // Initialize state based on query params or defaults
  useEffect(() => {
    const startDateFromQuery = getQueryParam("startDate", "2025-05-02");
    const expirationDateFromQuery = getQueryParam("expirationDate", "2025-06-20");
    const initialVTIFromQuery = getQueryParam("initialVTI", 278.80);
    const putStrikeFromQuery = getQueryParam("putStrike", 260);
    const putPremiumFromQuery = getQueryParam("putPremium", 2.95);
    const vtiEndFromQuery = getQueryParam("vtiEnd", 278.80);

    setStartDate(startDateFromQuery);
    setExpirationDate(expirationDateFromQuery);
    setInitialVTI(initialVTIFromQuery);
    setPutStrike(putStrikeFromQuery);
    setPutPremium(putPremiumFromQuery);
    setVtiEnd(vtiEndFromQuery);
  }, []);

  // Update the query params whenever state changes
  const updateQueryParams = (param, value) => {
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set(param, value);
    window.history.replaceState(null, "", "?" + urlParams.toString());
  };

  // Update URL query params when any value changes
  useEffect(() => {
    if (startDateStr && expirationDate && initialVTI && putStrike && putPremium && vtiEnd) {
      updateQueryParams("startDate", startDateStr);
      updateQueryParams("expirationDate", expirationDate);
      updateQueryParams("initialVTI", initialVTI);
      updateQueryParams("putStrike", putStrike);
      updateQueryParams("putPremium", putPremium);
      updateQueryParams("vtiEnd", vtiEnd);
    }
  }, [startDateStr, expirationDate, initialVTI, putStrike, putPremium, vtiEnd]);

  if (startDateStr === null || expirationDate === null || initialVTI === null || putStrike === null || putPremium === null || vtiEnd === null) {
    // Initial render, wait for the state to be initialized
    return <div>Loading...</div>;
  }

  const endDate = new Date(expirationDate);
  const startDate = new Date(startDateStr);
  const days = (endDate - startDate) / (1000 * 60 * 60 * 24);

  const breakeven = putStrike - putPremium;

  const hysaReturn = hysaRate * (days / 365);
  const vtiReturn = (vtiEnd - initialVTI) / initialVTI;

  const putStrategyReturn = (() => {
    if (vtiEnd >= putStrike) {
      return (moneyMarketRate * (days / 365)) + (putPremium / putStrike);
    } else {
      const loss = putStrike - vtiEnd - putPremium;
      return (moneyMarketRate * (days / 365)) - (loss / putStrike);
    }
  })();

  const findCrossover = () => {
    for (let price = sliderMin; price <= sliderMax; price += 0.1) {
      const returnVTI = (price - initialVTI) / initialVTI;
      const returnPut = price >= putStrike
        ? (moneyMarketRate * (days / 365)) + (putPremium / putStrike)
        : (moneyMarketRate * (days / 365)) - ((putStrike - price - putPremium) / putStrike);
      if (returnVTI > returnPut) return price;
    }
    return null;
  };

  const crossoverPrice = findCrossover();

  const formatPercent = (x) => (x * 100).toFixed(2) + "%";
  const ticks = [225, 235, 245, 255, 265, 275, 285];
  const percentToPosition = (value) => ((value - sliderMin) / (sliderMax - sliderMin)) * 100;

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-xl font-bold">Investment Strategy Comparison</h2>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Start Date</label>
        <input
          type="date"
          value={startDateStr}
          onChange={(e) => setStartDate(e.target.value)}
          className="border px-2 py-1 rounded"
        />
        <label className="block text-sm font-medium">Expiration Date</label>
        <input
          type="date"
          value={expirationDate}
          onChange={(e) => setExpirationDate(e.target.value)}
          className="border px-2 py-1 rounded"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium">Initial VTI Price ($)</label>
          <input
            type="number"
            value={initialVTI}
            onChange={(e) => setInitialVTI(parseFloat(e.target.value))}
            className="border px-2 py-1 rounded w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Put Strike ($)</label>
          <input
            type="number"
            value={putStrike}
            onChange={(e) => setPutStrike(parseFloat(e.target.value))}
            className="border px-2 py-1 rounded w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Put Premium ($)</label>
          <input
            type="number"
            value={putPremium}
            onChange={(e) => setPutPremium(parseFloat(e.target.value))}
            className="border px-2 py-1 rounded w-full"
          />
        </div>
      </div>

      <div className="space-y-4">
        <label htmlFor="slider" className="block text-sm font-medium">
          Ending VTI Price: ${vtiEnd.toFixed(2)}
        </label>
        <div className="relative">
          <input
            type="range"
            min={sliderMin}
            max={sliderMax}
            step={0.1}
            value={vtiEnd}
            onChange={(e) => setVtiEnd(parseFloat(e.target.value))}
            className="w-full z-10 relative"
          />

          <div className="absolute top-0 left-0 w-full h-4 z-0">
            <div className="absolute h-4 w-0.5 bg-blue-500" style={{ left: `${percentToPosition(putStrike)}%` }} title="Strike Price" />
            <div className="absolute h-4 w-0.5 bg-purple-500" style={{ left: `${percentToPosition(breakeven)}%` }} title="Breakeven" />
            <div className="absolute h-4 w-0.5 bg-green-500" style={{ left: `${percentToPosition(initialVTI)}%` }} title="Current VTI" />
            {crossoverPrice && (
              <div className="absolute h-4 w-0.5 bg-orange-500" style={{ left: `${percentToPosition(crossoverPrice)}%` }} title="VTI Wins" />
            )}
          </div>

          <div className="flex justify-around text-xs mt-4">
            <div className="flex items-center space-x-1"><span className="w-3 h-1 bg-blue-500 inline-block"></span> <span>Strike Price</span></div>
            <div className="flex items-center space-x-1"><span className="w-3 h-1 bg-purple-500 inline-block"></span> <span>Breakeven</span></div>
            <div className="flex items-center space-x-1"><span className="w-3 h-1 bg-green-500 inline-block"></span> <span>Current VTI</span></div>
            <div className="flex items-center space-x-1"><span className="w-3 h-1 bg-orange-500 inline-block"></span> <span>VTI Wins</span></div>
          </div>
        </div>

        <div className="flex justify-between text-xs text-gray-500 px-1">
          {ticks.map((tick) => (
            <div key={tick} className="text-center w-12 -ml-6">
              ${tick}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl border bg-white p-6 shadow text-center">
          <h3 className="text-lg font-semibold">HYSA (4%)</h3>
          <p className="text-3xl font-bold text-green-600">{formatPercent(hysaReturn)}</p>
        </div>

        <div className="rounded-2xl border bg-white p-6 shadow text-center">
          <h3 className="text-lg font-semibold">Margin + Put Strategy</h3>
          <p className={`text-3xl font-bold ${putStrategyReturn >= 0 ? "text-green-600" : "text-red-600"}`}>{formatPercent(putStrategyReturn)}</p>
        </div>

        <div className="rounded-2xl border bg-white p-6 shadow text-center">
          <h3 className="text-lg font-semibold">Buy VTI</h3>
          <p className={`text-3xl font-bold ${vtiReturn >= 0 ? "text-green-600" : "text-red-600"}`}>{formatPercent(vtiReturn)}</p>
        </div>
      </div>
    </div>
  );
};

export default InvestmentComparison;
