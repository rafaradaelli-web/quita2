export default function Info({ tip }) {
  return (
    <span className="relative inline-block align-middle group ml-1">
      <span className="inline-flex h-4 w-4 items-center justify-center rounded-full text-[10px] bg-white/20 text-white">?</span>
      <span className="pointer-events-none absolute left-1/2 hidden -translate-x-1/2 group-hover:block z-30">
        <span className="mt-2 block max-w-xs rounded-md p-2 text-xs bg-black/90 text-white">{tip}</span>
      </span>
    </span>
  );
}
