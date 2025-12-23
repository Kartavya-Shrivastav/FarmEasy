export const loadRazorpay = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const openRazorpayCheckout = async (options) => {
  const loaded = await loadRazorpay();
  
  if (!loaded) {
    alert('Razorpay SDK failed to load');
    return;
  }

  const rzp = new window.Razorpay(options); // ✅ Just use options as-is
  rzp.open();
};
