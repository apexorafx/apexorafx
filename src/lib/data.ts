
import { Landmark, Globe, Coins, Wheat, BarChartHorizontal, Paperclip } from "lucide-react";
import type { ElementType } from "react";

type MarketData = {
  instrument: string;
  price: string;
  change: string;
  changePercent: string;
  isUp: boolean;
};

const marketData: Record<string, MarketData[]> = {
  forex: [
    { instrument: 'EUR/USD', price: '1.0725', change: '+0.0012', changePercent: '+0.11%', isUp: true },
    { instrument: 'GBP/USD', price: '1.2580', change: '-0.0005', changePercent: '-0.04%', isUp: false },
    { instrument: 'USD/JPY', price: '157.10', change: '+0.25', changePercent: '+0.16%', isUp: true },
    { instrument: 'AUD/USD', price: '0.6650', change: '+0.0008', changePercent: '+0.12%', isUp: true },
    { instrument: 'USD/CAD', price: '1.3690', change: '-0.0010', changePercent: '-0.07%', isUp: false },
  ],
  shares: [
    { instrument: 'AAPL', price: '190.50', change: '+1.75', changePercent: '+0.93%', isUp: true },
    { instrument: 'GOOGL', price: '175.20', change: '-0.80', changePercent: '-0.45%', isUp: false },
    { instrument: 'MSFT', price: '425.10', change: '+2.40', changePercent: '+0.57%', isUp: true },
    { instrument: 'AMZN', price: '185.00', change: '-1.20', changePercent: '-0.64%', isUp: false },
    { instrument: 'TSLA', price: '178.60', change: '+3.10', changePercent: '+1.76%', isUp: true },
  ],
  metals: [
    { instrument: 'Gold (XAU/USD)', price: '2350.50', change: '+10.20', changePercent: '+0.44%', isUp: true },
    { instrument: 'Silver (XAG/USD)', price: '30.15', change: '-0.25', changePercent: '-0.82%', isUp: false },
    { instrument: 'Platinum', price: '1050.00', change: '+5.50', changePercent: '+0.53%', isUp: true },
    { instrument: 'Copper', price: '4.50', change: '-0.02', changePercent: '-0.44%', isUp: false },
  ],
  commodities: [
    { instrument: 'Crude Oil (WTI)', price: '78.50', change: '+1.20', changePercent: '+1.55%', isUp: true },
    { instrument: 'Brent Oil', price: '82.60', change: '+1.10', changePercent: '+1.35%', isUp: true },
    { instrument: 'Natural Gas', price: '2.95', change: '-0.05', changePercent: '-1.67%', isUp: false },
    { instrument: 'Corn', price: '450.25', change: '+2.75', changePercent: '+0.61%', isUp: true },
  ],
  indices: [
    { instrument: 'S&P 500', price: '5250.00', change: '+25.50', changePercent: '+0.49%', isUp: true },
    { instrument: 'Dow Jones', price: '39800.00', change: '-50.00', changePercent: '-0.13%', isUp: false },
    { instrument: 'NASDAQ', price: '16400.00', change: '+120.75', changePercent: '+0.74%', isUp: true },
    { instrument: 'FTSE 100', price: '8200.00', change: '+30.25', changePercent: '+0.37%', isUp: true },
  ],
  crypto: [
    { instrument: 'Bitcoin (BTC)', price: '68,500.00', change: '+1200.00', changePercent: '+1.78%', isUp: true },
    { instrument: 'Ethereum (ETH)', price: '3,800.00', change: '-50.00', changePercent: '-1.30%', isUp: false },
    { instrument: 'Solana (SOL)', price: '165.50', change: '+5.20', changePercent: '+3.24%', isUp: true },
    { instrument: 'Ripple (XRP)', price: '0.5200', change: '-0.0050', changePercent: '-0.95%', isUp: false },
  ],
  bonds: [
    { instrument: 'US 10-Year', price: '4.45%', change: '-0.02', changePercent: '-0.45%', isUp: false },
    { instrument: 'German 10-Year', price: '2.55%', change: '+0.01', changePercent: '+0.39%', isUp: true },
  ],
  etfs: [
    { instrument: 'SPY', price: '524.50', change: '+2.50', changePercent: '+0.48%', isUp: true },
    { instrument: 'QQQ', price: '450.20', change: '+3.80', changePercent: '+0.85%', isUp: true },
  ],
};

const marketTabs: { value: string; label: string; icon: ElementType }[] = [
  { value: "forex", label: "Forex", icon: Globe },
  { value: "shares", label: "Shares", icon: Landmark },
  { value: "metals", label: "Metals", icon: Coins },
  { value: "commodities", label: "Commodities", icon: Wheat },
  { value: "indices", label: "Indices", icon: BarChartHorizontal },
  { value: "crypto", label: "Digital Currencies", icon: Coins },
  { value: "bonds", label: "Bonds", icon: Paperclip },
  { value: "etfs", label: "ETFs", icon: Paperclip },
];


export function getMarketData() {
    return marketData;
}

export function getMarketTabs() {
    return marketTabs;
}
