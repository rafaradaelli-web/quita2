export default function Card({title, children, className}){
  return (
    <section className={`card p-4 ${className||""}`}>
      {title && <h2 className="mb-2 text-lg font-semibold">{title}</h2>}
      {children}
    </section>
  );
}
