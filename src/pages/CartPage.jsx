import { useState } from "react";
import { Link } from "react-router-dom";
import { useCartStore, getTotalItems, getTotalPrice } from "../store/cartStore.js";
import { useToast } from "../context/ToastContext.jsx";
import Modal from "../components/ui/Modal.jsx";
import { EmptyMessage } from "../components/ui/StatusMessage.jsx";

// the cart is GLOBAL state: the shop button, this page and the dashboard
// all read the same Zustand store
export default function CartPage() {
  const { items, changeQuantity, removeItem, clearCart } = useCartStore();
  const { showToast } = useToast();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const placeOrder = () => {
    clearCart();
    setIsCheckoutOpen(false);
    showToast("Order placed! (demo, nothing was charged)", "success");
  };

  return (
    <div>
      <Link to="/shop">&larr; Back to the shop</Link>
      <h1>Your cart</h1>

      {items.length === 0 && <EmptyMessage text="Your cart is empty." />}

      <ul className="list-plain">
        {items.map((item) => (
          <li key={item.id} className="card cart-item">
            <img src={item.thumbnail} alt="" className="cart-item__image" />
            <div className="cart-item__info">
              <strong>{item.title}</strong>
              <span className="hint">${item.price.toFixed(2)} each</span>
            </div>
            <div className="row">
              <button type="button" className="btn btn--sm" aria-label={"One less " + item.title} onClick={() => changeQuantity(item.id, -1)}>-</button>
              <span>{item.quantity}</span>
              <button type="button" className="btn btn--sm" aria-label={"One more " + item.title} onClick={() => changeQuantity(item.id, 1)}>+</button>
            </div>
            <strong>${(item.price * item.quantity).toFixed(2)}</strong>
            <button type="button" className="btn btn--sm btn--danger" onClick={() => removeItem(item.id)}>Remove</button>
          </li>
        ))}
      </ul>

      {items.length > 0 && (
        <div className="card">
          <p>Items: <strong>{getTotalItems(items)}</strong> &middot; Total: <strong>${getTotalPrice(items).toFixed(2)}</strong></p>
          <div className="row">
            <button type="button" className="btn btn--primary" onClick={() => setIsCheckoutOpen(true)}>Checkout</button>
            <button type="button" className="btn btn--danger" onClick={clearCart}>Empty cart</button>
          </div>
        </div>
      )}

      <Modal title="Confirm your order" isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)}>
        <p>Order {getTotalItems(items)} item(s) for <strong>${getTotalPrice(items).toFixed(2)}</strong>?</p>
        <div className="row">
          <button type="button" className="btn btn--primary" onClick={placeOrder}>Place order</button>
          <button type="button" className="btn" onClick={() => setIsCheckoutOpen(false)}>Keep shopping</button>
        </div>
      </Modal>
    </div>
  );
}
