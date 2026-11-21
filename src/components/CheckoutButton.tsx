import React, { useEffect, useState } from 'react';
import { Tooltip } from './Tooltip';
import {
  CHECKOUT_PRODUCT_DISPLAY,
  type CheckoutProductId,
} from '../lib/checkoutProducts';

interface CheckoutButtonProps {
  productId: CheckoutProductId;
  /** Mailto link used while card checkout is not configured yet. */
  fallbackHref: string;
  /** Classes for the button / fallback link (each page keeps its own styling). */
  className?: string;
  /** Layout classes for the wrapper (e.g. "w-full" on the Support page). */
  layoutClassName?: string;
  /** Button label. Defaults to the catalog label ("Buy — $10.99", ...). */
  label?: string;
}

/**
 * Card-checkout button with a mailto fallback.
 *
 * On mount it asks /api/checkout/config whether Stripe is configured.
 * While that is unknown — or while checkout is off — it renders the
 * mailto link, so nobody ever hits a dead button. When checkout is live
 * it posts to /api/checkout and redirects to the Stripe-hosted page.
 * No card data ever touches this site.
 */
export default function CheckoutButton({
  productId,
  fallbackHref,
  className = '',
  layoutClassName = '',
  label,
}: CheckoutButtonProps) {
  const [available, setAvailable] = useState<boolean | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const product = CHECKOUT_PRODUCT_DISPLAY[productId];

  useEffect(() => {
    let cancelled = false;
    fetch('/api/checkout/config')
      .then((res) => (res.ok ? res.json() : { checkoutAvailable: false }))
      .then((data) => {
        if (!cancelled) setAvailable(Boolean(data.checkoutAvailable));
      })
      .catch(() => {
        if (!cancelled) setAvailable(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const startCheckout = async () => {
    setPending(true);
    setError(null);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });
      const data: {
        url?: unknown;
        message?: unknown;
        checkoutAvailable?: unknown;
      } = await res.json().catch(() => ({}));
      if (res.status === 501 || data.checkoutAvailable === false) {
        // Card checkout is not configured yet — fall back to email ordering.
        window.location.href = fallbackHref;
        return;
      }
      if (!res.ok || typeof data.url !== 'string') {
        throw new Error(
          typeof data.message === 'string'
            ? data.message
            : 'Checkout could not be started.',
        );
      }
      window.location.href = data.url;
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Checkout could not be started.',
      );
    } finally {
      setPending(false);
    }
  };

  // Loading, or checkout off: the mailto fallback. Same classes as the
  // button, so the card never shifts when checkout comes live.
  if (available !== true) {
    return (
      <Tooltip
        content="Email to order — card checkout is coming soon"
        className={layoutClassName}
      >
        <a href={fallbackHref} className={className}>
          {label ?? product.fallbackLabel}
        </a>
      </Tooltip>
    );
  }

  return (
    <span className={`inline-flex flex-col gap-2 ${layoutClassName}`}>
      <Tooltip content="Pay securely with Stripe" className={layoutClassName}>
        <button
          type="button"
          onClick={startCheckout}
          disabled={pending}
          aria-busy={pending}
          className={className}
        >
          {pending ? 'Opening checkout…' : (label ?? product.checkoutLabel)}
        </button>
      </Tooltip>
      {error && (
        <span role="alert" className="text-xs text-red-400 leading-relaxed">
          {error}{' '}
          <a href={fallbackHref} className="underline">
            Email to order instead
          </a>
          .
        </span>
      )}
    </span>
  );
}
