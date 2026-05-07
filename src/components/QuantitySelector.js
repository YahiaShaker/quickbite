function QuantitySelector({ value, onChange, compact = false }) {
  const nextValue = (amount) => Math.max(1, value + amount);

  return (
    <div className={compact ? "quantity-selector quantity-selector--compact" : "quantity-selector"}>
      <button type="button" aria-label="Decrease quantity" onClick={() => onChange(nextValue(-1))}>
        -
      </button>
      <span>{value}</span>
      <button type="button" aria-label="Increase quantity" onClick={() => onChange(nextValue(1))}>
        +
      </button>
    </div>
  );
}

export default QuantitySelector;
