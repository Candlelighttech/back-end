import { useState } from 'react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Check, Download, CreditCard } from 'lucide-react';

export default function Billing() {
  const [currentPlan, setCurrentPlan] = useState(() => {
    const saved = localStorage.getItem('candlelight_current_plan');
    return saved || 'Free';
  });
  const [showAddCard, setShowAddCard] = useState(false);
  const [cards, setCards] = useState(() => {
    const saved = localStorage.getItem('candlelight_cards');
    return saved ? JSON.parse(saved) : [];
  });

  // Save current plan to localStorage
  const updateCurrentPlan = (plan: string) => {
    setCurrentPlan(plan);
    localStorage.setItem('candlelight_current_plan', plan);
  };

  // Save to localStorage whenever cards change
  const updateCards = (newCards: any[]) => {
    setCards(newCards);
    localStorage.setItem('candlelight_cards', JSON.stringify(newCards));
  };
  const [toaster, setToaster] = useState({ show: false, type: '', title: '', message: '' });
  const [toasterClosing, setToasterClosing] = useState(false);

  const showToaster = (type, title, message) => {
    setToaster({ show: true, type, title, message });
    setTimeout(() => {
      setToasterClosing(true);
      setTimeout(() => {
        setToaster({ show: false, type: '', title: '', message: '' });
        setToasterClosing(false);
      }, 300);
    }, 3000);
  };

  const closeToaster = () => {
    setToasterClosing(true);
    setTimeout(() => {
      setToaster({ show: false, type: '', title: '', message: '' });
      setToasterClosing(false);
    }, 300);
  };
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');

  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: '/month',
      features: [
        '3 Projects',
        '1GB Storage',
        'Basic AI Features',
        'Community Support',
        'Candlelight Subdomain'
      ],
      isCurrent: currentPlan === 'Free'
    },
    {
      name: 'Pro',
      price: '$29',
      period: '/month',
      features: [
        'Unlimited Projects',
        '50GB Storage',
        'Advanced AI Features',
        'Priority Support',
        'Custom Domain',
        'Team Collaboration',
        'Advanced Analytics'
      ],
      isCurrent: currentPlan === 'Pro',
      isPopular: true
    },
    {
      name: 'Enterprise',
      price: '$99',
      period: '/month',
      features: [
        'Everything in Pro',
        'Unlimited Storage',
        'White-label Solution',
        'Dedicated Support',
        'Custom Integrations',
        'SLA Guarantee',
        'Advanced Security'
      ],
      isCurrent: currentPlan === 'Enterprise'
    }
  ];

  const [invoices, setInvoices] = useState(() => {
    const saved = localStorage.getItem('candlelight_invoices');
    return saved ? JSON.parse(saved) : [];
  });

  const updateInvoices = (newInvoices: any[]) => {
    setInvoices(newInvoices);
    localStorage.setItem('candlelight_invoices', JSON.stringify(newInvoices));
  };

  const [showAddInvoice, setShowAddInvoice] = useState(false);
  const [invoiceAmount, setInvoiceAmount] = useState('');
  const [invoiceDetails, setInvoiceDetails] = useState('');

  const addInvoice = () => {
    if (!invoiceAmount.trim() || !invoiceDetails.trim()) return;
    const newInvoice = {
      id: `INV-${new Date().getFullYear()}-${String(invoices.length + 1).padStart(3, '0')}`,
      date: new Date().toISOString().split('T')[0],
      amount: invoiceAmount.startsWith('$') ? invoiceAmount : `$${invoiceAmount}`,
      status: 'Paid',
      details: invoiceDetails
    };
    updateInvoices([newInvoice, ...invoices]);
    setInvoiceAmount('');
    setInvoiceDetails('');
    setShowAddInvoice(false);
    showToaster('success', 'Invoice Added', 'New billing record has been created');
  };

  const downloadInvoice = (invoice: any) => {
    const invoiceContent = `
INVOICE

Invoice ID: ${invoice.id}
Date: ${invoice.date}
Amount: ${invoice.amount}
Status: ${invoice.status}
Details: ${invoice.details || 'N/A'}
Plan: ${currentPlan}

Thank you for your business!
    `;
    const blob = new Blob([invoiceContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${invoice.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToaster('success', 'Invoice Downloaded', 'Invoice has been downloaded successfully');
  };

  return (
    <div className="space-y-6 animate-fade-up">
      <div>
        <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
          Subscription & Billing
        </h1>
        <p className="text-muted-foreground">
          Manage your subscription and payment methods
        </p>
      </div>

      {/* Current Plan */}
      <Card glass>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-heading font-bold text-foreground">
              Current Plan: {currentPlan}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              You're on the {currentPlan} plan
            </p>
          </div>
          {currentPlan === 'Free' && (
            <Button variant="primary" onClick={() => showToaster('info', 'Contact Required', 'Please contact the technical team for plan upgrades')}>Upgrade Now</Button>
          )}
        </div>
        
        {/* Usage Meters */}
        <div className="space-y-4 mt-6">
          <div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-foreground">Projects Used</span>
              <span className="text-muted-foreground">2 / 3</span>
            </div>
            <div className="h-2 bg-background rounded-full overflow-hidden">
              <div className="h-full bg-secondary rounded-full" style={{ width: '66%' }}></div>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-foreground">Storage Used</span>
              <span className="text-muted-foreground">450 MB / 1 GB</span>
            </div>
            <div className="h-2 bg-background rounded-full overflow-hidden">
              <div className="h-full bg-secondary rounded-full" style={{ width: '45%' }}></div>
            </div>
          </div>
        </div>
      </Card>

      {/* Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            glass
            className={`relative ${
              plan.isPopular ? 'ring-2 ring-secondary' : ''
            }`}
          >
            {plan.isPopular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium">
                  Most Popular
                </span>
              </div>
            )}
            
            <div className="text-center mb-6">
              <h3 className="text-xl font-heading font-bold text-foreground mb-2">
                {plan.name}
              </h3>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-4xl font-heading font-bold text-foreground">
                  {plan.price}
                </span>
                <span className="text-muted-foreground">{plan.period}</span>
              </div>
            </div>

            <ul className="space-y-3 mb-6">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-secondary flex-shrink-0" />
                  <span className="text-foreground">{feature}</span>
                </li>
              ))}
            </ul>

            <Button
              variant={plan.isCurrent ? 'outline' : plan.isPopular ? 'primary' : 'secondary'}
              className="w-full"
              disabled={plan.isCurrent}
              onClick={() => !plan.isCurrent && showToaster('info', 'Contact Required', 'Please contact the technical team for plan upgrades')}
            >
              {plan.isCurrent ? 'Current Plan' : `Upgrade to ${plan.name}`}
            </Button>
          </Card>
        ))}
      </div>

      {/* Payment Method */}
      <Card glass>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-heading font-bold text-foreground">
            Payment Method
          </h2>
          <Button variant="outline" size="sm" onClick={() => setShowAddCard(true)}>
            <CreditCard className="w-4 h-4 mr-2" />
            Add Card
          </Button>
        </div>
        {cards.length > 0 ? (
          <div className="space-y-3">
            {cards.map((card, index) => (
              <div key={index} className="flex items-center gap-4 p-4 rounded-lg bg-background border border-border">
                <div className="w-12 h-8 rounded bg-secondary/20 flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-secondary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">
                    •••• •••• •••• {card.number.slice(-4)}
                  </p>
                  <p className="text-xs text-muted-foreground">Expires {card.expiry}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => {
                  updateCards(cards.filter((_, i) => i !== index));
                  showToaster('success', 'Card Removed', 'Payment method removed successfully');
                }}>
                  Remove
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-4">No payment method added</p>
        )}
        
        {showAddCard && (
          <div className="mt-4 p-4 border border-border rounded-lg bg-card">
            <h3 className="text-lg font-medium text-foreground mb-4">Add Payment Method</h3>
            <div className="space-y-3">
              <input 
                placeholder="Card Number" 
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-background border border-input text-foreground" 
              />
              <div className="grid grid-cols-2 gap-3">
                <input 
                  type="month"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="px-4 py-2 rounded-lg bg-background border border-input text-foreground" 
                />
                <input 
                  placeholder="CVC" 
                  className="px-4 py-2 rounded-lg bg-background border border-input text-foreground" 
                />
              </div>
              <div className="flex gap-3">
                <Button 
                  variant="primary" 
                  onClick={() => { 
                    updateCards([...cards, { number: cardNumber, expiry: expiryDate }]);
                    setCardNumber('');
                    setExpiryDate('');
                    setShowAddCard(false);
                    showToaster('success', 'Card Added', 'Payment method added successfully');
                  }}
                  disabled={!cardNumber || !expiryDate}
                >
                  Add Card
                </Button>
                <Button variant="outline" onClick={() => setShowAddCard(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Billing History */}
      <Card glass>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-heading font-bold text-foreground">
            Billing History
          </h2>
          <Button variant="outline" size="sm" onClick={() => setShowAddInvoice(true)}>
            Add Invoice
          </Button>
        </div>
        {invoices.length > 0 ? (
          <div className="space-y-3">
            {invoices.map((invoice) => (
              <div
                key={invoice.id}
                className="flex items-center justify-between p-4 rounded-lg bg-background border border-border"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">{invoice.id}</p>
                  <p className="text-xs text-muted-foreground">{invoice.date}</p>
                  {invoice.details && <p className="text-xs text-muted-foreground mt-1">{invoice.details}</p>}
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-foreground">{invoice.amount}</span>
                  <span className="px-2 py-1 rounded-lg bg-secondary/20 text-secondary text-xs font-medium">
                    {invoice.status}
                  </span>
                  <Button variant="ghost" size="sm" onClick={() => downloadInvoice(invoice)}>
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-8">No billing history available</p>
        )}
        
        {showAddInvoice && (
          <div className="mt-4 p-4 border border-border rounded-lg bg-card">
            <h3 className="text-lg font-medium text-foreground mb-4">Add New Invoice</h3>
            <div className="space-y-3">
              <input 
                placeholder="Amount (e.g., 29.00)" 
                value={invoiceAmount}
                onChange={(e) => setInvoiceAmount(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-background border border-input text-foreground" 
              />
              <textarea 
                placeholder="Invoice details or description" 
                value={invoiceDetails}
                onChange={(e) => setInvoiceDetails(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-background border border-input text-foreground h-20 resize-none" 
              />
              <div className="flex gap-3">
                <Button 
                  variant="primary" 
                  onClick={addInvoice}
                  disabled={!invoiceAmount.trim() || !invoiceDetails.trim()}
                >
                  Add Invoice
                </Button>
                <Button variant="outline" onClick={() => setShowAddInvoice(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>
      
      {/* Theme-based Toaster */}
      {toaster.show && (
        <div className={`fixed bottom-4 right-4 z-50 transition-all duration-300 ${toasterClosing ? 'translate-y-full opacity-0' : 'translate-y-0 opacity-100'}`}>
          <div className="bg-card border border-border rounded-lg p-4 shadow-lg max-w-sm">
            <div className="flex items-start gap-3">
              <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                toaster.type === 'success' ? 'bg-secondary' : 
                toaster.type === 'error' ? 'bg-destructive' : 
                'bg-secondary'
              }`}></div>
              <div className="flex-1">
                <p className="text-sm font-heading font-medium text-foreground mb-1">
                  {toaster.title}
                </p>
                <p className="text-xs text-muted-foreground font-sans">
                  {toaster.message}
                </p>
              </div>
              <button 
                onClick={closeToaster}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
