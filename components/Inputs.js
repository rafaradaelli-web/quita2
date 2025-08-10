export function Input({label, placeholder, value, onChange, type="text"}){
  return (
    <label className="text-sm text-white/80">
      {label}
      <input type={type} placeholder={placeholder} value={value}
        onChange={(e)=>onChange?.(e.target.value)}
        className="mt-1 w-full rounded-xl p-2 bg-[var(--s2)]"/>
    </label>
  );
}
export function NumberInput(props){ return <Input {...props} type="number"/> }
export function Currency({label, placeholder, value, onChange}){
  return (
    <label className="text-sm text-white/80">
      {label}
      <input inputMode="decimal" placeholder={placeholder} value={value}
        onChange={(e)=> onChange?.(e.target.value.replace(/[^0-9.,-]/g, ""))}
        className="mt-1 w-full rounded-xl p-2 bg-[var(--s2)]"/>
    </label>
  );
}
export function Select({label, value, onChange, options}){
  return (
    <label className="text-sm text-white/80">
      {label}
      <select value={value} onChange={(e)=>onChange?.(e.target.value)}
        className="mt-1 w-full rounded-xl p-2 bg-[var(--s2)]">
        {options.map(o=> <option key={o.v} value={o.v}>{o.l}</option>)}
      </select>
    </label>
  );
}
